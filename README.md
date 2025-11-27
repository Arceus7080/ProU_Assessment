# ProU Assessment — Employee Task Manager

A simple full-stack application built for the ProU Frontend/Backend/Full-Stack Developer Assessment.

This project includes:
- A clean and responsive **HTML/CSS/JavaScript frontend**
- A **Node.js + Express backend**
- A **MySQL database**, with Workbench for visualization
- REST APIs for managing **Employees** and **Tasks**, with the ability to **assign/unassign tasks**

---

## Project Overview

This Employee Task Manager allows:
- Adding, viewing, updating, and deleting **employees**
- Adding, viewing, updating, assigning, unassigning, and deleting **tasks**
- Viewing all tasks along with the assigned employee
- Fully persistent storage using MySQL

The UI is intentionally built in **plain HTML, CSS, and JavaScript** (no frameworks), as per the assessment’s requirement.

---

## System Architecture

### System Design  
Frontend (Browser) → Backend (Node.js/Express) → MySQL (Workbench)

![System Architecture](docs/system.png)

---

### Database Schema (ER Diagram)

The application uses two tables: `employees` and `tasks`.

![Database Schema](docs/DB.png)

---

## Setup Steps

### **Prerequisites**
- Node.js (v16+ recommended)
- MySQL Server installed & running locally
- MySQL Workbench or phpMyAdmin (optional but helpful)

---

### **1. Create the database and user**

Run this in MySQL Workbench or terminal:

```sql
CREATE DATABASE IF NOT EXISTS prou_db;
CREATE USER IF NOT EXISTS 'prou_user'@'localhost' IDENTIFIED BY 'prou_pass';
GRANT ALL PRIVILEGES ON prou_db.* TO 'prou_user'@'localhost';
FLUSH PRIVILEGES;
