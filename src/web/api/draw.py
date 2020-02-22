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
  move_y = command["y"]
  move_z = command["z"]
  move_r = command["r"]
  move_phi = command["phi"]
  
  
  new_pos['x'] = command['x'] + move_x
  new_pos['y'] = command['y'] + move_y
  new_pos['z'] = command['z'] + move_z
  new_pos['r'] = command['r'] + move_r
  new_pos['phi'] = command['phi'] + move_phi
  
  if new_pos['x'] > x_bounds or new_pos['x'] < 0:
    return False;
  
  if new_pos['y'] > y_bounds or new_pos['y'] < 0:
    return False
  
  if new_pos['z'] > z_bounds or new_pos['z'] < 0:
    return False
  
  if new_pos['r'] > r_bounds or new_pos['r'] < 0:
    return False
  
  if new_pos['phi'] > phi_bounds or new_pos['phi'] < 0:
    return False
    
  return new_pos
    
def validate_abs(command) :
  if command['type'] == "abs":
    new_pos['x'] = command['x']
    new_pos['y'] = command['y']
    new_pos['z'] = command['z']
    new_pos['r'] = command['r']
    new_pos['phi'] = command['phi']
    
    if new_pos['x'] > x_bounds or new_pos['x'] < 0:
      return False;
    
    if new_pos['y'] > y_bounds or new_pos['y'] < 0:
      return False
    
    if new_pos['z'] > z_bounds or new_pos['z'] < 0:
      return False
    
    if new_pos['r'] > r_bounds or new_pos['r'] < 0:
      return False
    
    if new_pos['phi'] > phi_bounds or new_pos['phi'] < 0:
      return False
      
    return new_pos

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns load data in form of json
# ------------------------------------------------------------------------------
@api_draw.route('api/draw', methods=['POST'])
def api_draw_route():
  data = request.get_json()

  commands = data["commands"]
  for command in commands:
    new_pos = {}
    if command['type'] == "to":
      new_pos = validate_to(command)
    elif (command['type'] == "abs"):
      new_pos = validate_abs(command)
    
    command_stirng = translate(new_pos)
    
#    arduino.send(command_string)
    
    currentPosition = new_pos;
    
    ##
  
  
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
  

  return jsonify(resp), 200
