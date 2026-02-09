import sqlite3
import os

db_path = "/Users/shashwat/Desktop/APPTRY/backend/nexus.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, whop_email FROM users")
    users = cursor.fetchall()
    print("Users in DB:")
    for user in users:
        print(f"ID: {user[0]}, Username: {user[1]}, Email: {user[2]}, Whop Email: {user[3]}")
    conn.close()
else:
    print(f"DB not found at {db_path}")
