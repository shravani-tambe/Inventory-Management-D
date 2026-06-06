from marshmallow import fields, validate, validates, ValidationError
from flask_marshmallow import Marshmallow
from app.config.database import db
from app.models.category import Category

ma = Marshmallow()


class CategorySchema(ma.SQLAlchemyAutoSchema):
    """
    SQLAlchemyAutoSchema automatically reads the Category model
    and generates fields matching the database columns.
    We only need to add extra validation rules on top.
    """
    class Meta:
        model = Category
        load_instance = False   # Don't auto-create model instances on load
        include_fk = True       # Include foreign key fields

    # Add explicit validation rules
    name = fields.String(
        required=True,
        validate=validate.Length(min=1, max=100, error="Name must be between 1 and 100 characters")
    )
    description = fields.String(load_default=None)

    @validates('name')
    def validate_name(self, value, **kwargs):
        """Custom validator: prevent empty or whitespace-only names."""
        if not value or not value.strip():
            raise ValidationError("Name cannot be blank or whitespace only")
        return value.strip()


# Pre-created instances — import and use these directly in routes/controllers
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)  # many=True serializes a list