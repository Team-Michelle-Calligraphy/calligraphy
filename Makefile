
default: serve

serve:
	python src/web/main.py

# user needs python2.7 and pip installed
install:
	pip install Flask==0.10.1
	pip install pyserial==2.7
