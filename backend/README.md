# UBAK (UANG BIJAK) Backend

This is the backend for the UBAK (UANG BIJAK) Web Application, built with FastAPI and SQLAlchemy.

## Tech Stack
- **FastAPI:** High-performance Python web framework.
- **SQLAlchemy:** SQL Toolkit and Object-Relational Mapper.
- **PostgreSQL:** Primary database.
- **AI Integration:** Support for OpenAI (GPT-4o Mini) and Gemini (1.5 Flash).
- **Security:** Bcrypt hashing & JWT (python-jose).

## New Features (v1.1.0)
- **Account/Wallet System:** Managed via `AccountRepository` and `AccountService`. Tracks balances across different types (Bank, EWallet, Cash).
- **Chat History:** Persistent storage for AI conversations using `ChatSession` and `ChatMessage` models.
- **Transactional Balance:** Creating a transaction now automatically updates the associated account's balance.

## Database Seeding & Migration
The seeding script has been updated to handle multi-wallet migrations.

```bash
# Run seeding (using local venv)
backend/venv/bin/python backend/seed_db.py

# Or via Docker
docker exec -it ubak_backend python seed_db.py
```

### Seeding Logic:
1.  **Users**: Creates Admin, VIP, and Free accounts.
2.  **Wallets**: Ensures every user has at least one "Main Wallet".
3.  **Migration**: Automatically links existing transactions with `NULL` account_id to the user's Main Wallet.

## Environment Variables
Ensure your `.env` includes:
- `DATABASE_URL`
- `OPENAI_API_KEY` & `GEMINI_API_KEY`
- `SECRET_KEY` & `ALGORITHM`
