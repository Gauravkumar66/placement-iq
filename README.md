# Placement IQ — AI-Powered Placement Intelligence System
> *Turn skills into opportunities. Know where you stand. Know what to do next.*

Placement IQ is a production-quality, full-stack career and placement intelligence platform designed for colleges, training institutions, students, placement officers (TPOs), and technical recruiters.

Unlike generic administrative dashboards or keyword resume-matchers, Placement IQ treats career readiness as an **evidence-backed, actionable feedback loop**. It computes explainable readiness scores, isolates highest-leverage skill blockers, generates personalized day-by-day roadmaps, and allows placement cells to simulate how training interventions (bootcamps, workshops) expand batch-level hiring eligibility before recruitment drives begin.

---

## 🌟 Key Features

### 🎓 1. Student Intelligence
- **Humanized Career Narrative**: An encouraging coaching dashboard ("Good evening, Manisha. You're 7 points away from your target.").
- **Evidence-Based Skill Engine**: Skills are distinguished between **✓ VERIFIED** (code repositories, project depth, diagnostic assessments, internships) and **△ UNVERIFIED** (resume mentions only).
- **Multi-Factor Placement Readiness (0-100)**: Transparent weighted breakdown across Technical Skills (30%), Role Compatibility (20%), Diagnostic Assessments (20%), Projects (15%), and Communication (10%).
- **Prioritized Skill Blockers**: Pinpoints exact high-leverage bottlenecks (e.g., "Raising DSA from 61% → 75% increases your Backend Developer readiness from 68 → 74").
- **14-Day Preparation Roadmap**: Step-by-step preparation plan targeting specific missing skills.
- **Interview & Test Deficiency Analyzer**: Input questions faced in technical tests or interviews with company name & tech field to receive an automated hiring-bar diagnostic revealing exact lacking skills and a 7-day recovery roadmap.
- **Career Guide AI**: Profile-grounded intelligent career assistant answering questions using the student's real profile data without hallucinating experience.

### 🏛️ 2. Placement Officer (TPO) Intelligence
- **Batch Readiness Distribution**: Instant breakdown of Highly Ready, Placement Ready, Near Ready, and At-Risk candidate tiers.
- **Department Capability Comparison**: Cross-department metrics comparing CSE, IT, ECE, and BCA batches.
- **Department × Skill Capability Heatmap**: Granular proficiency matrix across Java, Python, SQL, DSA, and Cloud DevOps with accessible visual signals.
- **Signature Feature: What-If Placement Simulator**: Select upcoming company job roles and test hypotheses (e.g., *"What if we run a 2-week DSA bootcamp?"*). Projects estimated candidate eligibility increase (e.g., `183 → 267 candidates (+84)`) with explicit disclaimers.
- **Batch Roster with Server-Side Search & Filters**: Paginated directory with department, role, and readiness filters.

### 💼 3. Recruiter Intelligence
- **Evidence-Backed Talent Discovery**: Discover candidates based on verified repositories and assessments, not superficial resume keywords.
- **Mandatory Candidate Explainability**: Every match score displays a *"WHY THIS CANDIDATE?"* card detailing verified project count, assessment metrics, and development areas.
- **Pipeline Tracking**: Shortlist, track assessment status, and invite candidates directly.

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **UI & Design System**: Material UI (MUI) styled with Material 3-inspired design tokens
- **Routing**: React Router v7 with role-based Protected Routes (`STUDENT`, `TPO`, `RECRUITER`, `ADMIN`)
- **State & Data Fetching**: TanStack Query (React Query)
- **Forms & Validation**: React Hook Form + Zod
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT interceptors & auto-refresh

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Data Modeling & ORM**: SQLAlchemy 2.0 (with SQLite dev fallback and full PostgreSQL production support)
- **Schema Validation**: Pydantic v2
- **Authentication**: JWT (Access + Refresh tokens) with direct `bcrypt` password hashing
- **Role-Based Access Control (RBAC)**: Strictly enforced at both route dependency and service layers
- **Machine Learning & Analytics**: scikit-learn, pandas, numpy

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+) & npm
- Python (3.11+)

### 1. Clone & Set Up Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt email-validator

# Run backend server (will automatically create database tables and seed demo accounts)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at `http://127.0.0.1:8000`.  
Swagger interactive documentation: `http://127.0.0.1:8000/docs`

---

### 2. Set Up Frontend

In a separate terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend application will start at `http://localhost:5173`.

---

## 🔑 Demo Credentials

Placement IQ comes pre-seeded with realistic, verified demo accounts for every persona.  
You can sign in using the **1-Click Demo Buttons** on the login page or manually enter credentials:

| Persona | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Student** | `student@example.com` | `Password123!` | `STUDENT` |
| **Placement Officer (TPO)** | `tpo@example.com` | `Password123!` | `TPO` |
| **Recruiter** | `recruiter@example.com` | `Password123!` | `RECRUITER` |
| **Administrator** | `admin@example.com` | `Password123!` | `ADMIN` |

---

## ⏱️ 5-Minute Demonstration Flow

1. **Sign in as Student (`student@example.com`)**:
   - Observe the narrative greeting and readiness score (**68 / 100**).
   - Review the **Evidence-Verified Skills** card (Java verified via projects, Spring Boot unverified).
   - Review **Target Role Compatibility** (Backend Developer at 72% fit).
2. **Interactive Assessment**:
   - Click **"Take DSA Assessment"** or **"Start 5-Question DSA Diagnostic"**.
   - Submit answers to verify algorithmic mastery.
   - Observe the immediate live update: **DSA score rises from 61% → 76%**, and overall **Readiness jumps from 68 → 74**!
3. **Open Career Guide AI**:
   - Click the floating assistant button in the bottom right corner.
   - Click the prompt *"Why is my readiness low?"* or *"What should I learn this week?"*.
   - See grounded, real profile analysis without generic placeholder responses.
4. **Switch to Placement Officer (`tpo@example.com`)**:
   - Use the top navigation role switcher to jump to TPO.
   - Review the **Batch Roster** and **Department × Skill Capability Heatmap**.
   - Navigate to the **What-If Placement Simulator**.
   - Select **DSA Intensive Bootcamp** (+15% growth) and click **"Run Simulation"**.
   - See the projected jump: **Eligible candidates increase from 183 → 267 (+84 students)**!
5. **Switch to Recruiter (`recruiter@example.com`)**:
   - Review the candidate pipeline and matched candidates.
   - Inspect the **"WHY THIS CANDIDATE?"** card for Aarav Patel, reviewing evidence sources, project counts, and verified assessment scores.
   - Click **"Shortlist Candidate"** to confirm candidate advancement.

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
.\venv\Scripts\pytest
```
*Runs unit tests for authentication, JWT generation, invalid credentials, and the What-If simulation engine.*

### Frontend Production Build
```bash
cd frontend
npm run build
```
*Compiles TypeScript and bundles production assets via Vite with zero compiler errors.*

---

## 🐳 Docker Deployment

To launch the complete multi-container stack (PostgreSQL, Backend, Frontend) with Docker:

```bash
docker compose up --build
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 📜 License
MIT License. Built for colleges and universities striving for evidence-based student career success.
