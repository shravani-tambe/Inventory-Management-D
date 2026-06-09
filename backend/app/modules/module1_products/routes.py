from flask import Blueprint
from . import controllers

products_bp = Blueprint('products', __name__)

# Dashboard
products_bp.route('/products/dashboard', methods=['GET'])(controllers.get_product_dashboard)

# Categories
products_bp.route('/categories', methods=['GET'])(controllers.get_categories)
products_bp.route('/categories', methods=['POST'])(controllers.create_category)
products_bp.route('/categories/<int:category_id>', methods=['GET'])(controllers.get_category)
products_bp.route('/categories/<int:category_id>', methods=['PUT'])(controllers.update_category)
products_bp.route('/categories/<int:category_id>', methods=['DELETE'])(controllers.delete_category)

# Suppliers
products_bp.route('/suppliers', methods=['GET'])(controllers.get_suppliers)
products_bp.route('/suppliers', methods=['POST'])(controllers.create_supplier)
products_bp.route('/suppliers/<int:supplier_id>', methods=['GET'])(controllers.get_supplier)
products_bp.route('/suppliers/<int:supplier_id>', methods=['PUT'])(controllers.update_supplier)
products_bp.route('/suppliers/<int:supplier_id>', methods=['DELETE'])(controllers.delete_supplier)

# Products
products_bp.route('/products', methods=['GET'])(controllers.get_products)
products_bp.route('/products', methods=['POST'])(controllers.create_product)
products_bp.route('/products/<int:product_id>', methods=['GET'])(controllers.get_product)
products_bp.route('/products/<int:product_id>', methods=['PUT'])(controllers.update_product)
products_bp.route('/products/<int:product_id>', methods=['DELETE'])(controllers.delete_product)