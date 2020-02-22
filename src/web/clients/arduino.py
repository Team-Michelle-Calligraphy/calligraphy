
import serial
import serial.tools.list_ports

# https://www.youtube.com/watch?v=CebbJ7zrAWU
# https://stackoverflow.com/questions/24214643/python-to-automatically-select-serial-ports-for-arduino

# https://github.com/bborncr/gcodesender.py/blob/master/gcodesender.py

SERIAL = {}

# searches through the ports to find the Arduino
def findPort():
  ports = list(serial.tools.list_ports.comports())
  for p in ports:
    if 'Arduino' in p and setSerial(p):
      # if this says arduino and setting it works then stop here
      return True
  # if none of those work try this one
  return setSerial('/dev/cu.usbmodem14401') # TODO: pull from the enviornment

# use this to set a serial port for Arduino, can be called manually
# port number can be found in the bottom right corner of the Arduino software
def setSerial(port):
  try:
    SERIAL = serial.Serial(port, 9600)
    return True
  except:
    SERIAL = {}
    return False

# sends a string to the port
def send(message):
  # TODO: attach 's-<type>-<timestamp>' before the string
  SERIAL.write(str(message))
  # TODO: wait for a response from the machine (?)

# reads the serial to get info from the machine
def read():
  print(SERIAL.read()) # TODO: on Arduino: Serial.write(str)

# main
if __name__ == "__main__":
  findPort()