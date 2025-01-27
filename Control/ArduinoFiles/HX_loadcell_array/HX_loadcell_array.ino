//
//    FILE: HX_loadcell_array.ino
//  AUTHOR: Rob Tillaart
// PURPOSE: HX711 demo
//     URL: https://github.com/RobTillaart/HX711
//
//  TODO: test with hardware

#include "HX711.h"

HX711 scale0;
HX711 scale1;


HX711 scales[2] = { scale0, scale1, };

//  adjust pins if needed
const uint8_t dataPin[2] = { 25, 26 };
const uint8_t clockPin = 27;

//  TODO you need to adjust to your calibrated scale values
float calib[2] = { 3000, 3000 };

uint32_t count = 0;

void setup()
{
  Serial.begin(115200);
  Serial.println(__FILE__);
  Serial.print("HX711_LIB_VERSION: ");
  Serial.println(HX711_LIB_VERSION);
  Serial.println();

  for (int i = 0; i < 2; i++)
  {
    scales[i].begin(dataPin[i], clockPin);
    scales[i].set_scale(calib[i]);
    //  reset the scale to zero = 0
    scales[i].tare();
  }
}


void loop()
{
  count++;
  Serial.print(count);
  for (int i = 0; i < 2; i++)
  {
    Serial.print("\t");
    Serial.print(scales[i].get_units(5));
  }
  Serial.println();
  delay(250);
}


//  -- END OF FILE --
