
import serial
import serial.tools.list_ports

# https://www.youtube.com/watch?v=CebbJ7zrAWU
# https://stackoverflow.com/questions/24214643/python-to-automatically-select-serial-ports-for-arduino

# https://github.com/bborncr/gcodesender.py/blob/master/gcodesender.py

# use this to set a serial port for Arduino, can be called manually
# port number can be found in the bottom right corner of the Arduino software
# def setSerial(port):
#   try:
#     SERIAL = serial.Serial(port, 9600)
#     return True
#   except:
#     SERIAL = False
#     return False

SERIAL = False
PORTS = list(serial.tools.list_ports.comports())

port_options = []

for p in PORTS:
  if 'Arduino' in p[0] and setSerial(p[0]):
    # if this says arduino and setting it works then stop here
    break


SERIAL = serial.Serial('/dev/cu.usbmodem14601', 9600)

# sends a string to the port
def send(message):
  print(message)
  SERIAL.write(str(message))

# reads the serial to get info from the machine
# def read():
#   return SERIAL.read()
