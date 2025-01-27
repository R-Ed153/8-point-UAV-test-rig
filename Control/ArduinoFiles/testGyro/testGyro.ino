#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

#include <Wire.h>
Adafruit_MPU6050 mpu;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  initGyro();
}

void loop() {
  // put your main code here, to run repeatedly:
  measureGyro();
  delay(500);

}

void initGyro() {
  while (!mpu.begin()) {
    Serial.println("Gyro init failed");
    delay(500);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);
  Serial.println("Gyro init successful");
  delay(2000);
}

void measureGyro() {
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);
  
  float yaw = atan2(a.acceleration.z, sqrt(a.acceleration.z * a.acceleration.z + (a.acceleration.y + 0.0) * a.acceleration.y)) * 180 / PI;
  float roll = atan2(a.acceleration.y, sqrt(a.acceleration.x * a.acceleration.x + (a.acceleration.z + 1.0) * a.acceleration.z)) * 180 / PI;
  float pitch = atan2(-a.acceleration.x, sqrt(a.acceleration.y * a.acceleration.y + (a.acceleration.z + 1.0) * a.acceleration.z)) * 180 / PI;

  Serial.print("yaw:");
  Serial.print(yaw);
  Serial.print(" roll:");
  Serial.print(roll);
  Serial.print(" pitch: ");
  Serial.println(pitch);
 
  Serial.print("Xaxis: ");
  Serial.print(a.acceleration.x);
  Serial.print(" Yaxis: ");
  Serial.print(a.acceleration.y);
  Serial.print(" Zaxis: ");
  Serial.println(a.acceleration.z);
  delay(250);
}
