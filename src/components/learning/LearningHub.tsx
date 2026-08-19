import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Database,
  ShieldCheck,
  Cpu,
  Layers,
  HelpCircle,
  Play,
  CheckCircle2,
  Terminal,
  FileCode,
  ArrowRight,
  Server,
  Key,
  Flame,
  Zap,
  Check,
  Copy
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';

export const LearningHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ARCHITECTURE' | 'DATABASE' | 'INTERVIEW_QA' | 'FASTAPI_CODE' | 'QUERY_SIMULATOR'>('ARCHITECTURE');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedQAIndex, setSelectedQAIndex] = useState<number>(0);

  // Query simulator state
  const [queryInput, setQueryInput] = useState('SELECT * FROM complaints WHERE status = "PENDING";');
  const [queryResult, setQueryResult] = useState<any>(null);
  const { complaints } = useComplaints();

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRunQuery = () => {
    const q = queryInput.trim().toUpperCase();
    if (q.includes('WHERE STATUS = "PENDING"') || q.includes("WHERE STATUS = 'PENDING'")) {
      setQueryResult(complaints.filter(c => c.status === 'PENDING'));
    } else if (q.includes('PRIORITY = "HIGH"') || q.includes("PRIORITY = 'HIGH'")) {
      setQueryResult(complaints.filter(c => c.priority === 'HIGH'));
    } else if (q.includes('JOIN') || q.includes('ASSIGNMENT')) {
      setQueryResult(
        complaints
          .filter(c => c.assignment)
          .map(c => ({
            ticket_id: c.ticketId,
            title: c.title,
            student: c.studentName,
            technician: c.assignment?.technicianName,
            tech_phone: c.assignment?.technicianPhone,
            assigned_at: c.assignment?.assignedAt
          }))
      );
    } else if (q.includes('COUNT') || q.includes('GROUP BY')) {
      const counts: Record<string, number> = {};
      complaints.forEach(c => {
        counts[c.categoryName] = (counts[c.categoryName] || 0) + 1;
      });
      setQueryResult(Object.entries(counts).map(([category, count]) => ({ category, total_complaints: count })));
    } else {
      setQueryResult(complaints.slice(0, 5));
    }
  };

  const interviewQAs = [
    {
      question: '1. Why choose FastAPI over Flask or Django for this backend?',
      category: 'FastAPI & Architecture',
      answer: `FastAPI offers significant advantages for modern API-first architectures:
• **Asynchronous Performance**: Built natively on Starlette and ASGI with Python's asyncio (uvicorn), rivaling NodeJS and Go speeds.
• **Automatic Type Validation**: Uses Pydantic to validate request/response payloads at runtime with detailed automatic 422 error outputs.
• **OpenAPI (Swagger) Generation**: Generates interactive Swagger documentation at /docs automatically from Python type hints without extra decorators.
• **Dependency Injection**: Built-in Depends() simplifies database session lifecycle (get_db) and JWT token authentication.`
    },
    {
      question: '2. How does SQLAlchemy prevent SQL Injection vulnerabilities?',
      category: 'Database & Security',
      answer: `SQLAlchemy eliminates SQL Injection through:
1. **Parameterized Queries**: User inputs are never concatenated directly into raw SQL strings. They are sent as bound parameters to the database engine.
2. **Abstract Syntax Tree (AST)**: The ORM converts Python expressions (e.g., db.query(Complaint).filter(Complaint.id == input_id)) into parameterized placeholders (:id_1).
3. **Escaping**: If raw SQL is needed, text() with bindparams ensures parameters are sanitized and escaped by the MySQL DBAPI driver.`
    },
    {
      question: '3. Explain the JWT Authentication and RBAC Flow in this system.',
      category: 'Security & Auth',
      answer: `The security architecture works in 4 core steps:
1. **Login & Hash Verification**: User submits email/password. Password is verified against the bcrypt salted hash in MySQL.
2. **Token Generation**: Server encodes a payload containing {sub: email, user_id: 1, role: 'ADMIN', exp: timestamp} signed with HMAC-SHA256 (HS256) and a SECRET_KEY.
3. **Authorization Header**: Client sends "Authorization: Bearer <jwt_token>" with every request.
4. **FastAPI Dependency Injection**:
\`\`\`python
async def get_current_admin(user: User = Depends(get_current_user)):
    if user.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user
\`\`\``
    },
    {
      question: '4. How is Database Normalization (3NF) maintained in this schema?',
      category: 'Database Design',
      answer: `The schema is normalized to Third Normal Form (3NF):
• **1NF (Atomic Values)**: Every column holds single atomic values (no comma-separated lists of tags or status updates).
• **2NF (No Partial Dependencies)**: In composite tables like complaint_assignments, all non-key attributes depend on the primary key (id).
• **3NF (No Transitive Dependencies)**: Category names and Technician names are not stored in the complaints table. Instead, foreign keys (category_id, technician_id) reference parent tables (categories, users) to prevent update anomalies.`
    },
    {
      question: '5. What is the SQLAlchemy Session lifecycle and why is yield get_db() used?',
      category: 'FastAPI & ORM',
      answer: `The get_db() pattern ensures proper connection pooling and leak prevention:
\`\`\`python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
\`\`\`
FastAPI calls get_db() before handling a request, passes the open db session to endpoint dependencies, and guarantees db.close() runs in the finally block after the response is sent.`
    },
    {
      question: '6. How would you handle scaling this system to 100,000+ campus students?',
      category: 'System Design',
      answer: `Scaling Strategy:
1. **Caching**: Use Redis to cache categories, FAQ responses, and user profiles (TTL 15m) to reduce MySQL read load.
2. **Database Read Replicas**: Direct all GET /api/complaints queries to MySQL read replicas, directing writes to the primary node.
3. **Async Message Queue (Celery / RabbitMQ)**: Offload email/SMS notifications and image processing to background workers.
4. **Gunicorn + Uvicorn Workers**: Deploy behind Nginx with 4–8 Uvicorn worker processes per container instance.`
    },
    {
      question: '7. What are Database Indexes used here and why?',
      category: 'Performance',
      answer: `Indexes created on MySQL tables:
• \`users.email\` (Unique Index): Fast O(1) user lookups during authentication.
• \`complaints.ticket_id\` (Unique Index): Instant search by ticket code.
• \`complaints.student_id\` & \`complaints.category_id\` (B-Tree Indexes): Accelerates student grievance history queries.
• \`complaints.status\` & \`complaints.priority\` (Composite Index): Dramatically speeds up admin triage filters.`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
          Full-Stack Learning & Engineering Hub
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          System Architecture, MySQL & Interview Preparation
        </h1>
        <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Master the full engineering lifecycle of this enterprise Campus Grievance System. Explore schema design, FastAPI & SQLAlchemy ORM patterns, JWT auth mechanics, and associate software engineer viva questions.
        </p>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ARCHITECTURE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            System Architecture
          </button>

          <button
            onClick={() => setActiveTab('DATABASE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'DATABASE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            MySQL Schema & 3NF
          </button>

          <button
            onClick={() => setActiveTab('FASTAPI_CODE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'FASTAPI_CODE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            FastAPI + SQLAlchemy Code
          </button>

          <button
            onClick={() => setActiveTab('INTERVIEW_QA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'INTERVIEW_QA'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Interview & Viva Q&A
          </button>

          <button
            onClick={() => setActiveTab('QUERY_SIMULATOR')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'QUERY_SIMULATOR'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            SQL Query Lab
          </button>
        </div>
      </div>

      {/* Tab 1: System Architecture */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Frontend Tier */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                UI
              </div>
              <h3 className="text-sm font-bold text-slate-900">Client Tier (React + TypeScript)</h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>Single Page Application with role-based view routing.</li>
                <li>Live token storage & Axios/Fetch interceptor headers.</li>
                <li>Tailwind CSS design system with micro-interactions.</li>
                <li>Real-time ticket updates & feedback timeline.</li>
              </ul>
            </div>

            {/* Application Tier */}
            <div className="bg-white rounded-2xl border border-indigo-200 bg-indigo-50/10 p-5 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                API
              </div>
              <h3 className="text-sm font-bold text-slate-900">Application Tier (FastAPI + Python 3.11)</h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>ASGI Async server powered by Uvicorn.</li>
                <li>Pydantic v2 schemas for strict input/output validation.</li>
                <li>OAuth2 Password Bearer with HS256 JWT validation.</li>
                <li>Role-Based Access Control (Admin, Tech, Student).</li>
              </ul>
            </div>

            {/* Persistence Tier */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                DB
              </div>
              <h3 className="text-sm font-bold text-slate-900">Data Tier (SQLAlchemy + MySQL 8.0)</h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>SQLAlchemy ORM with connection pooling (pool_size=10).</li>
                <li>Normalized 3NF relational schema with foreign key constraints.</li>
                <li>Transactional ACID updates with automatic rollback on error.</li>
                <li>Audit logging of all ticket transitions.</li>
              </ul>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>End-to-End Request Lifecycle</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono text-indigo-600 font-bold">1. Client Request</span>
                <p className="mt-1 text-slate-500 text-[11px]">
                  Student sends POST /api/complaints with JSON body and JWT Bearer token in header.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200">
                <span className="font-mono text-indigo-600 font-bold">2. Auth & Triage</span>
                <p className="mt-1 text-slate-500 text-[11px]">
                  FastAPI decodes JWT, verifies STUDENT role, and validates payload with Pydantic.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200">
                <span className="font-mono text-purple-600 font-bold">3. ORM & Transaction</span>
                <p className="mt-1 text-slate-500 text-[11px]">
                  SQLAlchemy creates Complaint model instance, writes to MySQL, commits transaction, and logs audit record.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <span className="font-mono text-emerald-600 font-bold">4. JSON Response</span>
                <p className="mt-1 text-slate-500 text-[11px]">
                  Server serializes result into ComplaintResponse schema (HTTP 201 Created) with ticket ID.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Database Schema & 3NF */}
      {activeTab === 'DATABASE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Entity Relationship (ER) & Table Structures</h3>
            <p className="text-xs text-slate-500">
              The database is architected in Third Normal Form (3NF) to eliminate data redundancy and anomalies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Users Table */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
                <div className="text-amber-400 font-bold">TABLE users</div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>• <span className="text-indigo-400">id</span> INT AUTO_INCREMENT PRIMARY KEY</div>
                  <div>• <span className="text-indigo-400">name</span> VARCHAR(100) NOT NULL</div>
                  <div>• <span className="text-indigo-400">email</span> VARCHAR(100) UNIQUE NOT NULL</div>
                  <div>• <span className="text-indigo-400">password_hash</span> VARCHAR(255) NOT NULL</div>
                  <div>• <span className="text-indigo-400">role</span> ENUM('STUDENT', 'TECHNICIAN', 'ADMIN')</div>
                  <div>• <span className="text-indigo-400">department</span> VARCHAR(100)</div>
                  <div>• <span className="text-indigo-400">phone</span> VARCHAR(20)</div>
                  <div>• <span className="text-indigo-400">created_at</span> TIMESTAMP DEFAULT CURRENT_TIMESTAMP</div>
                </div>
              </div>

              {/* Categories Table */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
                <div className="text-amber-400 font-bold">TABLE categories</div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>• <span className="text-indigo-400">id</span> INT AUTO_INCREMENT PRIMARY KEY</div>
                  <div>• <span className="text-indigo-400">name</span> VARCHAR(50) UNIQUE NOT NULL</div>
                  <div>• <span className="text-indigo-400">description</span> TEXT</div>
                  <div>• <span className="text-indigo-400">sla_hours</span> INT DEFAULT 48</div>
                  <div>• <span className="text-indigo-400">is_active</span> BOOLEAN DEFAULT TRUE</div>
                </div>
              </div>

              {/* Complaints Table */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
                <div className="text-amber-400 font-bold">TABLE complaints</div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>• <span className="text-indigo-400">id</span> INT AUTO_INCREMENT PRIMARY KEY</div>
                  <div>• <span className="text-indigo-400">ticket_id</span> VARCHAR(30) UNIQUE NOT NULL</div>
                  <div>• <span className="text-indigo-400">student_id</span> INT (FK -&gt; users.id)</div>
                  <div>• <span className="text-indigo-400">category_id</span> INT (FK -&gt; categories.id)</div>
                  <div>• <span className="text-indigo-400">title</span> VARCHAR(150) NOT NULL</div>
                  <div>• <span className="text-indigo-400">description</span> TEXT NOT NULL</div>
                  <div>• <span className="text-indigo-400">location</span> VARCHAR(100) NOT NULL</div>
                  <div>• <span className="text-indigo-400">priority</span> ENUM('LOW', 'MEDIUM', 'HIGH')</div>
                  <div>• <span className="text-indigo-400">status</span> ENUM('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED')</div>
                  <div>• <span className="text-indigo-400">created_at</span> TIMESTAMP</div>
                  <div>• <span className="text-indigo-400">resolved_at</span> TIMESTAMP NULL</div>
                </div>
              </div>

              {/* Complaint Updates Audit Table */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
                <div className="text-amber-400 font-bold">TABLE complaint_updates</div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>• <span className="text-indigo-400">id</span> INT AUTO_INCREMENT PRIMARY KEY</div>
                  <div>• <span className="text-indigo-400">complaint_id</span> INT (FK -&gt; complaints.id ON DELETE CASCADE)</div>
                  <div>• <span className="text-indigo-400">author_id</span> INT (FK -&gt; users.id)</div>
                  <div>• <span className="text-indigo-400">status</span> VARCHAR(30)</div>
                  <div>• <span className="text-indigo-400">remarks</span> TEXT NOT NULL</div>
                  <div>• <span className="text-indigo-400">created_at</span> TIMESTAMP DEFAULT CURRENT_TIMESTAMP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: FastAPI Code */}
      {activeTab === 'FASTAPI_CODE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Production-Ready Python FastAPI Code Snippets</h3>
            <p className="text-xs text-slate-500">
              Copy and inspect authentic backend modules following industry-standard design patterns.
            </p>

            {/* Snippet 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>1. SQLAlchemy ORM Models (models.py)</span>
                <button
                  onClick={() => handleCopy(`# models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class RoleEnum(str, enum.Enum):
    STUDENT = "STUDENT"
    TECHNICIAN = "TECHNICIAN"
    ADMIN = "ADMIN"

class StatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(30), unique=True, index=True, nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(100), nullable=False)
    priority = Column(String(20), default="MEDIUM")
    status = Column(Enum(StatusEnum), default=StatusEnum.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="complaints")
    category = relationship("Category")
    updates = relationship("ComplaintUpdate", back_populates="complaint", cascade="all, delete-orphan")
`, 1)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1"
                >
                  {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedIndex === 1 ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`# models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class RoleEnum(str, enum.Enum):
    STUDENT = "STUDENT"
    TECHNICIAN = "TECHNICIAN"
    ADMIN = "ADMIN"

class StatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(30), unique=True, index=True, nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(100), nullable=False)
    priority = Column(String(20), default="MEDIUM")
    status = Column(Enum(StatusEnum), default=StatusEnum.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="complaints")
    category = relationship("Category")
    updates = relationship("ComplaintUpdate", back_populates="complaint", cascade="all, delete-orphan")
`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Interview & Viva Q&A */}
      {activeTab === 'INTERVIEW_QA' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Question List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Associate SDE Viva Topics
            </h3>
            {interviewQAs.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedQAIndex(idx)}
                className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all ${
                  selectedQAIndex === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-[10px] opacity-80 uppercase">{item.category}</div>
                <div className="mt-0.5 line-clamp-1">{item.question}</div>
              </button>
            ))}
          </div>

          {/* Selected Question Detail */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
              {interviewQAs[selectedQAIndex].category}
            </div>

            <h2 className="text-lg font-black text-slate-900">
              {interviewQAs[selectedQAIndex].question}
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {interviewQAs[selectedQAIndex].answer}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: SQL Query Simulator */}
      {activeTab === 'QUERY_SIMULATOR' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Interactive MySQL Query Simulator</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute simulated SQL queries against live complaints data to observe result sets.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setQueryInput('SELECT * FROM complaints WHERE status = "PENDING";')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-mono text-slate-700"
            >
              Filter Pending Tickets
            </button>
            <button
              onClick={() => setQueryInput('SELECT * FROM complaints WHERE priority = "HIGH";')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-mono text-slate-700"
            >
              High Priority Query
            </button>
            <button
              onClick={() => setQueryInput('SELECT category, COUNT(*) FROM complaints GROUP BY category;')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-mono text-slate-700"
            >
              Category Aggregation (COUNT)
            </button>
            <button
              onClick={() => setQueryInput('SELECT complaints.*, assignments.* FROM complaints JOIN assignments;')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-mono text-slate-700"
            >
              INNER JOIN Technicians
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl focus:outline-hidden"
            />
            <button
              onClick={handleRunQuery}
              className="absolute right-3 bottom-3.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              Execute Query
            </button>
          </div>

          {queryResult && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Execution Result:</div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] max-h-60 overflow-y-auto">
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
