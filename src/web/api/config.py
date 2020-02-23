from flask import *
from clients import arduino

api_config = Blueprint('api_config', __name__, template_folder='templates')

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns the names of all the strokes
# ------------------------------------------------------------------------------
@api_config.route('api/config', methods=['POST'])
def api_config_route():
  data = request.get_json()
  arduino.setSerial(data['serial'])
  return jsonify({}), 200

