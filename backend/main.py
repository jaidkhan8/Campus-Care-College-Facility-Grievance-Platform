"""
FastAPI Application Entry Point for Smart Campus Complaint Management System.
Configures CORS, global error handlers, route registration, and OpenAPI metadata.
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import logging

from backend.config import get_settings
from backend.database import engine, Base
from backend.routers import auth, categories, complaints, admin, technician

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("campus_backend")

settings = get_settings()

# Initialize tables (if not already existing)
Base.metadata.create_all(bind=engine)

# Create FastAPI app with custom metadata for Swagger / ReDoc docs
app = FastAPI(
    title="Smart Campus Complaint Management System API",
    description="""
    Comprehensive RESTful backend API for campus maintenance, student grievance reporting,
    administrative triage, technician assignment, and resolution workflows.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS Middleware for Frontend Single Page Applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development and local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Formats Pydantic validation errors into clean, readable JSON responses."""
    errors = []
    for err in exc.errors():
        field = " -> ".join([str(loc) for loc in err["loc"] if loc != "body"])
        errors.append({"field": field or "body", "message": err["msg"]})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "error_type": "ValidationError",
            "message": "Input validation failed. Please check your request payload.",
            "details": errors
        }
    )


@app.exception_handler(SQLAlchemyError)
async def db_exception_handler(request: Request, exc: SQLAlchemyError):
    """Prevents database engine details from leaking into client responses while logging errors."""
    logger.error(f"Database error occurred: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "error_type": "DatabaseError",
            "message": "A database error occurred while processing your request. Please try again later."
        }
    )


# Health check and root endpoints
@app.get("/", tags=["Root"])
def root():
    return {
        "system": "Smart Campus Complaint Management System API",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health", tags=["Root"])
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "environment": settings.ENVIRONMENT
    }


# Register Routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(complaints.router)
app.include_router(admin.router)
app.include_router(technician.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
