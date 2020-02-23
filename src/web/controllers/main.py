# coding: utf-8
import os
from flask import *
import urlparse
import json

main = Blueprint(
  'main', __name__, template_folder='templates', static_folder='static')

# ------------------------------------------------------------------------------
# REQUIRES:
# MODIFIES:
# EFFECTS: returns the index page
# ------------------------------------------------------------------------------
@main.route("/")
def main_route():
  options = {}
  return render_template("draw.html", **options)
