import os
from flask import Flask
import api
import controllers
import webbrowser
from threading import Timer

# REGISTER -----------------------------------------------------------------------------------------

app = Flask(__name__, template_folder='templates')
app.secret_key = '\xee\xfb\xfbhT\xa9_?\x9f\xd7P\xfe\xffw\x9b\xd2\xb7\xbf\x05\xc9\xf3k>m'
app.debug = True # os.environ["MODE"]=="DEBUG"

# controllers
app.register_blueprint(controllers.main, url_prefix='/')

# api
app.register_blueprint(api.api_load, url_prefix='/')
app.register_blueprint(api.api_save, url_prefix='/')
app.register_blueprint(api.api_draw, url_prefix='/')
app.register_blueprint(api.api_config, url_prefix='/')

# START --------------------------------------------------------------------------------------------

# get the port
port = int(os.environ.get("PORT", 3441))

# open browser to that port when called
def open_browser():
  webbrowser.open_new('http://localhost:' + str(port) + '/')

# main
if __name__ == "__main__":
  # open the browser on another thread
  # TODO: Timer(1, open_browser).start() # only if app.debug == False
  # run the app on the port
  app.run(host='0.0.0.0', port=port)
