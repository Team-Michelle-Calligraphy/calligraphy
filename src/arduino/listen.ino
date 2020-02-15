

void setup() {
  Serial.begin(9600);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
}

void loop() {
  if(Serial.available()) {
    switch(Serial.read()) {
    case '1':
      digitalWrite(8, LOW);
      break;
    case '2':
      digitalWrite(8, HIGH);
      break;
    case '3':
      digitalWrite(9, LOW);
      break;
    case '4':
      digitalWrite(9, HIGH);
      break;
    case '5':
      digitalWrite(10, LOW);
      break;
    case '6':
      digitalWrite(10, HIGH);
      break;
    case '7':
      digitalWrite(11, LOW);
      break;
    case '8':
      digitalWrite(11, HIGH);
      break;
    default:
      break;
    }
  }
}