
import serial

# https://www.youtube.com/watch?v=CebbJ7zrAWU

SERIAL = serial.Serial('COM15', 9600)

def on():
  SERIAL.write('1')

def off():
  SERIAL.write('0')