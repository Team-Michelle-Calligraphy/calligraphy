from flask import *
import os
# from bson.json_util import dumps

api_draw = Blueprint('api_draw', __name__, template_folder='templates')

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns load data in form of json
# ------------------------------------------------------------------------------
@api_draw.route('api/draw', methods=['GET'])
def api_draw_route():
	return dumps(strokes), 200 
