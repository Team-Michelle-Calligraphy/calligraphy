
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

Servo myservo;

int val = -15; 
// Steps per revolution -- how much is one "unit"
const int stepsPerRevolution = 50;

// initialize the stepper library on pins 8 through 11:
Stepper myStepper(stepsPerRevolution, 10, 11,12, 13);

void setup() {
  // set the speed of stepper at 60 rpm:
  myStepper.setSpeed(60);
   myservo.attach(9);
  // initialize the serial port:
  Serial.begin(9600);
}

// move the motors in a for loop one unit at a time with given delay
void executeMove() {
  
}

// calculate rate of x, y, z, and angles to make sure they end at the same time
void calculateRates() {
  
}

// take input string and turn it into a object
void parseInput() {
  
}

void loop() {
  
  if(Serial.available()) {
    char[] in = Serial.read();
    
    }
  }
 
  if (new_bool new_read) {
  // step one revolution  in one direction:
  Serial.println("clockwise");
  myStepper.step(stepsPerRevolution);
  delay(500);

  // step one revolution in the other direction:
  Serial.println("counterclockwise");
  myStepper.step(-stepsPerRevolution);

  delay(500);
  val = map(val, 0, 1023, -45, 45);
  myservo.write(val);    
  }
}
