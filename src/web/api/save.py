from flask import *
import os
from clients import arduino

api_save = Blueprint('api_save', __name__, template_folder='templates')

STROKES_PATH = 'strokes'

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns the names of all the strokes
# ------------------------------------------------------------------------------
@api_save.route('api/save', methods=['POST'])
def api_save_route():
  data = request.get_json()

  file_name = data['name']
  file_contents = data['body']
  file_location = os.path.join(STROKES_PATH, file_name)

  if file_contents == "":
    if not os.path.isfile(file_location):
      return jsonify({}), 302
    os.remove(file_location)
  else:
    file = open(file_location, "w")
    file.write(file_contents)
    file.close()

  return jsonify({}), 200
