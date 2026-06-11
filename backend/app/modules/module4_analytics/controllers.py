from app.shared.response_helpers import success_response, error_response
from . import services
from . import models

def analytics_controller():
    summary = services.get_analytics_summary()
    return success_response(summary)

def alerts_controller(is_read=None, severity=None):
    if is_read is not None and isinstance(is_read, str):
        if is_read.lower() == 'true':
            is_read = True
        elif is_read.lower() == 'false':
            is_read = False
            
    raw_rows = models.get_alerts(is_read=is_read, severity=severity)
    alerts = services.format_alerts(raw_rows)
    return success_response(alerts)

def mark_alert_read_controller(alert_id):
    updated_alert = models.mark_alert_read(alert_id)
    if not updated_alert:
        return error_response("Alert not found", 404)
    return success_response(services.format_alerts([updated_alert])[0])

def audit_logs_controller():
    raw_rows = models.get_audit_logs()
    logs = services.format_audit_logs(raw_rows)
    return success_response(logs)
