#include <Arduino.h>

// Motor A (Left)
const int IN1 = 9;  
const int IN2 = 10; 
// Motor B (Right)
const int IN3 = 6;  
const int IN4 = 5;  

void setup() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  
  Serial.begin(9600);
  Serial.println("UTRA: Syncing Motors..."); 
}

void forwardFullPower() {
  // Motor A - High
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);

  // Motor B - High
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void stopAll() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void loop() {
  Serial.println("Full speed ahead!");
  forwardFullPower();
  delay(3000); // Run for 3 seconds
  
  Serial.println("Halt.");
  stopAll();
  delay(2000); // Wait for 2 seconds
}