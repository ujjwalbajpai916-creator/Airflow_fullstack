import os

from app import create_app


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    create_app().run(port=port, debug=False, use_reloader=False)
