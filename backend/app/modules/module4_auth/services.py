import os
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone

def hash_password(plain_text):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_text.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_text, hashed):
    return bcrypt.checkpw(plain_text.encode('utf-8'), hashed.encode('utf-8'))

def generate_token(user_id, email, role):
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24)
    }
    secret = os.environ.get('JWT_SECRET')
    if not secret:
        raise ValueError("JWT_SECRET is not set in environment variables.")
    return jwt.encode(payload, secret, algorithm='HS256')

def decode_token(token):
    secret = os.environ.get('JWT_SECRET')
    if not secret:
        raise ValueError("JWT_SECRET is not set in environment variables.")
    return jwt.decode(token, secret, algorithms=['HS256'])
