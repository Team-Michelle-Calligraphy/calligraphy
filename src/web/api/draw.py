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

  num = 0
  if data["status"] == "on":
    num += 1
  if data["color"] == "red":
    num += 1
  elif data["color"] == "yellow":
    num += 3
  elif data["color"] == "green":
    num += 5
  elif data["color"] == "blue":
    num += 7

  arduino.send(num)
  return jsonify({}), 200
