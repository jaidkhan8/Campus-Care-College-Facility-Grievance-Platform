"""
Complaints CRUD Router for Students (and global lookup).
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from backend.database import get_db
from backend.models import (
    Complaint, ComplaintStatus, ComplaintPriority,
    ComplaintUpdate, Category, User, UserRole
)
from backend.schemas import ComplaintCreate, ComplaintResponse
from backend.dependencies import get_current_user, require_role

router = APIRouter(prefix="/complaints", tags=["Complaints"])


def generate_ticket_id(category_name: str) -> str:
    """Generates unique campus complaint ticket ID like ELEC-4892."""
    prefix = category_name[:3].upper() if category_name else "CMP"
    short_uuid = uuid.uuid4().hex[:5].upper()
    return f"{prefix}-{short_uuid}"


@router.get("", response_model=List[ComplaintResponse])
def get_student_complaints(
    status_filter: Optional[ComplaintStatus] = Query(None, alias="status"),
    priority_filter: Optional[ComplaintPriority] = Query(None, alias="priority"),
    category_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns complaints. If user is a student, only returns their own complaints.
    """
    query = db.query(Complaint)
    
    if current_user.role == UserRole.STUDENT:
        query = query.filter(Complaint.student_id == current_user.id)

    if status_filter:
        query = query.filter(Complaint.status == status_filter)
    if priority_filter:
        query = query.filter(Complaint.priority == priority_filter)
    if category_id:
        query = query.filter(Complaint.category_id == category_id)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Complaint.title.ilike(search_pattern)) |
            (Complaint.description.ilike(search_pattern)) |
            (Complaint.ticket_id.ilike(search_pattern)) |
            (Complaint.location.ilike(search_pattern))
        )

    return query.order_by(Complaint.created_at.desc()).all()


@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(
    complaint_in: ComplaintCreate,
    current_user: User = Depends(require_role(UserRole.STUDENT, UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """
    Files a new complaint for the logged-in student.
    Automatically creates the initial timeline update and generates ticket ID.
    """
    category = db.query(Category).filter(Category.id == complaint_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Specified category does not exist"
        )
    
    ticket_id = generate_ticket_id(category.name)
    
    new_complaint = Complaint(
        ticket_id=ticket_id,
        student_id=current_user.id,
        category_id=complaint_in.category_id,
        title=complaint_in.title.strip(),
        description=complaint_in.description.strip(),
        priority=complaint_in.priority,
        status=ComplaintStatus.PENDING,
        location=complaint_in.location,
        image_url=complaint_in.image_url
    )
    
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    # Add initial creation entry in timeline history
    initial_log = ComplaintUpdate(
        complaint_id=new_complaint.id,
        updated_by=current_user.id,
        previous_status=None,
        new_status=ComplaintStatus.PENDING,
        remarks="Complaint filed by student and queued for administrative review."
    )
    db.add(initial_log)
    db.commit()
    db.refresh(new_complaint)

    return new_complaint


@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint_by_id(
    complaint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves complaint details and full timeline history.
    Enforces authorization: students can only see their own tickets, technicians can only see assigned tickets.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found"
        )
    
    # RBAC Data Isolation Check
    if current_user.role == UserRole.STUDENT and complaint.student_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view another student's complaint"
        )
    
    if current_user.role == UserRole.TECHNICIAN:
        if not complaint.assignment or complaint.assignment.technician_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to view complaints not assigned to you"
            )

    return complaint


@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update_student_complaint(
    complaint_id: int,
    complaint_in: ComplaintCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Allows student to update their complaint before it has been assigned or worked on.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    
    if current_user.role == UserRole.STUDENT and complaint.student_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot edit another student's complaint")
    
    if complaint.status != ComplaintStatus.PENDING and current_user.role == UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify a complaint once it has been assigned or in progress"
        )

    complaint.title = complaint_in.title.strip()
    complaint.description = complaint_in.description.strip()
    complaint.category_id = complaint_in.category_id
    complaint.priority = complaint_in.priority
    complaint.location = complaint_in.location
    complaint.image_url = complaint_in.image_url

    db.commit()
    db.refresh(complaint)
    return complaint


@router.delete("/{complaint_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student_complaint(
    complaint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Allows student to cancel/delete their own PENDING complaint, or Admin to delete any.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
    
    if current_user.role == UserRole.STUDENT:
        if complaint.student_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot delete another student's complaint")
        if complaint.status != ComplaintStatus.PENDING:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can only withdraw pending complaints")
    
    db.delete(complaint)
    db.commit()
    return None
