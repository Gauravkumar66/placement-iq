#!/usr/bin/env python3
"""
Placement IQ - Demo Database Seeding Script
Idempotent script to populate database with demo users, students, companies, jobs, and skills.
"""
import sys
import os

# Add backend directory to path
backend_dir = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, os.path.abspath(backend_dir))

from app.core.database import SessionLocal, Base, engine
from app.main import seed_demo_data

def main():
    print("Initializing Placement IQ database schemas...")
    Base.metadata.create_all(bind=engine)
    print("Running idempotent demo seed...")
    seed_demo_data()
    print("Demo data successfully verified and seeded!")

if __name__ == "__main__":
    main()
