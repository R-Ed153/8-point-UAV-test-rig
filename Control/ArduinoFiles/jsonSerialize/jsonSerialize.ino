#include <ArduinoJson.h>

int strainGaugeNo = 4;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println("Jump to start");
  delay(1000);
}

void loop() {
  setup();
  Serial.println(convertToJSON());
  delay(5000);
}

String convertToJSON() {
  String output;
  const int capacity = 14 * JSON_ARRAY_SIZE(2) + 2 * JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(8);
  StaticJsonDocument<capacity> recieveDoc;
  //orientation
  JsonObject orientation = recieveDoc.createNestedObject("orientation");
  JsonArray yaw = orientation.createNestedArray("yaw");
  yaw[0] = 90;
  yaw[1] = 30;
  JsonArray roll = orientation.createNestedArray("roll");
  roll[0] = 90;
  roll[1] = 30;
  JsonArray pitch = orientation.createNestedArray("pitch");
  pitch[0] = 90;
  pitch[1] = 30;

//acceleration
  JsonObject acceleration = recieveDoc.createNestedObject("acceleration");
  JsonArray XAxis = acceleration.createNestedArray("XAxis");
  XAxis[0] = 90;
  XAxis[1] = 30;
  JsonArray YAxis = acceleration.createNestedArray("YAxis");
  YAxis[0] = 90;
  YAxis[1] = 30;
  JsonArray ZAxis = orientation.createNestedArray("ZAxis");
  ZAxis[0] = 90;
  ZAxis[1] = 30;

  JsonObject force = recieveDoc.createNestedObject("force");
  JsonArray Gauge1 = force.createNestedArray("Gauge1");
  Gauge1[0] = 90;
  Gauge1[1] = 30;
  JsonArray Gauge2 = force.createNestedArray("Gauge2");
  Gauge2[0] = 90;
  Gauge2[1] = 30;
  JsonArray Gauge3 = force.createNestedArray("Gauge3");
  Gauge3[0] = 90;
  Gauge3[1] = 30;
  JsonArray Gauge4 = force.createNestedArray("Gauge4");
  Gauge4[0] = 90;
  Gauge4[1] = 30;
  JsonArray Gauge5 = force.createNestedArray("Gauge5");
  Gauge5[0] = 90;
  Gauge5[1] = 30;
  JsonArray Gauge6 = force.createNestedArray("Gauge6");
  Gauge6[0] = 90;
  Gauge6[1] = 30;
  JsonArray Gauge7 = force.createNestedArray("Gauge7");
  Gauge7[0] = 90;
  Gauge7[1] = 30;
  JsonArray Gauge8 = force.createNestedArray("Gauge8");
  Gauge8[0] = 90;
  Gauge8[1] = 30;
  
  

  serializeJson(recieveDoc, output);
  return output;
}
