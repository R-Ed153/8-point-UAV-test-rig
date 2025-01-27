#include <WiFi.h>
#include <WiFiManager.h>

#include <HTTPClient.h>
#include <ArduinoJson.h>

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

#include "HX711.h"

WiFiManager wifiManager;
String serverPath;

//initialization values for the LCD and gyroscope
LiquidCrystal_I2C lcd(0x27, 20, 4);
Adafruit_MPU6050 mpu;

//initialization values for the strain gauges
HX711 scale0;
HX711 scale1;
HX711 scale2;
HX711 scale3;
HX711 scale4;
HX711 scale5;
HX711 scale6;
HX711 scale7;
HX711 scales[8] = { scale0, scale1, scale2, scale3, scale4, scale5, scale6, scale7 };
float scaleMeasurements[10] = { 0, 0, 0, 0, 0, 0, 0, 0, 0 };

float calib4[4] = { -981925.50, 3000, -936352.63, 794152.19 };
float calib6[6] = { -700263.17, 791549.38, 651947, 732265, 157285, 703240.69 };
float calib8[8] = { -479831.38, 430219.19, 336270.50, 553885.38, -527085.87, 1929624.75, 420595.63, 509624.06 };

float offsets8[8] = { 0, 0, 0, 0, 0, 0, 0, 0 };

int strainGaugeNumber;

String gatewayIP;
String payload;
unsigned long startTime;
String testState = "false";


float accelerationValues[3];
int orientationValues[3];
unsigned long testTimes[3];  //0-orientation,1-acceleration,2-force
float totalForce;

void setup() {
  // put your setup code here, to run once:
  //initilize the serial,wifi and lcd for communication
  Serial.begin(115200);
  initLCD();
  initWiFi();

  //initialize the gyroscope for measurement taking
  initGyro();

  //check for test start from the user interface
  while (testState != "true") {
    LCDMessage(1, "Input file name");
    LCDMessage(2, "to start the test");
    testState = initTest();
    Serial.println(testState);
    delay(1000);
  }
  lcd.clear();
  LCDMessage(1, "Test file initialized");
  LCDMessage(2, "successfully");
  delay(1000);
  lcd.clear();



  Serial.print("Strain Gauge Number: ");
  Serial.println(strainGaugeNumber);
  initStrainGauges(strainGaugeNumber);

  startTime = millis();
  LCDMessage(0, "Strain gauges initialized");
  LCDMessage(1, "successfully");

  LCDMessage(2, "Strain Gauge No: 0");
  lcd.setCursor(17, 2);
  lcd.print(strainGaugeNumber);
  delay(1000);
  lcd.clear();
}

void loop() {
  // put your main code here, to run repeatedly:
  if (testState != "false") {
    Serial.println(sendMeasurements("/api/sensorMeasurements", convertMeasurementsToJSON()));
    measureGyro();
    forceMeasurement(strainGaugeNumber);
    delay(20);
    testState = testEnded();
    Serial.println(testState);
  } else {
    Serial.println("Test has been ended successfully");
    LCDMessage(0, "Test has been ended,");
    LCDMessage(1, "rig will restart");
    LCDMessage(2, "for another test");
    delay(2000);
    setup();
  }
}

void initLCD() {
  lcd.init();
  lcd.backlight();
  LCDMessage(1, "Initializing the LCD");
  Serial.println("Initializing the LCD");
  delay(1000);
  lcd.clear();
  LCDMessage(0, "Welcome to the UAV");
  LCDMessage(1, "Test Rig");
  delay(1000);
  lcd.clear();
}

void LCDMessage(int Row, char* message) {
  lcd.setCursor(0, Row);
  lcd.print(message);
}

void initWiFi() {
  LCDMessage(1, "Initializing WiFi");
  delay(2000);
  lcd.clear();
  LCDMessage(0, "Connect to The-Test");
  LCDMessage(1, "-Rig and enter WiFi ");
  LCDMessage(2, "settings to: ");
  LCDMessage(3, "IP: 192.168.4.1");
  //wifiManager.resetSettings();
  wifiManager.autoConnect("The-Test-Rig");
  lcd.clear();
  gatewayIP = WiFi.gatewayIP().toString();
  LCDMessage(1, "WiFi successfully");
  LCDMessage(2, "connected");
  delay(2000);
}

