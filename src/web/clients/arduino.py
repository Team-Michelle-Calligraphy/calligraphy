
import serial
# import serial.tools.list_ports

# https://www.youtube.com/watch?v=CebbJ7zrAWU
# https://stackoverflow.com/questions/24214643/python-to-automatically-select-serial-ports-for-arduino

# ports = list(serial.tools.list_ports.comports())
# for p in ports:
#   print(p)
#   Arduino

SERIAL = serial.Serial('/dev/cu.usbmodem14401', 9600)

def send(message):
  SERIAL.write(str(message))
  # TODO: wait for a response from the machine (?)

def read():
  print(SERIAL.read()) # on Arduino: Serial.write(str)