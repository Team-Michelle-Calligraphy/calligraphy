from flask import *
import os
# from bson.json_util import dumps
from clients import arduino

api_draw = Blueprint('api_draw', __name__, template_folder='templates')

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns load data in form of json
# ------------------------------------------------------------------------------
@api_draw.route('api/draw', methods=['POST'])
def api_draw_route():
  data = request.get_json()

  command = data["command"]
  serial = serialize(command)

  arduino.send(serial)

  resp = {
    'x': 10,
    'y': 10,
    'z': 10,
    'a': 10,
    'b': 10
  }

  return jsonify(resp), 200
