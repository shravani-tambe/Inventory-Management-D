from marshmallow import fields, validate, validates, ValidationError
import re
from flask_marshmallow import Marshmallow
from app.models.supplier import Supplier

ma = Marshmallow()


class SupplierSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Supplier
        load_instance = False
        include_fk = True

    name = fields.String(
        required=True,
        validate=validate.Length(min=1, max=150)
    )
    email = fields.Email(
        required=True,
        error_messages={"invalid": "Please provide a valid email address"}
    )
    contact_person = fields.String(load_default=None)
    phone = fields.String(load_default=None)
    address = fields.String(load_default=None)

    @validates('phone')
    def validate_phone(self, value, **kwargs):
        """Allow empty phone, but if provided it must look like a real number."""
        if value and not re.match(r'^[\d\s\+\-\(\)]{7,20}$', value):
            raise ValidationError("Invalid phone number format")
        return value


supplier_schema = SupplierSchema()
suppliers_schema = SupplierSchema(many=True)