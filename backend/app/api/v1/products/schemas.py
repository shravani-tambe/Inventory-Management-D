from marshmallow import fields, validate, validates, ValidationError, post_load
from flask_marshmallow import Marshmallow
from app.models.product import Product

ma = Marshmallow()


class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = False
        include_fk = True

    name = fields.String(
        required=True,
        validate=validate.Length(min=1, max=200)
    )
    sku = fields.String(
        required=True,
        validate=validate.Length(min=1, max=50)
    )
    price = fields.Decimal(
        required=True,
        places=2,
        as_string=True   # Return as string to preserve decimal precision in JSON
    )
    category_id = fields.Integer(required=True)
    supplier_id = fields.Integer(required=True)
    reorder_level = fields.Integer(load_default=0, validate=validate.Range(min=0))
    description = fields.String(load_default=None)

    # These are read-only nested fields for display purposes
    # When we return a product, we include category name and supplier name
    # so the frontend doesn't need to make extra API calls
    category_name = fields.String(dump_only=True, attribute="category.name")
    supplier_name = fields.String(dump_only=True, attribute="supplier.name")

    @validates('price')
    def validate_price(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("Price must be greater than zero")
        return value

    @validates('sku')
    def validate_sku(self, value, **kwargs):
        if not value or not value.strip():
            raise ValidationError("SKU cannot be blank")
        return value.strip().upper()   # Always store SKU in uppercase


product_schema = ProductSchema()
products_schema = ProductSchema(many=True)