from flask import *
import os
# from bson.json_util import dumps
from clients import arduino

api_draw = Blueprint('api_draw', __name__, template_folder='templates')

# GLOBALS
BOUNDS = {
  'x': {
    'min': 0,
    'max': 600
  },
  'y': {
    'min': 0,
    'max': 600
  },
  'z': {
    'min': 0,
    'max': 600
  },
  'r': {
    'min': 0,
    'max': 45
  }
  # no min and max for phi
}

current_pos = {
  'x': 0,
  'y': 0,
  'z': 0,
  'r': 0,
  'phi': 0
}

def validate_position(pos):
  if pos['x'] > BOUNDS['x'] or pos['x'] < BOUNDS['x']['min']:
    return 'X out of bounds' + str(pos['x']), {}
  if pos['y'] > BOUNDS['y'] or pos['y'] < BOUNDS['y']['min']:
    return 'Y out of bounds' + str(pos['y']), {}
  if pos['z'] > BOUNDS['z'] or pos['z'] < BOUNDS['z']['min']:
    return 'Z out of bounds' + str(pos['z']), {}
  if pos['r'] > BOUNDS['r']['max'] or pos['r'] < BOUNDS['r']['min']:
    return 'R out of bounds' + str(pos['r']), {}
  
  # go in a circle for phi, if it's over 360 or under -360 just go to the new one
  pos['phi'] = pos['phi'] % 360
  return '', pos


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

def translate(new_pos):
  return 'x' + str(new_pos['x']) + ':y' + str(new_pos['y']) + ':z' + str(new_pos['z']) + ':r' + str(new_pos['r']) + ':p' + str(new_pos['phi']) + ':'


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
    new_pos = current_pos
    error = ''
    if command['type'] == 'to':
      error, new_pos = validate_to(command)
    elif (command['type'] == 'abs'):
      error, new_pos = validate_abs(command)
    # elif: down and up preset, 
    
    if error != '':
      return jsonify({ 'error': error }), 302

    # convert the position to a command
    command_str = translate(new_pos)

    # send the command to the arduino
    arduino.send(command_str)
    
    # set the current position to this new position
    current_pos = new_pos

  # validations should make sure positions don't go out of bounds
  # should convert all to commands to abs commands based off of the current position
  # send commands one at a time to: arduino.send(command)

  return jsonify(current_pos), 200
