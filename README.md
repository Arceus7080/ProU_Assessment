# ProU Assessment — Employee Task Manager

## Overview
Simple full-stack app for the ProU assessment:
- Frontend: plain HTML / CSS / JavaScript (single-page app).
- Backend: Node.js + Express connecting to **MySQL**.
- Database: MySQL (local). Use MySQL Workbench or phpMyAdmin to view the DB.

## Folder structure
See repo root. Key folders:
- `frontend/` — UI
- `backend/` — Node server and migrations
- `docs/` — diagrams, endpoints, screenshots

## Quick start (local, no Docker)
1. Install MySQL Server and MySQL Workbench (or phpMyAdmin).
2. Create DB & user:
   ```sql
   CREATE DATABASE IF NOT EXISTS prou_db;
   CREATE USER IF NOT EXISTS 'prou_user'@'localhost' IDENTIFIED BY 'prou_pass';
   GRANT ALL PRIVILEGES ON prou_db.* TO 'prou_user'@'localhost';
   FLUSH PRIVILEGES;
