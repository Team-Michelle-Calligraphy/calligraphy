from flask import *
import os
# from bson.json_util import dumps
from clients import arduino

api_draw = Blueprint('api_draw', __name__, template_folder='templates')

# GLOBALS

currentPosition = {
  'x': 0,
  'y': 0,
  'z': 0,
  'a': 0,
  'b': 0
}

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns load data in form of json
# ------------------------------------------------------------------------------
@api_draw.route('api/draw', methods=['POST'])
def api_draw_route():
  data = request.get_json()

  commands = data["commands"]

  # TODO: parse the commands and validate them
  # validations should make sure positions don't go out of bounds
  # should convert all to commands to abs commands based off of the current position
  # send commands one at a time to: arduino.send(command)

  # TODO: respond with the final positions

  resp = {
    'x': 10,
    'y': 10,
    'z': 10,
    'a': 10,
    'b': 10
  }

  currentPosition = resp

  return jsonify(resp), 200
