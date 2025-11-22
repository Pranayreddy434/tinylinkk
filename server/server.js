// server/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ---- Helpers ----

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function isValidCode(code) {
  return CODE_REGEX.test(code);
}

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

async function generateUniqueCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6;
  let code;
  let exists = true;

  while (exists) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = result;
    const [rows] = await pool.query('SELECT id FROM links WHERE code = ?', [code]);
    exists = rows.length > 0;
  }

  return code;
}

// ---- Healthcheck ----

app.get('/healthz', (req, res) => {
  res.status(200).json({
    ok: true,
    version: '1.0',
    uptime: process.uptime()
  });
});

// ---- API Routes ----

// POST /api/links — Create link (409 if code exists)
app.post('/api/links', async (req, res) => {
  try {
    let { url, code } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'url is required' });
    }

    url = url.trim();

    if (!isValidUrl(url)) {
      return res.status(400).json({
        error: 'Invalid URL. Must be a valid http:// or https:// URL'
      });
    }

    if (code) {
      code = code.trim();
      if (!isValidCode(code)) {
        return res.status(400).json({
          error: 'Invalid code format. Use 6-8 alphanumeric characters [A-Za-z0-9]'
        });
      }

      const [existing] = await pool.query(
        'SELECT id FROM links WHERE code = ?',
        [code]
      );
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    } else {
      code = await generateUniqueCode();
    }

    await pool.query(
      'INSERT INTO links (code, target_url, total_clicks) VALUES (?, ?, 0)',
      [code, url]
    );

    return res.status(201).json({
      code,
      url,
      shortUrl: `${BASE_URL}/${code}`,
      total_clicks: 0,
      last_clicked: null
    });
  } catch (err) {
    console.error('POST /api/links error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/links — List all links (NOW includes shortUrl)
app.get('/api/links', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         code, 
         target_url AS url, 
         total_clicks, 
         last_clicked, 
         created_at,
         CONCAT(?, '/', code) AS shortUrl
       FROM links
       ORDER BY created_at DESC`,
      [BASE_URL]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/links error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/links/:code — Stats for one code (NOW includes shortUrl)
app.get('/api/links/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const [rows] = await pool.query(
      `SELECT 
         code, 
         target_url AS url, 
         total_clicks, 
         last_clicked, 
         created_at,
         CONCAT(?, '/', code) AS shortUrl
       FROM links
       WHERE code = ?`,
      [BASE_URL, code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('GET /api/links/:code error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/links/:code — Delete link
app.delete('/api/links/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const [result] = await pool.query(
      'DELETE FROM links WHERE code = ?',
      [code]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    // 204 No Content as per REST best practices
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /api/links/:code error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---- Static Frontend (React build) ----

const clientDistPath = path.join(__dirname, 'client', 'dist');

app.use(express.static(clientDistPath));

// Serve index.html for dashboard and stats page
app.get('/', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.get('/code/:code', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// ---- Redirect Route ----
// Must come AFTER /healthz, /api, /code/:code, and static files
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    if (!isValidCode(code)) {
      // Any random path that doesn’t match code pattern => 404
      return res.status(404).send('Not found');
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Lock row so clicks update safely
      const [rows] = await conn.query(
        'SELECT target_url FROM links WHERE code = ? FOR UPDATE',
        [code]
      );

      if (rows.length === 0) {
        await conn.rollback();
        conn.release();
        return res.status(404).send('Not found');
      }

      const targetUrl = rows[0].target_url;

      await conn.query(
        'UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code = ?',
        [code]
      );

      await conn.commit();
      conn.release();

      // 302 redirect
      res.redirect(302, targetUrl);
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  } catch (err) {
    console.error('GET /:code redirect error:', err);
    res.status(500).send('Internal server error');
  }
});

// ---- Start server ----

app.listen(PORT, () => {
  console.log(`TinyLink server running at ${BASE_URL}`);
});
