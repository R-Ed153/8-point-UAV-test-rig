#include <WiFi.h>
#include <HTTPClient.h>


const char* ssid = "Eeeedd";
const char* password = "edmund123";

String serverName = "http://192.168.222.160:8000/api/commands/getCommands";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  WiFi.begin(ssid,password);
  Serial.print("Conecting to WiFi");
  while(WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected to WiFi network with IP address: ");
  Serial.println(WiFi.localIP());

}

void loop() {
  // put your main code here, to run repeatedly:
  if(WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(serverName.c_str());
    int httpResponseCode = http.GET();
    String payload = http.getString();
    Serial.println(payload);
    http.end();
  }


}
