from flask import *
import os
# from bson.json_util import dumps
from clients import arduino

api_draw = Blueprint('api_draw', __name__, template_folder='templates')

# GLOBALS
x_bounds = 270
y_bounds = 330
z_bounds = 90
r_bounds = 30
phi_bounds = 30

currentPosition = {
  'x': 0,
  'y': 0,
  'z': 0,
  'r': 0,
  'phi': 0
}

def validate_to(command) :
  move_x = command["x"]
  if currentPosition['x'] + move_x > x_bounds || currentPosition['x'] + move_x < 0:
    return False
    
  move_y = command["y"]
  if currentPosition['y'] + move_y > y_bounds || currentPosition['y'] + move_y < 0:
    return False

  move_z = command["z"]
  if currentPosition['z'] + move_z > z_bounds || currentPosition['z'] + move_z < 0:
    return False

  move_a = command["r"]
  if currentPosition['r'] + move_r > r_bounds || currentPosition['r'] + move_r < 0:
    return False
      
  move_b = command["phi"]
  if currentPosition['phi'] + move_phi > phi_bounds || currentPosition['phi'] + move_phi < 0:
    return False
    
def validate_abs(command) :
  if command['type'] == "abs":
    if currentPosition['x'] > x_bounds || currentPosition['x'] < 0:
      return False;
    
    if currentPosition['y'] > y_bounds || currentPosition['y'] < 0:
      return False
    
    if currentPosition['z'] > z_bounds || currentPosition['z'] < 0:
      return False
    
    if currentPosition['r'] > r_bounds || currentPosition['r'] < 0:
      return False
    
    if currentPosition['phi'] > phi_bounds || currentPosition['phi'] < 0:
      return False

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns load data in form of json
# ------------------------------------------------------------------------------
@api_draw.route('api/draw', methods=['POST'])
def api_draw_route():
  data = request.get_json()

  commands = data["commands"]
  for (command in commands):
    if (command['type'] == "to":
      validate_to(command)
    if (command['type'] == "abs"):
      validate_abs(command)
      
    ## Update Current Position
    currentPosition['x'] = currentPosition['x'] + move_x
    currentPosition['y'] = currentPosition['y'] + move_y
    currentPosition['z'] = currentPosition['z'] + move_z
    currentPosition['a'] = currentPosition['a'] + move_a
    currentPosition['b'] = currentPosition['b'] + move_b
  
  
  # validations should make sure positions don't go out of bounds
  # should convert all to commands to abs commands based off of the current position
  # send commands one at a time to: arduino.send(command)

  resp = {
    'x': currentPosition['x'],
    'y': currentPosition['y'],
    'z': currentPosition['z'],
    'r': currentPosition['r'],
    'phi': currentPosition['phi']
  }

  currentPosition = resp

  return jsonify(resp), 200
