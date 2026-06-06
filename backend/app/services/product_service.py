from app.config.database import db
from app.models.product import Product
from app.models.category import Category
from app.models.supplier import Supplier
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_


def get_all_products(search=None, category_id=None, supplier_id=None):
    """
    Fetch products with optional filtering and search.
    
    search      → filter by name or SKU (partial match)
    category_id → filter by category
    supplier_id → filter by supplier
    """
    query = Product.query

    if search:
        # ilike = case-insensitive LIKE in PostgreSQL
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.sku.ilike(search_term)
            )
        )

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if supplier_id:
        query = query.filter(Product.supplier_id == supplier_id)

    return query.order_by(Product.name).all()


def get_product_by_id(product_id):
    return Product.query.get(product_id)


def create_product(data):
    """Validate foreign keys exist before creating."""
    # Check category exists
    category = Category.query.get(data.get('category_id'))
    if not category:
        return None, "Category not found"

    # Check supplier exists
    supplier = Supplier.query.get(data.get('supplier_id'))
    if not supplier:
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
    """Validate foreign keys if they are being changed."""
    if 'category_id' in data:
        if not Category.query.get(data['category_id']):
            return None, "Category not found"

    if 'supplier_id' in data:
        if not Supplier.query.get(data['supplier_id']):
            return None, "Supplier not found"

    try:
        fields_to_update = ['name', 'sku', 'price', 'description', 'reorder_level', 'category_id', 'supplier_id']
        for field in fields_to_update:
            if field in data:
                setattr(product, field, data[field])

        # SKU always uppercase
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
    """Aggregate counts for the dashboard."""
    from app.models.supplier import Supplier
    from app.models.category import Category

    total_products = Product.query.count()
    total_categories = Category.query.count()
    total_suppliers = Supplier.query.count()

    recent_products = (
        Product.query
        .order_by(Product.created_at.desc())
        .limit(5)
        .all()
    )
    recent_suppliers = (
        Supplier.query
        .order_by(Supplier.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_products": total_products,
        "total_categories": total_categories,
        "total_suppliers": total_suppliers,
        "recent_products": recent_products,
        "recent_suppliers": recent_suppliers
    }