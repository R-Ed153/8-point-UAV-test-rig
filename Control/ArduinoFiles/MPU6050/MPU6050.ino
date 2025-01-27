#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

Adafruit_MPU6050 mpu;
float accelerationValues [3][2];
int orientationValues [3][2]; 


void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);


}

void loop() {
  // put your main code here, to run repeatedly:

}

void initializeGyro(){
  if(!mpu.begin()){
    Serial.println("Sensor init failed");
    while(1){
      yield();
    }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);
  }
}

int measureGyro(){
  sensors_event_t a,g,t;
  mpu.getEvent(&a,&g,&t);

  float yaw =  atan2(a.acceleration.z,sqrt(a.acceleration.z*a.acceleration.z + (a.acceleration.y+0.0)*a.acceleration.y)) * 180/PI;
  float roll = atan2(a.acceleration.y,sqrt(a.acceleration.x*a.acceleration.x + (a.acceleration.z+1.0)*a.acceleration.z)) * 180/PI;
  float pitch = atan2(-a.acceleration.x,sqrt(a.acceleration.y*a.acceleration.y + (a.acceleration.z+1.0)*a.acceleration.z))*180/PI; 
  //m/s
  accelerationValues[0][0] = a.acceleration.x;
  accelerationValues[1][0] = a.acceleration.y;
  accelerationValues[2][0] = a.acceleration.z;

  //rad/s
  orientationValues[0][0] = g.orientation.x;
  orientationValues[1][0] = g.orientation.y;
  orientationValues[2][0] = g.orientation.z;

}