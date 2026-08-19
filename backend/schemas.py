"""
Pydantic Schemas for Request Validation and Response Serialization.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from backend.models import UserRole, ComplaintPriority, ComplaintStatus


# ---------------- USER SCHEMAS ----------------
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    role: UserRole = UserRole.STUDENT


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None


# ---------------- CATEGORY SCHEMAS ----------------
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    description: Optional[str] = Field(None, max_length=255)
    icon: Optional[str] = "tag"


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------- COMPLAINT UPDATE SCHEMAS ----------------
class ComplaintUpdateCreate(BaseModel):
    remarks: str = Field(..., min_length=3, max_length=1000)
    new_status: ComplaintStatus


class ComplaintUpdateResponse(BaseModel):
    id: int
    complaint_id: int
    updated_by: int
    previous_status: Optional[ComplaintStatus] = None
    new_status: ComplaintStatus
    remarks: str
    created_at: datetime
    author: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ---------------- ASSIGNMENT SCHEMAS ----------------
class AssignmentCreate(BaseModel):
    technician_id: int
    notes: Optional[str] = Field(None, max_length=500)


class AssignmentResponse(BaseModel):
    id: int
    complaint_id: int
    technician_id: int
    assigned_by: int
    assigned_at: datetime
    notes: Optional[str] = None
    technician: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ---------------- COMPLAINT SCHEMAS ----------------
class ComplaintCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=150)
    description: str = Field(..., min_length=10, max_length=2000)
    category_id: int
    priority: ComplaintPriority = ComplaintPriority.MEDIUM
    location: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, max_length=500)


class ComplaintStatusUpdate(BaseModel):
    status: ComplaintStatus
    remarks: str = Field(..., min_length=3, max_length=500)


class ComplaintPriorityUpdate(BaseModel):
    priority: ComplaintPriority


class ComplaintResponse(BaseModel):
    id: int
    ticket_id: str
    student_id: int
    category_id: int
    title: str
    description: str
    priority: ComplaintPriority
    status: ComplaintStatus
    location: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    student: Optional[UserResponse] = None
    category: Optional[CategoryResponse] = None
    assignment: Optional[AssignmentResponse] = None
    timeline_updates: List[ComplaintUpdateResponse] = []

    class Config:
        from_attributes = True


# ---------------- STATS SCHEMAS ----------------
class DashboardStats(BaseModel):
    total: int
    pending: int
    assigned: int
    in_progress: int
    resolved: int
    by_category: dict = {}
    by_priority: dict = {}
    recent_activity_count: int = 0
