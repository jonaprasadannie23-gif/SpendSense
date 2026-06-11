from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

app = Flask(__name__)

CORS(app)


@app.route("/")
def home():

    return {
        "message": "SpendSense Backend Running 🚀"
    }


@app.route("/expenses")
def get_expenses():

    connection = sqlite3.connect(
        "expenses.db"
    )

    cursor = connection.cursor()

    user_id = request.args.get(
        "user_id"
    )

    cursor.execute(

        """
        SELECT * FROM expenses

        WHERE user_id = ?
        """,

        (user_id,)
    )

    data = cursor.fetchall()

    connection.close()

    expenses = []

    for item in data:

        expenses.append({

            "id": item[0],

            "title": item[1],

            "amount": item[2],

            "category": item[3],

            "user_id": item[4],

            "date": item[5]
        })

    return jsonify(expenses)


@app.route("/add-expense", methods=["POST"])
def add_expense():

    data = request.json

    connection = sqlite3.connect("expenses.db")
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO expenses
        (title, amount, category, date, user_id)

        VALUES (?, ?, ?, ?, ?)
        """,

        (
            data["title"],
            data["amount"],
            data["category"],
            data["date"],
            data["user_id"]
        )
    )

    connection.commit()

    connection.close()

    return {
        "message":
        "Expense added successfully"
    }


@app.route("/delete-expense/<int:id>", methods=["DELETE"])
def delete_expense(id):

    connection = sqlite3.connect("expenses.db")

    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM expenses WHERE id = ?",
        (id,)
    )

    connection.commit()

    connection.close()

    return {
        "message":
        "Expense deleted successfully"
    }


@app.route("/update-expense/<int:id>", methods=["PUT"])
def update_expense(id):

    data = request.json

    connection = sqlite3.connect("expenses.db")
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE expenses

        SET
        title = ?,
        amount = ?,
        category = ?

        WHERE id = ?
        """,

        (
            data["title"],
            data["amount"],
            data["category"],
            id
        )
    )

    connection.commit()

    connection.close()

    return {
        "message":
        "Expense updated successfully"
    }


@app.route("/register", methods=["POST"])
def register():

    data = request.json

    connection = sqlite3.connect(
        "expenses.db"
    )

    cursor = connection.cursor()

    # Check if username already exists

    cursor.execute(
        """
        SELECT * FROM users
        WHERE username = ?
        """,
        (data["username"],)
    )

    existing_user = cursor.fetchone()

    if existing_user:

        connection.close()

        return {
            "success": False,
            "message": "Username already exists"
        }

    # Register user with hashed password

    cursor.execute(
        """
        INSERT INTO users
        (username, password, income)

        VALUES (?, ?, ?)
        """,

        (
            data["username"],
            generate_password_hash(
                data["password"]
            ),
            data["income"]
        )
    )

    connection.commit()

    connection.close()

    return {
        "success": True,
        "message": "User registered successfully"
    }
@app.route("/login", methods=["POST"])
def login():

    data = request.json

    connection = sqlite3.connect(
        "expenses.db"
    )

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT * FROM users
        WHERE username = ?
        """,
        (data["username"],)
    )

    user = cursor.fetchone()

    connection.close()

    if user and check_password_hash(
        user[2],
        data["password"]
    ):

        return {

            "message":
            "Login successful",

            "success": True,

            "income": user[3],

            "user_id": user[0]
        }

    return {

        "message":
        "Invalid credentials",

        "success": False
    }

@app.route(
    "/update-income/<int:user_id>",
    methods=["PUT"]
)
def update_income(user_id):

    data = request.json

    connection = sqlite3.connect("expenses.db")

    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE users

        SET income = ?

        WHERE id = ?
        """,

        (
            data["income"],
            user_id
        )
    )

    connection.commit()

    connection.close()

    return {
        "message":
        "Income updated successfully"
    }


@app.route("/change-password", methods=["POST"])
def change_password():

    data = request.json

    connection = sqlite3.connect("expenses.db")

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT password

        FROM users

        WHERE id = ?
        """,

        (data["user_id"],)
    )

    user = cursor.fetchone()

    if not user:

        connection.close()

        return {

            "success": False,

            "message":
            "User not found"
        }

    if user[0] != data["current_password"]:

        connection.close()

        return {

            "success": False,

            "message":
            "Current password is incorrect"
        }

    cursor.execute(
        """
        UPDATE users

        SET password = ?

        WHERE id = ?
        """,

        (
            data["new_password"],
            data["user_id"]
        )
    )

    connection.commit()

    connection.close()

    return {

        "success": True,

        "message":
        "Password updated successfully"
    }

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000
    )