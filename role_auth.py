from functools import wraps
from flask import render_template
from flask_jwt_extended import (
    jwt_required,
    current_user
)


def role_required(roles: list):
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            if current_user is None or current_user.role not in roles:
                return render_template('index.html')
            return f(*args, **kwargs)
        return decorated_function
    return decorator
