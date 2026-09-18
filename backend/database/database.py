import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent

DATABASE_PATH = BASE_DIR / "ecoai.db"


def get_connection():

    connection = sqlite3.connect(
        DATABASE_PATH
    )

    connection.row_factory = sqlite3.Row

    return connection


def initialize_database():

    connection = get_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            unit TEXT NOT NULL,
            mode TEXT,
            carbon_kg REAL NOT NULL,
            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    connection.commit()

    connection.close()


def add_activity(
    category,
    amount,
    unit,
    carbon_kg,
    mode=None
):

    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO activities
        (
            category,
            amount,
            unit,
            mode,
            carbon_kg
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            category,
            amount,
            unit,
            mode,
            carbon_kg,
        )
    )

    connection.commit()

    activity_id = cursor.lastrowid

    connection.close()

    return activity_id


def get_activities():

    connection = get_connection()

    cursor = connection.execute(
        """
        SELECT
            id,
            category,
            amount,
            unit,
            mode,
            carbon_kg,
            created_at
        FROM activities
        ORDER BY created_at DESC
        """
    )

    activities = [
        dict(row)
        for row in cursor.fetchall()
    ]

    connection.close()

    return activities


def delete_activity(activity_id):

    connection = get_connection()

    cursor = connection.execute(
        """
        DELETE FROM activities
        WHERE id = ?
        """,
        (activity_id,)
    )

    connection.commit()

    deleted = cursor.rowcount > 0

    connection.close()

    return deleted