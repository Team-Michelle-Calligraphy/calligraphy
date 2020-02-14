from flask import *
from datetime import datetime
import os

api_save = Blueprint('api_save', __name__, template_folder='templates')

@api_save.route('api/save', methods=['POST'])
def api_save_route():
	return jsonify({}), 200
