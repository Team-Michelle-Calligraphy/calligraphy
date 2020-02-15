import os
from flask import Flask
import api
import controllers

app = Flask(__name__, template_folder='templates')

app.secret_key = '\xee\xfb\xfbhT\xa9_?\x9f\xd7P\xfe\xffw\x9b\xd2\xb7\xbf\x05\xc9\xf3k>m'

# controllers
app.register_blueprint(controllers.main, url_prefix='/')

# api
app.register_blueprint(api.api_load, url_prefix='/')
app.register_blueprint(api.api_save, url_prefix='/')
app.register_blueprint(api.api_draw, url_prefix='/')


if __name__ == "__main__":
	port = int(os.environ.get("PORT", 3441))
	app.debug = True # os.environ["MODE"]=="DEBUG"
	app.run(host='0.0.0.0', port=port)
