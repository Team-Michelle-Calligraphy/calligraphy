
import serial
import serial.tools.list_ports

# https://www.youtube.com/watch?v=CebbJ7zrAWU
# https://stackoverflow.com/questions/24214643/python-to-automatically-select-serial-ports-for-arduino

# https://github.com/bborncr/gcodesender.py/blob/master/gcodesender.py

# use this to set a serial port for Arduino, can be called manually
# port number can be found in the bottom right corner of the Arduino software

SERIAL = False
PORTS = list(serial.tools.list_ports.comports())
portOptions = []
selectedPort = ''

for p in PORTS:
  portOptions.append(p[0])
  if selectedPort == '' and 'Arduino' in p[0]:
    try:
      SERIAL = serial.Serial(p[0], 9600)
      selectedPort = p[0]
    except:
      pass

def setSerial(name):
  global SERIAL
  try:
    SERIAL = serial.Serial(name, 9600) # '/dev/cu.usbmodem14601'
    print('WORKED')
  except:
    print('FAILED')
    pass

# sends a string to the port
def send(message):
  global SERIAL
  if SERIAL is not False:
    resp = SERIAL.write(str(message))
    print(message)
    print(resp)
    return True
  else:
    return False

# reads the serial to get info from the machine
# def read():
#   return SERIAL.read()
