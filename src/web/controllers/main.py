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
# EFFECTS: returns the index page populated with tweets and user data
# ------------------------------------------------------------------------------
@main.route("/", methods=["GET"])
def main_route():

  options = {}
  options["strokes"] = []

  return render_template("draw.html", **options)
