import sqlite3

connection = sqlite3.connect(
    "expenses.db"
)

cursor = connection.cursor()

cursor.execute("""

CREATE TABLE IF NOT EXISTS expenses (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,

    amount INTEGER NOT NULL,

    category TEXT NOT NULL,

    user_id INTEGER
)

""")
cursor.execute("""

CREATE TABLE IF NOT EXISTS expenses (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,

    amount INTEGER NOT NULL,

    category TEXT NOT NULL,

    user_id INTEGER,

    date TEXT
)

""")
cursor.execute("""

CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL,

    password TEXT NOT NULL,

    income INTEGER
)

""")

connection.commit()

connection.close()

print("Database created successfully 🚀")