void initGyro() {
  LCDMessage(1, "Initializing the Gyro");
  while (!mpu.begin()) {
    Serial.println("Gyro init failed");
    delay(500);
    lcd.clear();
    LCDMessage(1, "Gyro init failed");
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);
  Serial.println("Gyro init successful");
  LCDMessage(1, "Gyro init successful");
  delay(2000);
  lcd.clear();
}

String initTest() {
  //Check whether the test has been initialized;
  JsonDocument recieveDoc;
  String start = httpRequest("/api/commands/testStarted");
  deserializeJson(recieveDoc, start);
  String strainGaugeNo = recieveDoc["strainGaugeNumber"];
  strainGaugeNumber = strainGaugeNo.toInt();
  return (recieveDoc["message"]);
}

String testEnded() {
  JsonDocument endDoc;
  String end = httpRequest("/api/commands/testEnded");
  deserializeJson(endDoc, end);
  return (endDoc["message"]);
}

void initStrainGauges(int strainGaugeNumber) {
  //data pins
  int dataPins_8[10] = { 32, 33, 26, 27, 19, 18, 17, 16, 13, 4 };  // 1,2,3,4,5,6,7,8
  int dataPins_6[8] = { 32, 33, 27, 19, 18, 16, 13, 4 };           //1,2,4,5,6,8
  int dataPins_4[6] = { 32, 27, 19, 17, 13, 23 };                  //1,3,5,7
  if (strainGaugeNumber == 4) {
    for (int i = 0; i < 2; i++) {
      scales[i].begin(dataPins_4[i], dataPins_4[4]);
    }
    for (int i = 2; i < 4; i++) {
      scales[i].begin(dataPins_4[i], dataPins_4[5]);
    }

  } else if (strainGaugeNumber == 6) {
    for (int i = 0; i < 3; i++) {
      scales[i].begin(dataPins_6[i], dataPins_6[6]);
    }
    for (int i = 3; i < 6; i++) {
      scales[i].begin(dataPins_6[i], dataPins_6[7]);
    }
  } else if (strainGaugeNumber == 8) {
    for (int i = 0; i < 4; i++) {
      scales[i].begin(dataPins_8[i], dataPins_8[8]);
    }
    for (int i = 4; i < strainGaugeNumber; i++) {
      scales[i].begin(dataPins_8[i], dataPins_8[9]);
    }
  }
  if (strainGaugeNumber == 4) {
    for (int i = 0; i < 4; i++) {
      scales[i].set_scale(calib4[i]);
      scales[i].tare(10);
    }
  } else if (strainGaugeNumber == 6) {
    for (int i = 0; i < 6; i++) {
      scales[i].set_scale(calib6[i]);
      scales[i].tare(10);
    }
  } else if (strainGaugeNumber == 8) {
    for (int i = 0; i < 8; i++) {
      scales[i].set_scale(calib8[i]);
      scales[i].tare(10);
    }
  }
}

String httpRequest(String link) {
  String payload;
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    serverPath = "http://" + gatewayIP + ":8000" + link;
    http.begin(serverPath.c_str());
    int httpResponseCode = http.GET();
    if (httpResponseCode == 200) {
      payload = http.getString();
      Serial.println(payload);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
    return payload;
  }
}

String sendMeasurements(String link, String httpRequestData) {
  // Measurement values conversion to JSON
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    serverPath = "http://" + gatewayIP + ":8000" + link;
    http.begin(serverPath);

    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(httpRequestData);

    if (httpResponseCode == 200) {
      payload = http.getString();
      Serial.println(payload);
    } else {
      Serial.print("Error code:");
      Serial.println(httpResponseCode);
    }
    http.end();
    return payload;
  }
}

