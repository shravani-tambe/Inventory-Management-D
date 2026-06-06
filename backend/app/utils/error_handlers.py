from flask import jsonify


def register_error_handlers(app):
    """
    Register global error handlers on the Flask app.
    Called once during app creation in create_app().
    """

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"success": False, "message": "Bad request"}), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "message": "Resource not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"success": False, "message": "Method not allowed"}), 405

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"success": False, "message": "Internal server error"}), 500