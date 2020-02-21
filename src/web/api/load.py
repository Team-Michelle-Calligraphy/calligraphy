from flask import *
import os

api_load = Blueprint('api_load', __name__, template_folder='templates')

STROKES_PATH = 'strokes'

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns the names of all the strokes
# ------------------------------------------------------------------------------
@api_load.route('api/load', methods=['GET'])
def api_load_route():
  strokes = []
  file_names = os.listdir(STROKES_PATH)
  for file_name in file_names:
    file_location = os.path.join(STROKES_PATH, file_name)
    if os.path.isfile(file_location):
      file = open(file_location, "r")
      body = file.read()
      strokes.append({
        'name': file_name,
        'body': body
      })
      file.close()

  data = {
    'strokes': strokes
  }

  return jsonify(data), 200

