from flask import jsonify


def success_response(data=None, message="Success", status_code=200):
    """
    Standard success response format.
    Every successful API call returns this structure.
    
    Example output:
    {
        "success": true,
        "message": "Category created successfully",
        "data": { ... }
    }
    """
    response = {
        "success": True,
        "message": message,
    }
    if data is not None:
        response["data"] = data
    return jsonify(response), status_code


def error_response(message="An error occurred", status_code=400, errors=None):
    """
    Standard error response format.
    Every failed API call returns this structure.
    
    Example output:
    {
        "success": false,
        "message": "Validation failed",
        "errors": { "name": ["This field is required"] }
    }
    """
    response = {
        "success": False,
        "message": message,
    }
    if errors is not None:
        response["errors"] = errors
    return jsonify(response), status_code