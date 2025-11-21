# TinyLink – URL Shortener

TinyLink is a minimal URL shortening service similar to bit.ly.  
It lets users:

- Create short URLs with optional custom codes  
- View click statistics for each link  
- Manage links from a dashboard (list, filter, delete)  
- Redirect from `/{code}` to the target URL  

This project is a take-home assignment implemented using:

- **Backend:** Node.js + Express + MySQL  
- **Frontend:** React + Vite + plain CSS  
- **Deployment:** (Example) Render for backend + MySQL on Railway (Update with your actual hosting)  

---

## Table of Contents

1. [Demo & Links](#demo--links)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [System Design Overview](#system-design-overview)  
5. [Data Model](#data-model)  
6. [API Specification](#api-specification)  
7. [Routing Overview](#routing-overview)  
8. [Validation Rules](#validation-rules)  
9. [Local Development Setup](#local-development-setup)  
10. [Environment Variables](#environment-variables)  
11. [Running the App](#running-the-app)  
12. [Building for Production](#building-for-production)  
13. [Deployment Notes](#deployment-notes)  
14. [Testing Notes](#testing-notes)  
15. [Possible Improvements](#possible-improvements)  
16. [LLM / ChatGPT Usage](#llm--chatgpt-usage)

---

## Demo & Links

- **Live App:**  
  `https://<your-tinylink-domain>`  

- **Backend (API) Base URL:**  
  `https://<your-backend-domain>`  

- **GitHub Repository:**  
  `https://github.com/<yourname>/tinylink`  

- **Video Walkthrough:**  
  `https://<your-video-link>`  

- **ChatGPT / LLM Transcript:**  
  `https://<your-chatgpt-transcript-link>`

> 🔧 All URLs above are placeholders – replace them with your actual links.

---

## Features

### Core Features

- **Create Short Links**
  - Input long URL
  - Optional custom shortcode (`[A-Za-z0-9]{6,8}`)
  - Validates URL format (`http://` or `https://` only)
  - Returns short URL as `<BASE_URL>/<shortcode>`
  - 409 error if shortcode already exists

- **Redirect**
  - Visiting `/{code}` performs an **HTTP 302 redirect** to the original URL
  - Each redirect:
    - Increments `total_clicks`
    - Updates `last_clicked` timestamp

- **Delete Links**
  - Delete a short link from the dashboard
  - After deletion:
    - `/{code}` returns **404**
    - No more redirects

### UI / UX Features

- **Dashboard (`/`)**
  - Create short links (with inline validation & loading state)
  - View table of all existing links
  - Filter by code or URL
  - Copy short URLs with one click
  - Delete links

- **Stats Page (`/code/:code`)**
  - View stats for a single shortcut:
    - Short URL
    - Original URL
    - Total clicks
    - Last clicked time
    - Created at

- **Healthcheck (`/healthz`)**
  - Returns system health info and version
  - Useful for automated testing / uptime checks

- **UX States**
  - Loading indicators for data fetches
  - Inline error messages for validation errors
  - Disabled buttons while loading
  - Empty state copy when no links exist
  - Responsive layout for small screens

---

## Tech Stack

**Backend**

- Node.js  
- Express.js  
- MySQL (via `mysql2/promise`)  
- `dotenv` for configuration  
- `morgan` for HTTP logging  

**Frontend**

- React 18  
- Vite (bundler & dev server)  
- React Router (`react-router-dom`)  
- Plain CSS (no heavy UI framework)

---

## System Design Overview

### High-Level Architecture

- **Client (React)**  
  - Single-page app served by Express in production  
  - Communicates with backend via REST API (`/api/...`)

- **Server (Express)**  
  - Exposes:
    - Public pages: `/`, `/code/:code`, `/:code`
    - REST APIs: `/api/links`, `/api/links/:code`
    - Health: `/healthz`
  - Handles URL validation, code uniqueness, redirects, and stats updates

- **Database (MySQL)**  
  - Single `links` table storing:
    - `code`, `target_url`, `total_clicks`, `last_clicked`, `created_at`
  - `code` is `UNIQUE`

### Request Flow Example: Redirect

1. User visits `https://<BASE_URL>/abc123`
2. Express route `GET /:code`:
   - Validates code format
   - Finds record by `code`
   - Uses a transaction or row lock (`FOR UPDATE`) to safely:
     - Increment `total_clicks`
     - Update `last_clicked = NOW()`
   - Responds with `302 Location: <target_url>`
3. Browser follows redirect to the original URL

---

## Data Model

### Table: `links`

```sql
CREATE TABLE IF NOT EXISTS links (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(8) NOT NULL UNIQUE,
  target_url TEXT NOT NULL,
  total_clicks INT UNSIGNED NOT NULL DEFAULT 0,
  last_clicked DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
