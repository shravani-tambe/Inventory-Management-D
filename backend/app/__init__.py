from flask import Flask
from flask_cors import CORS

from app.config.settings import config
from app.config.database import db, migrate
from app.utils.error_handlers import register_error_handlers


def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    migrate.init_app(app, db)

    CORS(app, origins=[app.config['FRONTEND_URL']])

    # Register global error handlers
    register_error_handlers(app)

    from app.api.v1.products.routes import products_bp
    from app.api.v1.categories.routes import categories_bp
    from app.api.v1.suppliers.routes import suppliers_bp

    app.register_blueprint(products_bp, url_prefix='/api/v1/products')
    app.register_blueprint(categories_bp, url_prefix='/api/v1/categories')
    app.register_blueprint(suppliers_bp, url_prefix='/api/v1/suppliers')

    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Inventory Management API is running'}, 200

    return app