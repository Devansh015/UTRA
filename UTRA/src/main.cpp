#include <Arduino.h>

// HC-SR04 Ultrasonic Sensor Test
// Connect TRIG to pin 9
// Connect ECHO to pin 10
// Connect VCC to 5V
// Connect GND to GND

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
  Serial.println("HC-SR04 Ultrasonic Sensor Test");
  Serial.println("==============================");
}

void loop() {
  // Send trigger pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Read echo pulse duration
  long duration = pulseIn(ECHO_PIN, HIGH);

  // Calculate distance (speed of sound = 343 m/s = 0.0343 cm/us)
  // Distance = (duration * 0.0343) / 2
  float distanceCm = (duration * 0.0343) / 2.0;
  float distanceInch = distanceCm / 2.54;

  // Display distance
  Serial.print("Distance: ");
  Serial.print(distanceCm, 1);
  Serial.print(" cm | ");
  Serial.print(distanceInch, 1);
  Serial.println(" in");

  delay(200);
}
