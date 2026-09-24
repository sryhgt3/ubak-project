import sqlite3
import os

db_path = 'backend/ubak.db'
if not os.path.exists(db_path):
    print("No ubak.db found")

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT id, amount, date FROM transactions")
    print(cur.fetchall())
