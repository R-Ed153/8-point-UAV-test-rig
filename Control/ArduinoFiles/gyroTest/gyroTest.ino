#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

LiquidCrystal_I2C lcd(0x27, 20, 4);
Adafruit_MPU6050 mpu;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(1, 0);
  lcd.print("Hello world");


 
  initGyro();

}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("Hello world");
  measureGyro();
  delay(500);

}

void measureGyro(){
  sensors_event_t a,g,t;
  mpu.getEvent(&a,&g,&t);
   
  float yaw =  atan2(a.acceleration.z,sqrt(a.acceleration.z*a.acceleration.z + (a.acceleration.y+0.0)*a.acceleration.y)) * 180/PI;
  float roll = atan2(a.acceleration.y,sqrt(a.acceleration.x*a.acceleration.x + (a.acceleration.z+1.0)*a.acceleration.z)) * 180/PI;
  float pitch = atan2(-a.acceleration.x,sqrt(a.acceleration.y*a.acceleration.y + (a.acceleration.z+1.0)*a.acceleration.z))*180/PI; 

  Serial.print("yaw:");
  Serial.print(round(yaw));
  Serial.print(" roll:");
  Serial.print(round(roll));
  Serial.print(" pitch: ");
  Serial.println(round(pitch)); 
  
  lcd.setCursor(1,0);
  lcd.print("Orientation");
  lcd.setCursor(2,0);
  lcd.print("yaw:");
  lcd.print(round(yaw));
  lcd.print(" roll:");
  lcd.print(round(roll));
  lcd.print(" pitch:");
  lcd.print(round(pitch));
  delay(1000);
  lcd.clear();

  Serial.print("Xaxis:");
  Serial.print(a.acceleration.x);
  Serial.print(" Yaxis: ");
  Serial.print(a.acceleration.y);
  Serial.print(" Zaxis:");
  Serial.println(a.acceleration.z); 

   lcd.setCursor(1,0);
  lcd.print("Acceleration");
  lcd.setCursor(2,0);
  lcd.print("X:");
  lcd.print(round(a.acceleration.x));
  lcd.print(" Y:");
  lcd.print(round(a.acceleration.y));
  lcd.print(" Z:");
  lcd.print(round(a.acceleration.z));
  delay(1000);
  lcd.clear();
    
  //orientation value
  delay(500);
}

void initGyro() {
  
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