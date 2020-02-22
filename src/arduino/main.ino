
/*
 Stepper Motor Control - one revolution

 This program drives a unipolar or bipolar stepper motor.
 The motor is attached to digital pins 8 - 11 of the Arduino.

 The motor should revolve one revolution in one direction, then
 one revolution in the other direction.


 Created 11 Mar. 2007
 Modified 30 Nov. 2009
 by Tom Igoe

 */

#include <Stepper.h>
#include <Servo.h>

Servo rServo;
Servo pServo;


// initialize the steppers
Stepper xStepper(stepsPerRevolution, 10, 11,12, 13);
Stepper yStepper(stepsPerRevolution, 6, 7, 8, 9);
Stepper zStepper(stepsPerRevolution, 2, 3, 4, 5);

void setup() {
  // set the speed of stepper at 60 rpm:
  myStepper.setSpeed(60);
   myservo.attach(9);
  // initialize the serial port:
  Serial.begin(9600);
}

// calculate rate of x, y, z, and angles to make sure they end at the same time
char[] calculateRates(int x, int y, int z, int r, int p) {
  double t_distance = pow((pow(x,2) + pow(y,2) + pow(z,2)), .5);
  double TIME = t_distance;
  double x_rate = (x)/(TIME);
  double y_rate = (y)/(TIME);
  double z_rate = (z)/(TIME);
  
  return char[3] = {x_rate, y_rate, z_rate};
}

// take input string and turn it into a object
char[] parseInput(char[] in) {
  int x_index = in.indexOf('x');
  int y_index = in.indexOf('y');
  int z_index = in.indexOf('z');
  int r_index = in.indexOf('r');
  int phi_index = in.indexOf('p');
  int last_index = in.lastIndexOf(':'):

  int size_x = y_index - x_index -1;
  int size_y = z_index - y_index -1;
  int size_z = r_index - z_index -1;
  int size_r = phi_index - r_index -1;
  int size_phi = last_index - phi_index -1;

  int x_move = in.substring(x_index+1, x_index + 1 + size_x).toInt();
  int y_move = in.substring(y_index+1, y_index + 1 + size_y).toInt();
  int z_move = in.substring(z_index+1, z_index + 1 + size_z).toInt();
  int r_move = in.substring(r_index+1, r_index + 1 + size_r).toInt();
  int p_move = in.substring(p_index+1, p_index + 1 + size_p).toInt();

  return char[5] movements = {x_move, y_move, z_move, r_move, p_move};
  
}

// move the motors in a for loop one unit at a time with given delay
void executeMove(int rx, int ry, int rz, int rr, int rp) {
  x_stepsPerRev = rx;
  y_stepsPerRev = ry;
  z_stepsPerRev = rz;

  xStepper.step(x_stepsPerRev);
  yStepper.step(y_stepsPerRev);
  zStepper.step(z_stepsPerRev);

  rServo.write(map(rr, servo_rangeLow, servo_rangeHigh, -45, 45)));
  pServo.write(map(rp, servo_rangeLow, servo_rangeHigh, -45, 45)));
  
  delay(500);
  val = map(val, 0, 1023, -45, 45);
  myservo.write(val);
}

void loop() {
  
  if(Serial.available()) {
    char[] in = Serial.read();
    char[] movements = parseInput(in);
    char[] rates = calculateRates(movements[0], movements[1], movements[2], movements[3], movements[4]);
    executeMove(rates[0], rates[1], rates[2], rates[3], rates[4]);
    }
  }
    
