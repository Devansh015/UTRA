#include <Arduino.h>

// HW095 DC Motor Driver (L298N style H-bridge)
// Motor A: IN1, IN2
// Motor B: IN3, IN4

const int IN1 = 9;   // Motor A control pin 1
const int IN2 = 10;  // Motor A control pin 2
const int IN3 = 11;  // Motor B control pin 1
const int IN4 = 12;  // Motor B control pin 2

// Motor A functions
void motorA_forward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
}

void motorA_backward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
}

void motorA_stop() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
}

// Motor B functions
void motorB_forward() {
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void motorB_backward() {
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void motorB_stop() {
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

// Combined movement functions
void forward() {
  motorA_forward();
  motorB_forward();
}

void backward() {
  motorA_backward();
  motorB_backward();
}

void stopAll() {
  motorA_stop();
  motorB_stop();
}

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  Serial.begin(9600);
  Serial.println("HW095 DC Motor Driver Test");
  Serial.println("==========================");

  stopAll();
}

void loop() {
  Serial.println("Forward...");
  forward();
  delay(2000);

  Serial.println("Stop...");
  stopAll();
  delay(1000);

  Serial.println("Backward...");
  backward();
  delay(2000);

  Serial.println("Stop...");
  stopAll();
  delay(1000);
}
