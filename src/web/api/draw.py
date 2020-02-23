from flask import *
import os
# from bson.json_util import dumps
from clients import arduino

api_draw = Blueprint('api_draw', __name__, template_folder='templates')

# GLOBALS
BOUNDS = {
  'x': {
    'min': 0,
    'max': 475
  },
  'y': {
    'min': 0,
    'max': 650
  },
  'z': {
    'min': 0,
    'max': 100
  },
  'r': {
    'min': 0,
    'max': 45
  },
  'phi': { # phi bounds are just for the frontend
    'min': 0,
    'max': 360
  }
}

current_pos = {
  'x': 100,
  'y': 100,
  'z': 100,
  'r': 0,
  'phi': 0
}

def validate_position(pos):
  if pos['x'] > BOUNDS['x']['max'] or pos['x'] < BOUNDS['x']['min']:
    return 'X out of bounds ' + str(pos['x']), {}
  if pos['y'] > BOUNDS['y']['max'] or pos['y'] < BOUNDS['y']['min']:
    return 'Y out of bounds ' + str(pos['y']), {}
  if pos['z'] > BOUNDS['z']['max'] or pos['z'] < BOUNDS['z']['min']:
    return 'Z out of bounds ' + str(pos['z']), {}
  if pos['r'] > BOUNDS['r']['max'] or pos['r'] < BOUNDS['r']['min']:
    return 'R out of bounds ' + str(pos['r']), {}
  
  # go in a circle for phi, if it's over 360 or under -360 just go to the new one
  pos['phi'] = pos['phi'] % 360
  return '', pos


def validate_to(command):
  new_pos = {
    'x': current_pos['x'] + command['x'],
    'y': current_pos['y'] + command['y'],
    'z': current_pos['z'] + command['z'],
    'r': command['r'],
    'phi': command['phi']
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

    # validations make sure positions don't go out of bounds

    if command['type'] == 'to':
      # convert to commands to abs commands based off of the current position
      error, new_pos = validate_to(command)
    elif command['type'] == 'abs':
      error, new_pos = validate_abs(command)
    elif command['type'] == 'down':
      new_pos = {
        'x': current_pos['x'],
        'y': current_pos['y'],
        'z': 50,
        'r': current_pos['r'],
        'phi': current_pos['phi'],
      }
    elif command['type'] == 'up':
      new_pos = {
        'x': current_pos['x'],
        'y': current_pos['y'],
        'z': 0,
        'r': current_pos['r'],
        'phi': current_pos['phi'],
      }
  
    # if there is an error then  return
    if error != '':
      return jsonify({ 'error': error, 'pos': current_pos }), 302

    # convert the position to a command
    command_str = translate(new_pos)

    # send the command to the arduino
    if not arduino.send(command_str):
      return jsonify({ 'error': 'Unable to connect to port', 'pos': current_pos }), 302

    # set the current position to this new position
    current_pos = new_pos

  # return with the final new position
  return jsonify(current_pos), 200
