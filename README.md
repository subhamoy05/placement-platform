# Placement & Interview Preparation Platform

A full-stack platform designed to help students prepare for campus placements through DSA practice, SQL practice, coding assessments, company-wise preparation, interview preparation, and progress tracking.

---

## 🚀 Features

### 👨‍🎓 Student Features

- Student authentication
- Student profile management
- DSA coding practice
- Python code execution
- SQL practice
- SQL query execution
- Coding submission history
- Assessment system
- Assessment scoring
- Company-wise preparation
- Student progress tracking
- Student dashboard
- Interview preparation

### 👨‍💼 Admin Features

- Create DSA questions
- Update DSA questions
- Delete DSA questions
- Create SQL questions
- Update SQL questions
- Delete SQL questions
- Create assessments
- Update assessments
- Delete assessments
- Create companies
- Update companies
- Delete companies

---

# 🏗️ Project Architecture

```text
placement-platform/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── coding-engine/
│   ├── python-engine/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── venv/
│   │
│   └── sql-engine/
│       ├── main.py
│       ├── requirements.txt
│       └── venv/
│
└── README.md