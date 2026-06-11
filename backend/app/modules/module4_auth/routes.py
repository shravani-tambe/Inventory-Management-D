from flask import Blueprint, request
from . import controllers

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    return controllers.register_controller(data)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return controllers.login_controller(data)
