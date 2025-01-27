import PropTypes from "prop-types";
import { useState } from "react";
import { IndicatorDials } from "./indicatorDials";
import { Button } from "./button";

import { buttonClick } from "../utilities";
import { useInterval } from "../utilities";
import { getData } from "../utilities";
import { HorizontalSlider, VerticalSlider } from "./sliders";



export function OrientationList(props) {
  const [orientationData, setOrientationData] = useState({
    yaw: 0,
    pitch: 0,
    roll: 0,
  });
  useInterval(() => {
    if (props.testReady) {
      getData("/api/sensorMeasurements/getLatestPoint?parameter=orientation").then((data) => {
        setOrientationData((prevOrientationData) => {
          return {
            ...prevOrientationData,
            yaw: data["measurements"]["yaw"],
            pitch: data["measurements"]["pitch"],
            roll: data["measurements"]["roll"],
          };
        });
      });
    }
  }, 500);
 
  return (
    <div>
      <div className="flex flex-row ">
        <div>
          <div className="">
            <div className="bg-slate-100 border-green-400 border-2 rounded-md m-2 p-2 font-semibold text-lg min-w-24 hover:bg-blue-100">
              <p className="">Roll:</p>
              <div>
                <IndicatorDials
                  strokeWidth="0.5rem"
                  SVG_side={92}
                  diameter={80}
                  text={orientationData["roll"] + "\u00b0"}
                  value={-orientationData["roll"] }
                />
              </div>
            </div>
          </div>
          <div className="bg-slate-100 border-green-400 border-2 rounded-md m-2 p-2 text-lg min-w-24 hover:bg-blue-100 font-semibold">
            <p>Yaw:</p>
            <div className="flex flex-col m-2 p-2 items-center">
              <HorizontalSlider
                SVGHeight={100}
                SVGWidth={300}
                divisions={5}
                min={-10}
                max={10}
                value={orientationData["yaw"]}
              />
              <p className="font-bold">{orientationData["yaw"]}&deg;</p>
            </div>
          </div>
        </div>
        <div className=" bg-slate-100 border-green-400 border-2 rounded-md m-2 p-2 text-lg min-w-24 hover:bg-blue-100 font-semibold">
          <p>Pitch:</p>
          <div className="flex flex-row m-2 p-2 items-center">
            <VerticalSlider
              SVGHeight={200}
              SVGWidth={100}
              divisions={5}
              min={-10}
              max={10}
              value={orientationData["pitch"]}
            />
            <p className="font-bold text-xl">{orientationData["pitch"]}&deg;</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse font-normal text-xl">
        <Button
          message="zero"
          type="button"
          name="orientation"
          number={11}
          value="zero"
          onClick={buttonClick}
        />
      </div>
    </div>
  );
}

OrientationList.propTypes = {
  testReady: PropTypes.bool,
};
