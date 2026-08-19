"""
Database Seeding Script for Smart Campus Complaint Management System.
Seeds default categories, users (Admin, Students, Technicians), and initial complaints.
Run with: python -m backend.seed
"""
from backend.database import SessionLocal, engine, Base
from backend.models import User, UserRole, Category, Complaint, ComplaintPriority, ComplaintStatus, ComplaintAssignment, ComplaintUpdate
from backend.auth import get_password_hash


def seed_database():
    print("🚀 Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed Categories
        print("🌱 Seeding Categories...")
        categories_data = [
            ("Electrical", "Issues related to lighting, power outlets, wiring, and fans", "zap"),
            ("Internet/WiFi", "Campus network outages, slow connectivity, router failures", "wifi"),
            ("Classroom", "Projectors, smartboards, benches, AC, and podium issues", "monitor"),
            ("Hostel", "Room maintenance, plumbing, water supply, and beds", "home"),
            ("Library", "Reading room facilities, lighting, book lookup kiosks", "book-open"),
            ("Cleaning", "Washrooms, hallways, grounds, and waste disposal", "sparkles"),
            ("Transport", "Campus shuttles, parking permits, and bus scheduling", "bus"),
            ("Other", "General campus utilities and infrastructure complaints", "help-circle")
        ]

        cat_map = {}
        for name, desc, icon in categories_data:
            cat = db.query(Category).filter(Category.name == name).first()
            if not cat:
                cat = Category(name=name, description=desc, icon=icon)
                db.add(cat)
                db.flush()
            cat_map[name] = cat

        # 2. Seed Users
        print("👥 Seeding Users...")
        default_pwd = get_password_hash("password123")

        users_data = [
            # Admins
            ("Admin Principal", "admin@campus.edu", UserRole.ADMIN, "Campus Administration", "+1 555-0100"),
            ("Estate Manager", "estate@campus.edu", UserRole.ADMIN, "Estate & Facilities", "+1 555-0101"),
            # Technicians
            ("Alex Miller (Electrical)", "alex.tech@campus.edu", UserRole.TECHNICIAN, "Electrical Maintenance", "+1 555-0201"),
            ("Sarah Chen (IT & Network)", "sarah.tech@campus.edu", UserRole.TECHNICIAN, "IT Infrastructure", "+1 555-0202"),
            ("David Kumar (Civil & Plumbing)", "david.tech@campus.edu", UserRole.TECHNICIAN, "Civil Works & Hostel", "+1 555-0203"),
            ("Maria Rodriguez (Sanitation)", "maria.tech@campus.edu", UserRole.TECHNICIAN, "Sanitation & Grounds", "+1 555-0204"),
            # Students
            ("Emily Watson", "emily.student@campus.edu", UserRole.STUDENT, "Computer Science & Eng", "+1 555-0301"),
            ("Rahul Sharma", "rahul.student@campus.edu", UserRole.STUDENT, "Mechanical Engineering", "+1 555-0302"),
            ("Jessica Taylor", "jessica.student@campus.edu", UserRole.STUDENT, "Biotechnology", "+1 555-0303"),
        ]

        user_map = {}
        for name, email, role, dept, phone in users_data:
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    name=name,
                    email=email,
                    hashed_password=default_pwd,
                    role=role,
                    department=dept,
                    phone=phone,
                    is_active=True
                )
                db.add(user)
                db.flush()
            user_map[email] = user

        db.commit()

        # 3. Seed Sample Complaints
        print("📋 Seeding Sample Complaints...")
        sample_complaints = [
            {
                "ticket_id": "ELEC-89101",
                "student": "emily.student@campus.edu",
                "category": "Electrical",
                "title": "Short circuit and sparking outlet in Lab 304",
                "description": "The power socket near workstation 14 emitted sparks and tripped the circuit breaker during the morning AI lab session.",
                "priority": ComplaintPriority.HIGH,
                "status": ComplaintStatus.IN_PROGRESS,
                "location": "Science Block B, Room 304",
                "assigned_to": "alex.tech@campus.edu",
                "admin": "admin@campus.edu",
                "assign_notes": "Urgent safety hazard - investigate breaker and replace socket assembly.",
                "updates": [
                    (None, ComplaintStatus.PENDING, "Complaint filed by student with High priority."),
                    (ComplaintStatus.PENDING, ComplaintStatus.ASSIGNED, "Assigned to Alex Miller (Electrical Maintenance)."),
                    (ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS, "Isolated circuit breaker #4; replacement socket ordered from central inventory.")
                ]
            },
            {
                "ticket_id": "WIFI-44210",
                "student": "rahul.student@campus.edu",
                "category": "Internet/WiFi",
                "title": "Access Point offline in Central Library 2nd Floor",
                "description": "Students in the quiet study zone cannot connect to 'Campus-Secure' SSID. Gateway timeout 504.",
                "priority": ComplaintPriority.MEDIUM,
                "status": ComplaintStatus.ASSIGNED,
                "location": "Central Library, 2nd Floor West Wing",
                "assigned_to": "sarah.tech@campus.edu",
                "admin": "admin@campus.edu",
                "assign_notes": "Check PoE switch on Rack 2B.",
                "updates": [
                    (None, ComplaintStatus.PENDING, "Complaint submitted via portal."),
                    (ComplaintStatus.PENDING, ComplaintStatus.ASSIGNED, "Assigned to Sarah Chen (IT Infrastructure).")
                ]
            },
            {
                "ticket_id": "HOST-71932",
                "student": "jessica.student@campus.edu",
                "category": "Hostel",
                "title": "Continuous water leakage in 3rd floor washroom",
                "description": "Tap valve in Hostel Block A, 3rd floor washroom is broken and causing water pooling in the corridor.",
                "priority": ComplaintPriority.HIGH,
                "status": ComplaintStatus.RESOLVED,
                "location": "Hostel Block A, Floor 3 Washroom",
                "assigned_to": "david.tech@campus.edu",
                "admin": "estate@campus.edu",
                "assign_notes": "Replace gasket and valve head.",
                "updates": [
                    (None, ComplaintStatus.PENDING, "Reported by resident student."),
                    (ComplaintStatus.PENDING, ComplaintStatus.ASSIGNED, "Assigned to David Kumar."),
                    (ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS, "Main riser temporarily shut off; removing broken valve."),
                    (ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED, "RESOLVED: Replaced valve seal and verified leak-free operation.")
                ]
            },
            {
                "ticket_id": "CLAS-10492",
                "student": "emily.student@campus.edu",
                "category": "Classroom",
                "title": "Projector HDMI signal flickering in Lecture Hall 1",
                "description": "Colors are distorted (magenta tint) and signal cuts out every 30 seconds when connecting laptops via HDMI podium cable.",
                "priority": ComplaintPriority.MEDIUM,
                "status": ComplaintStatus.PENDING,
                "location": "Main Academic Building, LH-1",
                "assigned_to": None,
                "admin": None,
                "assign_notes": None,
                "updates": [
                    (None, ComplaintStatus.PENDING, "Complaint submitted and awaiting triage.")
                ]
            }
        ]

        for item in sample_complaints:
            existing = db.query(Complaint).filter(Complaint.ticket_id == item["ticket_id"]).first()
            if not existing:
                student = user_map[item["student"]]
                cat = cat_map[item["category"]]
                cmp = Complaint(
                    ticket_id=item["ticket_id"],
                    student_id=student.id,
                    category_id=cat.id,
                    title=item["title"],
                    description=item["description"],
                    priority=item["priority"],
                    status=item["status"],
                    location=item["location"]
                )
                db.add(cmp)
                db.flush()

                if item["assigned_to"]:
                    tech = user_map[item["assigned_to"]]
                    adm = user_map[item["admin"]]
                    assign = ComplaintAssignment(
                        complaint_id=cmp.id,
                        technician_id=tech.id,
                        assigned_by=adm.id,
                        notes=item["assign_notes"]
                    )
                    db.add(assign)

                for prev_s, new_s, remarks in item["updates"]:
                    upd = ComplaintUpdate(
                        complaint_id=cmp.id,
                        updated_by=student.id if prev_s is None else (user_map[item["assigned_to"]].id if new_s in [ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED] else user_map[item["admin"]].id),
                        previous_status=prev_s,
                        new_status=new_s,
                        remarks=remarks
                    )
                    db.add(upd)

        db.commit()
        print("✅ Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
