# Smart Campus Complaint Management System

An enterprise-grade, full-stack campus grievance redressal and maintenance dispatching platform built with modern **React, TypeScript, Tailwind CSS**, and architected around a high-performance **Python FastAPI + SQLAlchemy ORM + MySQL 8.0** backend with **JWT Role-Based Access Control (RBAC)**.

---

## 🏛️ System Architecture Overview

- **Frontend Application**: React 18, TypeScript, Tailwind CSS, Lucide Icons, responsive single-page architecture with dynamic role routing.
- **Backend Architecture**: Python 3.11, FastAPI (ASGI via Uvicorn), Pydantic v2 schemas for runtime validation, OAuth2 Password Bearer with HS256 JWT tokens.
- **Relational Persistence**: MySQL 8.0 database normalized to **Third Normal Form (3NF)** with foreign key cascade rules, indexes, and full audit trail logging.

---

## 👥 Three Core Role Experiences

### 1. 🎓 Student Experience
- **Grievance Submission**: File complaints across categories (*Electrical, WiFi, Classrooms, Hostels, Library, Cleanliness, Transport*) with priority flags, building/room locations, and optional photo attachments.
- **Live Ticket Status Tracking**: Real-time status badges (`PENDING` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `RESOLVED`).
- **Interactive Timeline**: Inspect diagnostic comments, technician dispatches, and resolution notes.

### 2. 🛡️ Campus Administrator Control Center
- **Triage & Allocation Dashboard**: Real-time breakdown of campus infrastructure complaints, resolution rates, and SLA compliance metrics.
- **Technician Dispatch**: Allocate field technicians based on domain expertise and add administrative repair instructions.
- **Priority Overrides & Audit Log**: Modify urgency levels and record system audit notes.
- **Campus User Directory**: Manage student credentials, technician staffing, and administrator permissions.

### 3. 🔧 Field Service Technician Station
- **Assigned Work Orders Queue**: View dispatched maintenance tickets with student contact info, locations, and admin notes.
- **Action Triggers**: Move tickets into `IN_PROGRESS` and `RESOLVED`.
- **Diagnostic Remarks**: Submit technical notes and details of replaced parts.

---

## 🚀 Learning & Engineering Preparation Hub

Built-in interactive educational modules for university project presentations and Associate Software Engineer viva / technical interviews:
- **System Architecture Visualizer**: Layered client-server-database lifecycle breakdown.
- **MySQL 3NF Schema & ER Structure**: DDL schemas for `users`, `categories`, `complaints`, `assignments`, and `complaint_updates`.
- **SQL Query Lab**: Interactive query runner with simulated `SELECT`, `JOIN`, and `GROUP BY` aggregations.
- **FastAPI Code Walkthrough**: Authentic Python implementations for `models.py`, `schemas.py`, `auth.py`, and `crud.py`.
- **Top Associate SDE Interview Q&As**: Comprehensive answers to questions on SQLAlchemy session lifecycles, SQL injection prevention, JWT security, and 100k+ user scaling strategies.
- **Live REST API Explorer**: Swagger-style interactive API tester.

---

## 🔐 Default Demo Accounts (1-Click Switcher Available in Navigation)

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Student** | Aarav Sharma | `aarav.student@campus.edu` | `student123` |
| **Technician** | Rajesh Kumar | `rajesh.tech@campus.edu` | `tech123` |
| **Admin** | Dr. Anita Verma | `admin@campus.edu` | `admin123` |
