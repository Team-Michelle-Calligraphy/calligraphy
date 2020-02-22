

void setup() {
  Serial.begin(9600);
  pinMode(8, OUTPUT);
  pinMode(9, INPUT);
}

void loop() {
  if(Serial.available()) {
    switch(Serial.read()) {
    case '0':
      digitalWrite(8, LOW);
      break;
    case '1':
      digitalWrite(8, HIGH);
      break;
    default:
      break;
    }
  }
  if(digitalRead(9, HIGH)) {
    Serial.write('ok')
  }
}