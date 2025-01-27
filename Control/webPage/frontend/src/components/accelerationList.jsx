import { useInterval, getData, buttonClick } from "../utilities";
import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "./button";

export function AccelerationList(props) {
  const [accelerationData, setAccelerationData] = useState({
    xAxis: 0,
    yAxis: 0,
    zAxis: 0,
  });

  useInterval(() => {
    if (props.testReady) {
      getData("/api/sensorMeasurements/getLatestPoint?parameter=acceleration").then(
        (data) => {
          if (data == "An error was found") {
            console.log("DON DON DON");
          } else {
            setAccelerationData((prevAccelerationData) => {
              return {
                ...prevAccelerationData,
                xAxis: data["measurements"]["xAxis"],
                yAxis: data["measurements"]["yAxis"],
                zAxis: data["measurements"]["zAxis"],
              };
            });
          }
        },
        (e) => {
          console.log(e);
        }
      );
    }
  }, 500);

  AccelerationList.propTypes = {
    testReady: PropTypes.bool,
  };

  const accelerationList = [
    { name: "x-axis", value: accelerationData["xAxis"] },
    { name: "y-axis", value: accelerationData["yAxis"] },
    { name: "z-axis", value: accelerationData["zAxis"] },
  ].map((parameter) => {
    return (
      <div key={parameter.name} className="p-2 m-2 ">
        <p>
          {parameter.name}: {parameter.value}
        </p>
      </div>
    );
  });
  return (
    <div>
      <div className="font-semibold flex flex-row justify-around">
        {accelerationList}
      </div>
      <div className="flex flex-row-reverse font-normal text-xl">
        <Button
          message="zero"
          type="button"
          name="acceleration"
          number={12}
          value="zero"
          onClick={buttonClick}
        />
      </div>
    </div>
  );
}

AccelerationList.propTypes = {
  number: PropTypes.number,
};