String convertMeasurementsToJSON() {
  String output;
  const int capacity = 2 * JSON_OBJECT_SIZE(4) + JSON_ARRAY_SIZE(10);
  StaticJsonDocument<capacity> recieveDoc;
  //orientation
  JsonObject orientation = recieveDoc.createNestedObject("orientation");
  orientation["yaw"] = orientationValues[0];
  orientation["roll"] = orientationValues[1];
  orientation["pitch"] = orientationValues[2];
  //orientation["yaw"] = 30;
  //orientation["roll"] = 20;
  //orientation["pitch"] = 10;
  orientation["time"] = testTimes[0];


  //acceleration
  JsonObject acceleration = recieveDoc.createNestedObject("acceleration");
  Serial.print(accelerationValues[0]);
  acceleration["xAxis"] = accelerationValues[0];
  acceleration["yAxis"] = accelerationValues[1];
  acceleration["zAxis"] = accelerationValues[2];
  //acceleration["xAxis"] = 40;
  //acceleration["yAxis"] = 20;
  //acceleration["zAxis"] = 90;
  acceleration["time"] = testTimes[1];
  //force

  JsonArray forceArray = recieveDoc.createNestedArray("force");
  for (int i = 0; i <= strainGaugeNumber + 1; i++) {
    forceArray.add(scaleMeasurements[i]);
  }

  Serial.print("Force array: ");
  for (int i = 0; i <= strainGaugeNumber; i++) {
    Serial.print(scaleMeasurements[i]);
    Serial.print(",");
  }
  serializeJson(recieveDoc, output);
  displayMeasurements();

  return output;
}

void measureGyro() {
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);
  testTimes[0] = millis() - startTime;
  testTimes[1] = millis() - startTime;

  float yaw = atan2(a.acceleration.z, sqrt(a.acceleration.z * a.acceleration.z + (a.acceleration.y + 0.0) * a.acceleration.y)) * 180 / PI;
  float roll = atan2(a.acceleration.y, sqrt(a.acceleration.x * a.acceleration.x + (a.acceleration.z + 1.0) * a.acceleration.z)) * 180 / PI;
  float pitch = atan2(-a.acceleration.x, sqrt(a.acceleration.y * a.acceleration.y + (a.acceleration.z + 1.0) * a.acceleration.z)) * 180 / PI;

  Serial.print("yaw:");
  Serial.print(yaw);
  Serial.print(" roll:");
  Serial.print(roll);
  Serial.print(" pitch: ");
  Serial.println(pitch);
  //m/s
  accelerationValues[0] = a.acceleration.x;
  accelerationValues[1] = a.acceleration.y;
  accelerationValues[2] = a.acceleration.z;

  Serial.print("Xaxis: ");
  Serial.print(a.acceleration.x);
  Serial.print(" Yaxis: ");
  Serial.print(a.acceleration.y);
  Serial.print(" Zaxis: ");
  Serial.println(a.acceleration.z);

  //orientation value
  orientationValues[0] = yaw;
  orientationValues[1] = roll;
  orientationValues[2] = pitch;

  delay(20);
}


void forceMeasurement(int strainGaugeNo) {
  for (int i = 0; i < strainGaugeNo; i++) {
    scaleMeasurements[i] = scales[i].get_units(5) / strainGaugeNo;
    totalForce = totalForce + scaleMeasurements[i];
  }
  scaleMeasurements[strainGaugeNo] = millis() - startTime;
  scaleMeasurements[strainGaugeNo + 1] = totalForce;
  delay(20);
}

void displayMeasurements() {
  lcd.setCursor(0, 0);
  lcd.print("Measurements:");

  //acceleration
  lcd.setCursor(0, 1);
  lcd.print("A:");
  lcd.print("X:");
  lcd.print(round(accelerationValues[0] / 1));
  lcd.print("Y:");
  lcd.print(round(accelerationValues[1] / 1));
  lcd.print("Z:");
  lcd.print(round(accelerationValues[2] / 1));

  //orientation
  lcd.setCursor(0, 2);
  lcd.print("O:");
  lcd.print("X:");
  lcd.print(round(orientationValues[1] / 1));
  lcd.print("Y:");
  lcd.print(round(orientationValues[2] / 1));
  lcd.print("Z:");
  lcd.print(round(orientationValues[0] / 1));

  //force
  lcd.setCursor(0, 3);
  lcd.print("Tforce: ");
  lcd.print(round(totalForce) / 1);

  totalForce = 0;
}