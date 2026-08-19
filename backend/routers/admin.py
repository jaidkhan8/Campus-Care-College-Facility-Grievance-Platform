"""
Admin Complaint Management, Technician Assignment, and Statistics Router.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from backend.database import get_db
from backend.models import (
    Complaint, ComplaintStatus, ComplaintPriority,
    ComplaintAssignment, ComplaintUpdate, User, UserRole, Category
)
from backend.schemas import (
    ComplaintResponse, AssignmentCreate, ComplaintStatusUpdate,
    ComplaintPriorityUpdate, UserResponse, DashboardStats
)
from backend.dependencies import require_role

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

# Guard all routes in this router with ADMIN role
admin_guard = require_role(UserRole.ADMIN)


@router.get("/stats", response_model=DashboardStats)
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    _admin: User = Depends(admin_guard)
):
    """
    Computes real-time KPI metrics and distributions across categories and priorities.
    """
    total = db.query(Complaint).count()
    pending = db.query(Complaint).filter(Complaint.status == ComplaintStatus.PENDING).count()
    assigned = db.query(Complaint).filter(Complaint.status == ComplaintStatus.ASSIGNED).count()
    in_progress = db.query(Complaint).filter(Complaint.status == ComplaintStatus.IN_PROGRESS).count()
    resolved = db.query(Complaint).filter(Complaint.status == ComplaintStatus.RESOLVED).count()

    # Breakdown by category
    categories = db.query(Category.name, func.count(Complaint.id))\
        .outerjoin(Complaint, Complaint.category_id == Category.id)\
        .group_by(Category.name).all()
    by_category = {cat_name: count for cat_name, count in categories}

    # Breakdown by priority
    priorities = db.query(Complaint.priority, func.count(Complaint.id))\
        .group_by(Complaint.priority).all()
    by_priority = {p.value if hasattr(p, 'value') else str(p): count for p, count in priorities}

    recent_activity = db.query(ComplaintUpdate).count()

    return {
        "total": total,
        "pending": pending,
        "assigned": assigned,
        "in_progress": in_progress,
        "resolved": resolved,
        "by_category": by_category,
        "by_priority": by_priority,
        "recent_activity_count": recent_activity
    }


@router.get("/complaints", response_model=List[ComplaintResponse])
def get_all_complaints_admin(
    status_filter: Optional[ComplaintStatus] = Query(None, alias="status"),
    priority_filter: Optional[ComplaintPriority] = Query(None, alias="priority"),
    category_id: Optional[int] = Query(None),
    technician_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _admin: User = Depends(admin_guard)
):
    """
    Returns all campus complaints with comprehensive multi-parameter filtering and search.
    """
    query = db.query(Complaint)

    if status_filter:
        query = query.filter(Complaint.status == status_filter)
    if priority_filter:
        query = query.filter(Complaint.priority == priority_filter)
    if category_id:
        query = query.filter(Complaint.category_id == category_id)
    if technician_id:
        query = query.join(ComplaintAssignment).filter(ComplaintAssignment.technician_id == technician_id)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            (Complaint.title.ilike(pattern)) |
            (Complaint.description.ilike(pattern)) |
            (Complaint.ticket_id.ilike(pattern)) |
            (Complaint.location.ilike(pattern))
        )

    return query.order_by(Complaint.created_at.desc()).all()


@router.put("/complaints/{complaint_id}/assign", response_model=ComplaintResponse)
def assign_complaint_to_technician(
    complaint_id: int,
    assignment_in: AssignmentCreate,
    admin_user: User = Depends(admin_guard),
    db: Session = Depends(get_db)
):
    """
    Assigns or reassigns a complaint to a technician, logs assignment notes and creates timeline update.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    
    technician = db.query(User).filter(User.id == assignment_in.technician_id, User.role == UserRole.TECHNICIAN).first()
    if not technician:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Selected user is not a valid technician")
    
    # Check existing assignment
    existing_assignment = db.query(ComplaintAssignment).filter(ComplaintAssignment.complaint_id == complaint_id).first()
    if existing_assignment:
        existing_assignment.technician_id = technician.id
        existing_assignment.assigned_by = admin_user.id
        existing_assignment.notes = assignment_in.notes
    else:
        new_assign = ComplaintAssignment(
            complaint_id=complaint.id,
            technician_id=technician.id,
            assigned_by=admin_user.id,
            notes=assignment_in.notes
        )
        db.add(new_assign)

    old_status = complaint.status
    complaint.status = ComplaintStatus.ASSIGNED

    # Timeline entry
    update_log = ComplaintUpdate(
        complaint_id=complaint.id,
        updated_by=admin_user.id,
        previous_status=old_status,
        new_status=ComplaintStatus.ASSIGNED,
        remarks=f"Assigned to technician {technician.name} ({technician.department or 'Campus Maintenance'}). Notes: {assignment_in.notes or 'None'}"
    )
    db.add(update_log)
    db.commit()
    db.refresh(complaint)

    return complaint


@router.put("/complaints/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status_admin(
    complaint_id: int,
    status_in: ComplaintStatusUpdate,
    admin_user: User = Depends(admin_guard),
    db: Session = Depends(get_db)
):
    """
    Administrative status override with mandatory audit remarks.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    old_status = complaint.status
    complaint.status = status_in.status

    update_log = ComplaintUpdate(
        complaint_id=complaint.id,
        updated_by=admin_user.id,
        previous_status=old_status,
        new_status=status_in.status,
        remarks=f"Admin status change: {status_in.remarks}"
    )
    db.add(update_log)
    db.commit()
    db.refresh(complaint)
    return complaint


@router.put("/complaints/{complaint_id}/priority", response_model=ComplaintResponse)
def update_complaint_priority_admin(
    complaint_id: int,
    priority_in: ComplaintPriorityUpdate,
    admin_user: User = Depends(admin_guard),
    db: Session = Depends(get_db)
):
    """
    Adjusts priority level (LOW, MEDIUM, HIGH) for triage optimization.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    old_priority = complaint.priority
    complaint.priority = priority_in.priority

    update_log = ComplaintUpdate(
        complaint_id=complaint.id,
        updated_by=admin_user.id,
        previous_status=complaint.status,
        new_status=complaint.status,
        remarks=f"Priority adjusted from {old_priority.value} to {priority_in.priority.value} by Admin."
    )
    db.add(update_log)
    db.commit()
    db.refresh(complaint)
    return complaint


@router.delete("/complaints/{complaint_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_complaint_admin(
    complaint_id: int,
    _admin: User = Depends(admin_guard),
    db: Session = Depends(get_db)
):
    """
    Permanently removes inappropriate, duplicate, or spam complaints.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    
    db.delete(complaint)
    db.commit()
    return None


@router.get("/users", response_model=List[UserResponse])
def list_campus_users(
    role_filter: Optional[UserRole] = Query(None, alias="role"),
    db: Session = Depends(get_db),
    _admin: User = Depends(admin_guard)
):
    """
    Retrieves students and technicians for assignment dropdowns and administration.
    """
    query = db.query(User)
    if role_filter:
        query = query.filter(User.role == role_filter)
    return query.order_by(User.name.asc()).all()
