"""
FastAPI Automated Pytest Suite.
Tests registration, authentication, RBAC authorization boundaries, and complaint lifecycle.
Run with: pytest backend/test_api.py -v
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import Base, get_db
from backend.models import User, UserRole, Category

# Use in-memory SQLite for rapid automated testing
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_campus.db"

test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True, scope="module")
def setup_database():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    
    # Create test categories
    cat = Category(name="Electrical", description="Electrical repairs", icon="zap")
    db.add(cat)
    db.commit()
    yield
    Base.metadata.drop_all(bind=test_engine)


def test_student_registration_and_login():
    # 1. Register Student
    res = client.post("/auth/register", json={
        "name": "John Doe",
        "email": "john.student@campus.edu",
        "password": "securepassword123",
        "role": "STUDENT",
        "department": "Computer Science",
        "phone": "555-1234"
    })
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "john.student@campus.edu"

    # 2. Login Student
    login_res = client.post("/auth/login", json={
        "email": "john.student@campus.edu",
        "password": "securepassword123"
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data


def test_unauthorized_admin_access_by_student():
    # Login as student
    login_res = client.post("/auth/login", json={
        "email": "john.student@campus.edu",
        "password": "securepassword123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Attempt to hit admin stats endpoint with student credentials
    res = client.get("/admin/stats", headers=headers)
    assert res.status_code == 403
    assert "Access denied" in res.json()["detail"]


def test_complaint_creation():
    # Login as student
    login_res = client.post("/auth/login", json={
        "email": "john.student@campus.edu",
        "password": "securepassword123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create complaint
    create_res = client.post("/complaints", headers=headers, json={
        "title": "Air conditioner blowing warm air in Room 204",
        "description": "The AC unit in Lab 204 has stopped cooling properly and is making loud vibrations.",
        "category_id": 1,
        "priority": "HIGH",
        "location": "Science Block, Room 204"
    })
    assert create_res.status_code == 201
    complaint = create_res.json()
    assert complaint["status"] == "PENDING"
    assert complaint["ticket_id"].startswith("ELE")
    assert len(complaint["timeline_updates"]) >= 1
