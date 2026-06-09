from app.extensions import db
from .models import Category, Supplier, Product
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_


# ── CATEGORY SERVICES ──────────────────────────────────────

def get_all_categories():
    return Category.query.order_by(Category.name).all()


def get_category_by_id(category_id):
    return Category.query.get(category_id)


def create_category(data):
    try:
        category = Category(
            name=data['name'].strip(),
            description=data.get('description', '').strip() or None
        )
        db.session.add(category)
        db.session.commit()
        return category, None
    except IntegrityError:
        db.session.rollback()
        return None, "A category with this name already exists"
    except Exception as e:
        db.session.rollback()
        return None, str(e)


def update_category(category, data):
    try:
        if 'name' in data:
            category.name = data['name'].strip()
        if 'description' in data:
            category.description = data['description']
        db.session.commit()
        return category, None
    except IntegrityError:
        db.session.rollback()
        return None, "A category with this name already exists"
    except Exception as e:
        db.session.rollback()
        return None, str(e)


def delete_category(category):
    if category.products:
        return False, f"Cannot delete — this category has {len(category.products)} product(s)"
    try:
        db.session.delete(category)
        db.session.commit()
        return True, None
    except Exception as e:
        db.session.rollback()
        return False, str(e)


# ── SUPPLIER SERVICES ──────────────────────────────────────

def get_all_suppliers():
    return Supplier.query.order_by(Supplier.name).all()


def get_supplier_by_id(supplier_id):
    return Supplier.query.get(supplier_id)


def create_supplier(data):
    try:
        supplier = Supplier(
            name=data['name'].strip(),
            contact_person=data.get('contact_person', '').strip() or None,
            email=data['email'].strip().lower(),
            phone=data.get('phone', '').strip() or None,
            address=data.get('address', '').strip() or None
        )
        db.session.add(supplier)
        db.session.commit()
        return supplier, None
    except IntegrityError:
        db.session.rollback()
        return None, "A supplier with this email already exists"
    except Exception as e:
        db.session.rollback()
        return None, str(e)


def update_supplier(supplier, data):
    try:
        for field in ['name', 'contact_person', 'email', 'phone', 'address']:
            if field in data:
                setattr(supplier, field, data[field])
        db.session.commit()
        return supplier, None
    except IntegrityError:
        db.session.rollback()
        return None, "A supplier with this email already exists"
    except Exception as e:
        db.session.rollback()
        return None, str(e)


def delete_supplier(supplier):
    if supplier.products:
        return False, f"Cannot delete — this supplier has {len(supplier.products)} product(s)"
    try:
        db.session.delete(supplier)
        db.session.commit()
        return True, None
    except Exception as e:
        db.session.rollback()
        return False, str(e)


# ── PRODUCT SERVICES ───────────────────────────────────────

def get_all_products(search=None, category_id=None, supplier_id=None):
    query = Product.query
    if search:
        term = f"%{search}%"
        query = query.filter(or_(Product.name.ilike(term), Product.sku.ilike(term)))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if supplier_id:
        query = query.filter(Product.supplier_id == supplier_id)
    return query.order_by(Product.name).all()


def get_product_by_id(product_id):
    return Product.query.get(product_id)


def create_product(data):
    if not Category.query.get(data.get('category_id')):
        return None, "Category not found"
    if not Supplier.query.get(data.get('supplier_id')):
        return None, "Supplier not found"
    try:
        product = Product(
            name=data['name'].strip(),
            sku=data['sku'].strip().upper(),
            price=data['price'],
            description=data.get('description', '').strip() or None,
            reorder_level=data.get('reorder_level', 0),
            category_id=data['category_id'],
            supplier_id=data['supplier_id']
        )
        db.session.add(product)
        db.session.commit()
        return product, None
    except IntegrityError:
        db.session.rollback()
        return None, "A product with this SKU already exists"
    except Exception as e:
        db.session.rollback()
        return None, str(e)


def update_product(product, data):
    if 'category_id' in data and not Category.query.get(data['category_id']):
        return None, "Category not found"
    if 'supplier_id' in data and not Supplier.query.get(data['supplier_id']):
        return None, "Supplier not found"
    try:
        for field in ['name', 'sku', 'price', 'description', 'reorder_level', 'category_id', 'supplier_id']:
            if field in data:
                setattr(product, field, data[field])
        if 'sku' in data:
            product.sku = data['sku'].strip().upper()
        db.session.commit()
        return product, None
    except IntegrityError:
        db.session.rollback()
        return None, "A product with this SKU already exists"
    except Exception as e:
        db.session.rollback()
        return None, str(e)


def delete_product(product):
    try:
        db.session.delete(product)
        db.session.commit()
        return True, None
    except Exception as e:
        db.session.rollback()
        return False, str(e)


def get_dashboard_stats():
    total_products = Product.query.count()
    total_categories = Category.query.count()
    total_suppliers = Supplier.query.count()
    recent_products = Product.query.order_by(Product.created_at.desc()).limit(5).all()
    recent_suppliers = Supplier.query.order_by(Supplier.created_at.desc()).limit(5).all()
    return {
        'total_products': total_products,
        'total_categories': total_categories,
        'total_suppliers': total_suppliers,
        'recent_products': [p.to_dict() for p in recent_products],
        'recent_suppliers': [s.to_dict() for s in recent_suppliers],
    }