#include "HX711.h"

#include <WiFi.h>
#include <WiFiManager.h>

#include <HTTPClient.h>
#include <ArduinoJson.h>

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

//allowable pins (4,16,17,18,19,23)(32,33,25,26,27,13)
//(34*,35*),(data only)
WiFiManager wifiManager;
LiquidCrystal_I2C lcd(0x27, 20, 4);

HX711 scale0;
HX711 scale1;
HX711 scale2;
HX711 scale3;
HX711 scale4;
HX711 scale5;
HX711 scale6;
HX711 scale7;

HX711 scales[8] = { scale0, scale1, scale2, scale3, scale4, scale5, scale6, scale7 };
float scaleMeasurements[8] = { 0, 0, 0, 0, 0, 0, 0, 0 };
String serverPath;
String gatewayIP;

//const uint8_t dataPin[4] = {32,33,25,26};
//const uint8_t clockPin = 13;

//const uint8_t dataPin[4] = {19,18,17,16};
//const uint8_t clockPin = 23;

int calib4[4] = { 3000, 3000, 3000, 3000 };
int calib6[6] = { 3000, 3000, 3000, 3000, 3000, 3000 };
int calib8[8] = { 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000 }; /* Insert your calibration factor here */
;

void setup() {
  Serial.begin(115200);
  initWiFi();
  initStrainGauges(8);
  // Reset scale to zero
}

void loop() {
  forceMeasurement(8);
  Serial.println(sendMeasurements("/api/sensorMeasurements/testForceMeasurements", convertMeasurementsToJSON()));

  delay(500);
}

String convertMeasurementsToJSON() {
  String output;
  const int capacity = JSON_OBJECT_SIZE(9);
  StaticJsonDocument<capacity> recieveDoc;
  //force
  JsonObject force = recieveDoc.createNestedObject("force");
  force["gauge1"] = scaleMeasurements[0];
  force["gauge2"] = scaleMeasurements[1];
  force["gauge3"] = scaleMeasurements[2];
  force["gauge4"] = scaleMeasurements[3];
  force["gauge5"] = scaleMeasurements[4];
  force["gauge6"] = scaleMeasurements[5];
  force["gauge7"] = scaleMeasurements[6];
  force["gauge8"] = scaleMeasurements[7];
  force["time"] = 1000;

  serializeJson(recieveDoc, output);
  return output;
}

String sendMeasurements(String link, String httpRequestData) {
  // Measurement values conversion to JSON
  String payload;
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

void initWiFi() {
  //wifiManager.resetSettings();
  wifiManager.autoConnect("The-Test-Bed");
  gatewayIP = WiFi.gatewayIP().toString();
  delay(2000);
}


void forceMeasurement(int strainGaugeNo) {
  for (int i = 0; i < strainGaugeNo; i++) {
    scaleMeasurements[i] = scales[i].get_units(5);
  }
  delay(250);
}

void initStrainGauges(int strainGaugeNumber) {
  //data pins
  int dataPins[10] = { 32, 33, 26, 27, 19, 18, 17, 16, 13, 4 };
  for (int i = 0; i < 4; i++) {
    scales[i].begin(dataPins[i], dataPins[8]);
  }
  for (int i = 4; i < strainGaugeNumber; i++) {
    scales[i].begin(dataPins[i], dataPins[9]);
  }
  if (strainGaugeNumber == 4) {
    for (int i = 0; i < 4; i++) {
      scales[i].set_scale(calib4[i]);
      scales[i].tare();
    }
  } else if (strainGaugeNumber == 6) {
    for (int i = 0; i < 6; i++) {
      scales[i].set_scale(calib6[i]);
      scales[i].tare();
    }
  } else if (strainGaugeNumber == 8) {
    for (int i = 0; i < 8; i++) {
      scales[i].set_scale(calib8[i]);
      scales[i].tare();
    }
  }
}