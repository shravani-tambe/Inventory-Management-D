from app.config.database import db
from datetime import datetime


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    sku = db.Column(db.String(50), nullable=False, unique=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    description = db.Column(db.Text, nullable=True)
    reorder_level = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Product {self.name} ({self.sku})>'