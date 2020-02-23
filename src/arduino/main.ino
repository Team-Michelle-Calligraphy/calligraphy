
#include <Stepper.h>
#include <Servo.h>

Servo rServo;
Servo pServo;

int currentPosition[5] = {0,0,0,0,0};

int deltas[5] = {0,0,0,0,0};
String in;
double rates[5] = {0,0,0,0,0};
int movements[5] = {0,0,0,0,0};

const int servo_rangeLow = 0;
const int servo_rangeHigh = 100;

int stepsPerRevolution = 200;

// initialize the steppers
Stepper xStepper(stepsPerRevolution, 10, 11,12, 13);
Stepper yStepper(stepsPerRevolution, 6, 7, 8, 9);
Stepper zStepper(stepsPerRevolution, 2, 3, 4, 5);



void setup() {
  rServo.attach(A0);
  pServo.attach(A1);
  // initialize the serial port:
  Serial.begin(9600);
}

// calculate rate of x, y, z, and angles to make sure they end at the same time
 void delta_distance() {
  int x_delt = movements[0] - currentPosition[0];
  int y_delt = movements[1] - currentPosition[1];
  int z_delt = movements[2] - currentPosition[2];
  int r_delt = movements[3]- currentPosition[3];
  int p_delt = movements - currentPosition[4];

  int deltas[5] = {x_delt, y_delt, z_delt, r_delt, p_delt};
}

double calculateRates() {
  double total_distance = pow((pow(movements[0],2) + pow(movements[0],2) + pow(movements[0],2)), .5);
  double TIME = total_distance;
  rates[0] = abs((movements[0])/(TIME));
  rates[1] = abs((movements[0])/(TIME));
  rates[2] = abs((movements[0])/(TIME));
  
}


// take input string and turn it into a object
void parseInput() {
  int x_index = in.indexOf('x');
  int y_index = in.indexOf('y');
  int z_index = in.indexOf('z');
  int r_index = in.indexOf('r');
  int p_index = in.indexOf('p');
  int last_index = in.lastIndexOf(':');

  int size_x = y_index - x_index -2;
  int size_y = z_index - y_index -2;
  int size_z = r_index - z_index -2;
  int size_r = p_index - r_index -2;
  int size_p = last_index - p_index -2;

  int x_move = in.substring(x_index+1, x_index + 1 + size_x).toInt();
  int y_move = in.substring(y_index+1, y_index + 1 + size_y).toInt();
  int z_move = in.substring(z_index+1, z_index + 1 + size_z).toInt();
  int r_move = in.substring(r_index+1, r_index + 1 + size_r).toInt();
  int p_move = in.substring(p_index+1, p_index + 1 + size_p).toInt();

  movements[0] = x_move;
  movements[1] = y_move;
  movements[2] = z_move;
  movements[3] = r_move;
  movements[4] = p_move;
  
}

// move the motors in a for loop one unit at a time with given delay
void executeMove() {

  xStepper.setSpeed(rates[0]);
  xStepper.setSpeed(rates[1]);
  xStepper.setSpeed(rates[2]);

  
  xStepper.step(deltas[0]);
  yStepper.step(deltas[1]);
  zStepper.step(deltas[2]);

  rServo.write(map(rates[3], servo_rangeLow, servo_rangeHigh, -45, 45));
  pServo.write(map(rates[4], servo_rangeLow, servo_rangeHigh, -45, 45));
}

void loop() {
  
  if(Serial.available()) {
    in = Serial.read();
    parseInput();
    delta_distance();
    calculateRates();
    executeMove();
    }
  }
