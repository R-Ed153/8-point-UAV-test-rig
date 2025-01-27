import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import { IndicatorDials } from "./indicatorDials.jsx";
import { Button } from "./button.jsx";
import { Polygon } from "./polygons.jsx";
import { VerticalSlider } from "./sliders.jsx";
import {
  useInterval,
  getData,
  forceSummation,
  buttonClick,
} from "../utilities.js";

function StrainGauge(props) {
  return (
    <div className="bg-slate-100 border-green-400 border-2 rounded-md m-2 p-2 font-normal text-lg min-w-24 hover:bg-blue-100">
      <p className="font-semibold">Gauge: {props.number}</p>
      <IndicatorDials
        strokeWidth="1rem"
        rotation={0}
        SVG_side={116}
        diameter={100}
        text={props.text}
      />
      <div className="flex flex-row-reverse">
        <Button
          message="zero"
          type="button"
          number={props.number}
          name="strainGauge"
          value="zero"
          onClick={buttonClick}
        />
      </div>
    </div>
  );
}

StrainGauge.propTypes = {
  number: PropTypes.number,
  text: PropTypes.string,
  testReady: PropTypes.bool,
};

export function StrainGaugeList(props) {
  var strainGaugeList = [];
  for (var i = 1; i <= props.strainGaugeNumber; i++) {
    strainGaugeList.push({ number: i });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {strainGaugeList.map((strainGauge) => {
        return (
          <StrainGauge
            key={strainGauge.number}
            number={strainGauge.number}
            text="0"
          />
        );
      })}
    </div>
  );
}

StrainGaugeList.propTypes = {
  strainGaugeNumber: PropTypes.number,
  testReady: PropTypes.bool,
};

export function StrainGaugePolygon(props) {
  const [forceData, setForceData] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  });

  useInterval(() => {
    if (props.testReady) {
      getData("/api/sensorMeasurements/getLatestPoint?parameter=force").then(
        (data) => {
          setForceData(() => {
            return data["measurements"];
          });
        }
      );
    }
  }, 500);

  return (
    <div>
      <div className="flex flex-row bg-slate-100 border-green-400 border-2 rounded-md m-2 hover:bg-blue-100">
        <Polygon sides={props.sides} measurements={forceData} />
        <div>
          <p className="font-semibold text-lg">Total force (N): </p>
          <div className="flex flex-row items-center">
            <VerticalSlider
              SVGHeight={300}
              SVGWidth={100}
              divisions={10}
              min={-10}
              max={10}
              value={forceSummation(forceData) || 0}
            />
            <p className="font-bold text-xl"> {forceSummation(forceData)} N</p>
          </div>
        </div>
      </div>

      <div className="flex flex-row-reverse font-normal text-xl">
        <Button
          message="zero"
          type="button"
          name="force"
          number={13}
          value="zero"
          onClick={buttonClick}
        />
      </div>
    </div>
  );
}

StrainGaugePolygon.propTypes = {
  sides: PropTypes.string,
  testReady: PropTypes.bool,
};
