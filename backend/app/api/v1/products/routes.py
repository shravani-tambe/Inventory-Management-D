from flask import Blueprint, request
from marshmallow import ValidationError

from app.api.v1.products.schemas import product_schema, products_schema
from app.api.v1.categories.schemas import category_schema
from app.api.v1.suppliers.schemas import supplier_schema
from app.services.product_service import (
    get_all_products, get_product_by_id,
    create_product, update_product, delete_product,
    get_dashboard_stats
)
from app.services.category_service import get_all_categories
from app.services.supplier_service import get_all_suppliers
from app.api.v1.categories.schemas import categories_schema
from app.api.v1.suppliers.schemas import suppliers_schema
from app.utils.response_helpers import success_response, error_response

products_bp = Blueprint('products', __name__)


@products_bp.route('/', methods=['GET'])
def list_products():
    """
    GET /api/v1/products/
    Supports query params: ?search=laptop&category_id=2&supplier_id=1
    """
    search = request.args.get('search', '').strip() or None
    category_id = request.args.get('category_id', type=int)
    supplier_id = request.args.get('supplier_id', type=int)

    products = get_all_products(search=search, category_id=category_id, supplier_id=supplier_id)
    return success_response(
        data=products_schema.dump(products),
        message=f"{len(products)} products found"
    )


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = get_product_by_id(product_id)
    if not product:
        return error_response("Product not found", 404)
    return success_response(data=product_schema.dump(product))


@products_bp.route('/', methods=['POST'])
def add_product():
    json_data = request.get_json()
    if not json_data:
        return error_response("No data provided", 400)

    try:
        validated_data = product_schema.load(json_data)
    except ValidationError as err:
        return error_response("Validation failed", 400, errors=err.messages)

    product, error = create_product(validated_data)
    if error:
        return error_response(error, 400)

    return success_response(
        data=product_schema.dump(product),
        message="Product created successfully",
        status_code=201
    )


@products_bp.route('/<int:product_id>', methods=['PUT'])
def edit_product(product_id):
    product = get_product_by_id(product_id)
    if not product:
        return error_response("Product not found", 404)

    json_data = request.get_json()
    if not json_data:
        return error_response("No data provided", 400)

    try:
        validated_data = product_schema.load(json_data, partial=True)
    except ValidationError as err:
        return error_response("Validation failed", 400, errors=err.messages)

    updated, error = update_product(product, validated_data)
    if error:
        return error_response(error, 400)

    return success_response(
        data=product_schema.dump(updated),
        message="Product updated successfully"
    )


@products_bp.route('/<int:product_id>', methods=['DELETE'])
def remove_product(product_id):
    product = get_product_by_id(product_id)
    if not product:
        return error_response("Product not found", 404)

    success, error = delete_product(product)
    if not success:
        return error_response(error, 400)

    return success_response(message="Product deleted successfully")


@products_bp.route('/dashboard/stats', methods=['GET'])
def dashboard_stats():
    """GET /api/v1/products/dashboard/stats — summary counts for the dashboard."""
    stats = get_dashboard_stats()
    return success_response(data={
        "total_products": stats["total_products"],
        "total_categories": stats["total_categories"],
        "total_suppliers": stats["total_suppliers"],
        "recent_products": products_schema.dump(stats["recent_products"]),
        "recent_suppliers": suppliers_schema.dump(stats["recent_suppliers"])
    })