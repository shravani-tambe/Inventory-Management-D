import json
from app.db import get_connection

def log_action(user_id, action_type, entity_type, entity_id=None, details=None, ip_address=None):
    if details is None:
        details = {}
        
    try:
        details_json = json.dumps(details)
        conn = get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, details, ip_address)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (user_id, action_type, entity_type, entity_id, details_json, ip_address)
                )
                conn.commit()
        finally:
            conn.close()
    except Exception:
        # Silently pass on error to ensure we never crash the main application workflow
        pass
