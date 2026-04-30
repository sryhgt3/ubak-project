# UBAK (UANG BIJAK) Backend

This is the backend for the UBAK (UANG BIJAK) Web Application, built with FastAPI and SQLAlchemy.

## Tech Stack
- **FastAPI:** High-performance Python web framework.
- **SQLAlchemy:** SQL Toolkit and Object-Relational Mapper.
- **PostgreSQL:** Primary database for user data.
- **Bcrypt:** Secure password hashing.
- **Jose (python-jose):** JWT token generation and validation.

## Local Setup (without Docker)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `.env`.
5. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

## Database Seeding
To populate the database with default accounts (Admin, VIP, and Free), run:
```bash
python seed_db.py
```
Or if using Docker:
```bash
docker exec -it ubak_backend python seed_db.py
```
