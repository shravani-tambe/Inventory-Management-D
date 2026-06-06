from app.config.database import db
from app.models.category import Category
from sqlalchemy.exc import IntegrityError


def get_all_categories():
    """Return all categories ordered by name."""
    return Category.query.order_by(Category.name).all()


def get_category_by_id(category_id):
    """Return a single category or None if not found."""
    return Category.query.get(category_id)


def create_category(data):
    """
    Create a new category.
    Returns (category, error_message).
    If error_message is not None, creation failed.
    """
    try:
        category = Category(
            name=data['name'].strip(),
            description=data.get('description', '').strip() if data.get('description') else None
        )
        db.session.add(category)
        db.session.commit()
        return category, None

    except IntegrityError:
        # IntegrityError happens when unique constraint is violated
        # i.e., a category with this name already exists
        db.session.rollback()
        return None, "A category with this name already exists"

    except Exception as e:
        db.session.rollback()
        return None, str(e)


def update_category(category, data):
    """
    Update an existing category.
    category = the Category object fetched from DB
    data = validated incoming request data
    """
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
    """
    Delete a category.
    Business rule: cannot delete a category that has products.
    """
    if category.products:
        return False, f"Cannot delete — this category has {len(category.products)} product(s) assigned to it"

    try:
        db.session.delete(category)
        db.session.commit()
        return True, None
    except Exception as e:
        db.session.rollback()
        return False, str(e)