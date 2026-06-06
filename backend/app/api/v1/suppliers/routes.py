from flask import Blueprint, request
from marshmallow import ValidationError

from app.api.v1.suppliers.schemas import supplier_schema, suppliers_schema
from app.services.supplier_service import (
    get_all_suppliers, get_supplier_by_id,
    create_supplier, update_supplier, delete_supplier
)
from app.utils.response_helpers import success_response, error_response

suppliers_bp = Blueprint('suppliers', __name__)


@suppliers_bp.route('/', methods=['GET'])
def list_suppliers():
    suppliers = get_all_suppliers()
    return success_response(
        data=suppliers_schema.dump(suppliers),
        message=f"{len(suppliers)} suppliers found"
    )


@suppliers_bp.route('/<int:supplier_id>', methods=['GET'])
def get_supplier(supplier_id):
    supplier = get_supplier_by_id(supplier_id)
    if not supplier:
        return error_response("Supplier not found", 404)
    return success_response(data=supplier_schema.dump(supplier))


@suppliers_bp.route('/', methods=['POST'])
def add_supplier():
    json_data = request.get_json()
    if not json_data:
        return error_response("No data provided", 400)

    try:
        validated_data = supplier_schema.load(json_data)
    except ValidationError as err:
        return error_response("Validation failed", 400, errors=err.messages)

    supplier, error = create_supplier(validated_data)
    if error:
        return error_response(error, 400)

    return success_response(
        data=supplier_schema.dump(supplier),
        message="Supplier created successfully",
        status_code=201
    )


@suppliers_bp.route('/<int:supplier_id>', methods=['PUT'])
def edit_supplier(supplier_id):
    supplier = get_supplier_by_id(supplier_id)
    if not supplier:
        return error_response("Supplier not found", 404)

    json_data = request.get_json()
    if not json_data:
        return error_response("No data provided", 400)

    try:
        validated_data = supplier_schema.load(json_data, partial=True)
    except ValidationError as err:
        return error_response("Validation failed", 400, errors=err.messages)

    updated, error = update_supplier(supplier, validated_data)
    if error:
        return error_response(error, 400)

    return success_response(
        data=supplier_schema.dump(updated),
        message="Supplier updated successfully"
    )


@suppliers_bp.route('/<int:supplier_id>', methods=['DELETE'])
def remove_supplier(supplier_id):
    supplier = get_supplier_by_id(supplier_id)
    if not supplier:
        return error_response("Supplier not found", 404)

    success, error = delete_supplier(supplier)
    if not success:
        return error_response(error, 400)

    return success_response(message="Supplier deleted successfully")