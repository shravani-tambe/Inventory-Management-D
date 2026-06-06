from flask import Blueprint, request
from marshmallow import ValidationError

from app.api.v1.categories.schemas import category_schema, categories_schema
from app.services.category_service import (
    get_all_categories, get_category_by_id,
    create_category, update_category, delete_category
)
from app.utils.response_helpers import success_response, error_response

categories_bp = Blueprint('categories', __name__)


@categories_bp.route('/', methods=['GET'])
def list_categories():
    """GET /api/v1/categories/ — return all categories."""
    categories = get_all_categories()
    return success_response(
        data=categories_schema.dump(categories),
        message=f"{len(categories)} categories found"
    )


@categories_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    """GET /api/v1/categories/<id> — return one category."""
    category = get_category_by_id(category_id)
    if not category:
        return error_response("Category not found", 404)
    return success_response(data=category_schema.dump(category))


@categories_bp.route('/', methods=['POST'])
def add_category():
    """POST /api/v1/categories/ — create a new category."""
    json_data = request.get_json()
    if not json_data:
        return error_response("No data provided", 400)

    # Validate incoming data
    try:
        validated_data = category_schema.load(json_data)
    except ValidationError as err:
        return error_response("Validation failed", 400, errors=err.messages)

    category, error = create_category(validated_data)
    if error:
        return error_response(error, 400)

    return success_response(
        data=category_schema.dump(category),
        message="Category created successfully",
        status_code=201   # 201 = Created (more specific than 200 OK)
    )


@categories_bp.route('/<int:category_id>', methods=['PUT'])
def edit_category(category_id):
    """PUT /api/v1/categories/<id> — update an existing category."""
    category = get_category_by_id(category_id)
    if not category:
        return error_response("Category not found", 404)

    json_data = request.get_json()
    if not json_data:
        return error_response("No data provided", 400)

    try:
        # partial=True allows updating only some fields
        validated_data = category_schema.load(json_data, partial=True)
    except ValidationError as err:
        return error_response("Validation failed", 400, errors=err.messages)

    updated, error = update_category(category, validated_data)
    if error:
        return error_response(error, 400)

    return success_response(
        data=category_schema.dump(updated),
        message="Category updated successfully"
    )


@categories_bp.route('/<int:category_id>', methods=['DELETE'])
def remove_category(category_id):
    """DELETE /api/v1/categories/<id> — delete a category."""
    category = get_category_by_id(category_id)
    if not category:
        return error_response("Category not found", 404)

    success, error = delete_category(category)
    if not success:
        return error_response(error, 400)

    return success_response(message="Category deleted successfully")