from flask import *
import os
# from bson.json_util import dumps

api_load = Blueprint('api_load', __name__, template_folder='templates')

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns load data in form of json
# ------------------------------------------------------------------------------
@api_load.route('api/load', methods=['GET'])
def api_load_route():
  return 200
	# return dumps(strokes), 200 
