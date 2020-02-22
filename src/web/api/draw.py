from flask import *
import os
# from bson.json_util import dumps
from clients import arduino

api_draw = Blueprint('api_draw', __name__, template_folder='templates')

# GLOBALS
BOUNDS = {
  'x': 270,
  'y': 330,
  'z': 90,
  'r': 30,
  'phi': 360
}

current_pos = {
  'x': 0,
  'y': 0,
  'z': 0,
  'r': 0,
  'phi': 0
}

def validate_position(pos):
  if pos['x'] > BOUNDS['x'] or pos['x'] < 0:
    return False
  if pos['y'] > BOUNDS['y'] or pos['y'] < 0:
    return False
  if pos['z'] > BOUNDS['z'] or pos['z'] < 0:
    return False
  if pos['r'] > BOUNDS['r'] or pos['r'] < 0:
    return False
  if pos['phi'] > BOUNDS['phi'] or pos['phi'] < 0:
    return False
  return pos


def validate_to(command):
  new_pos = {
    'x': current_pos['x'] + command['x'],
    'y': current_pos['y'] + command['y'],
    'z': current_pos['z'] + command['z'],
    'r': current_pos['r'] + command['r'],
    'phi': current_pos['phi'] + command['phi']
  }
  return validate_position(new_pos)

def validate_abs(command):
  new_pos = {
    'x': command['x'],
    'y': command['y'],
    'z': command['z'],
    'r': command['r'],
    'phi': command['phi']
  }
  return validate_position(new_pos)

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns load data in form of json
# ------------------------------------------------------------------------------
@api_draw.route('api/draw', methods=['POST'])
def api_draw_route():
  global current_pos
  data = request.get_json()

  commands = data['commands']
  for command in commands:
    print(command)
    new_pos = current_pos
    if command['type'] == 'to':
      new_pos = validate_to(command)
    elif (command['type'] == 'abs'):
      new_pos = validate_abs(command)
    # elif: down and up preset, 
    
    if new_pos == False:
      return jsonify({}), 302

    # convert the position to a command
    # command_stirng = translate(new_pos)

    # send the command to the arduino
    arduino.send('1') # command_string
    
    current_pos = new_pos

  # validations should make sure positions don't go out of bounds
  # should convert all to commands to abs commands based off of the current position
  # send commands one at a time to: arduino.send(command)

  return jsonify(current_pos), 200
