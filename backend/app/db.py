import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    """
    Returns a raw psycopg2 connection.
    Uses RealDictCursor so rows behave like dictionaries.
    """
    database_url = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:password@localhost:5432/smart_inventory_db'
    )
    
    conn = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
    return conn
