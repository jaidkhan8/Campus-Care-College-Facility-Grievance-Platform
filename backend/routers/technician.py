"""
Technician Workspace API Router.
Enforces that technicians only view and update complaints explicitly assigned to them.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import (
    Complaint, ComplaintStatus, ComplaintAssignment,
    ComplaintUpdate, User, UserRole
)
from backend.schemas import ComplaintResponse, ComplaintStatusUpdate, ComplaintUpdateCreate
from backend.dependencies import require_role

router = APIRouter(prefix="/technician", tags=["Technician Operations"])

# Role guard for technicians
technician_guard = require_role(UserRole.TECHNICIAN)


@router.get("/complaints", response_model=List[ComplaintResponse])
def get_assigned_complaints(
    current_user: User = Depends(technician_guard),
    db: Session = Depends(get_db)
):
    """
    Fetches all tickets assigned to the logged-in technician.
    """
    assigned_complaints = (
        db.query(Complaint)
        .join(ComplaintAssignment, ComplaintAssignment.complaint_id == Complaint.id)
        .filter(ComplaintAssignment.technician_id == current_user.id)
        .order_by(Complaint.created_at.desc())
        .all()
    )
    return assigned_complaints


@router.put("/complaints/{complaint_id}/status", response_model=ComplaintResponse)
def update_status_by_technician(
    complaint_id: int,
    status_update: ComplaintStatusUpdate,
    current_user: User = Depends(technician_guard),
    db: Session = Depends(get_db)
):
    """
    Updates the status of an assigned complaint (e.g. Assigned -> In Progress -> Resolved)
    with mandatory remarks describing progress.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    # Authorization Check: must be assigned to this technician
    if not complaint.assignment or complaint.assignment.technician_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update a complaint not assigned to you"
        )

    old_status = complaint.status
    complaint.status = status_update.status

    # Record in timeline history
    update_entry = ComplaintUpdate(
        complaint_id=complaint.id,
        updated_by=current_user.id,
        previous_status=old_status,
        new_status=status_update.status,
        remarks=f"Technician {current_user.name}: {status_update.remarks}"
    )
    db.add(update_entry)
    db.commit()
    db.refresh(complaint)

    return complaint


@router.post("/complaints/{complaint_id}/resolution", response_model=ComplaintResponse)
def add_resolution_remarks(
    complaint_id: int,
    resolution_data: ComplaintUpdateCreate,
    current_user: User = Depends(technician_guard),
    db: Session = Depends(get_db)
):
    """
    Submits final resolution remarks and transitions ticket to RESOLVED status.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

    if not complaint.assignment or complaint.assignment.technician_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to resolve a complaint not assigned to you"
        )

    old_status = complaint.status
    complaint.status = ComplaintStatus.RESOLVED

    resolution_log = ComplaintUpdate(
        complaint_id=complaint.id,
        updated_by=current_user.id,
        previous_status=old_status,
        new_status=ComplaintStatus.RESOLVED,
        remarks=f"RESOLVED: {resolution_data.remarks}"
    )
    db.add(resolution_log)
    db.commit()
    db.refresh(complaint)

    return complaint
