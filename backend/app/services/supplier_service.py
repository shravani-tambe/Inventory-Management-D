from app.config.database import db
from app.models.supplier import Supplier
from sqlalchemy.exc import IntegrityError


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
        if 'name' in data:
            supplier.name = data['name'].strip()
        if 'contact_person' in data:
            supplier.contact_person = data['contact_person']
        if 'email' in data:
            supplier.email = data['email'].strip().lower()
        if 'phone' in data:
            supplier.phone = data['phone']
        if 'address' in data:
            supplier.address = data['address']

        db.session.commit()
        return supplier, None

    except IntegrityError:
        db.session.rollback()
        return None, "A supplier with this email already exists"

    except Exception as e:
        db.session.rollback()
        return None, str(e)


def delete_supplier(supplier):
    """Business rule: cannot delete a supplier that has products."""
    if supplier.products:
        return False, f"Cannot delete — this supplier has {len(supplier.products)} product(s) assigned to it"

    try:
        db.session.delete(supplier)
        db.session.commit()
        return True, None
    except Exception as e:
        db.session.rollback()
        return False, str(e)