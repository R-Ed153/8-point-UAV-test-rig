import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { buttonClick, getData } from "../utilities";

export function GraphPage(props) {
  var [GraphPageState, setGraphPageState] = useState({
    orientation: "yaw",
    acceleration: "xAxis",
    pageActive: true,
    messageStatus: 0,
  });

  var [graphData, setGraphData] = useState({
    acceleration: [],
    orientation: [],
  });
  useEffect(() => {
    getData("/api/sensorMeasurements/getGraphMeasurements").then((data) => {
      //console.log(data["graphMeasurements"]["force"]);
      //var forceArray = data["graphMeasurements"]["force"]
      //for(var i = 0;i < forceArray.length; i++){
        //forceArray[i]["totalForce"] = forceSummation(forceArray[i])
      //}
     // var totalForce = forceSummation(data["graphMeasurements"]["force"])
      console.log(data["graphMeasurements"]["acceleration"])
      setGraphData(() => {
        return {
          acceleration: data["graphMeasurements"]["acceleration"],
          orientation: data["graphMeasurements"]["orientation"],
          force: data["graphMeasurements"]["force"]
        };
      });
    });
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    return setGraphPageState((previousGraphPageState) => {
      if (name) {
        return {
          ...previousGraphPageState,
          [name]: type === "checkbox" ? checked : value,
        };
      }
    });
  }

  const handleButtonClick = (event) => {
    if (
      event["target"]["value"] == "saveResults" ||
      event["target"]["value"] == "deleteResults"
    ) {
      buttonClick(event);
      return setGraphPageState((previousGraphPageState) => {
        return {
          ...previousGraphPageState,
          pageActive: false,
          messageStatus: 1,
        };
      });
    } else if (event["target"]["value"] == "discardResults") {
      return setGraphPageState((previousGraphPageState) => {
        return {
          ...previousGraphPageState,
          pageActive: false,
          messageStatus: 2,
        };
      });
    } else if (event["target"]["value"] == "backResults") {
      return setGraphPageState((previousGraphPageState) => {
        return {
          ...previousGraphPageState,
          pageActive: true,
          messageStatus: 0,
        };
      });
    }
  };
  const endButtonClick = (event) => {
    props.endTest(event);
  };

  var resultsMessage = () => {
    console.log(GraphPageState);
    if (!GraphPageState["pageActive"] && GraphPageState["messageStatus"] == 1) {
      return (
        <div className="z-20">
          <p>Thank you for using the UAV test rig.</p>
          <div className="flex flex-row justify-center text-xl ">
            <button
              name="endButton"
              value="homePage"
              className=" rounded-md m-2 p-2 hover:font-bold"
              onClick={endButtonClick}
            >
              Back to the initalization page
            </button>
          </div>
        </div>
      );
    } else if (
      !GraphPageState["pageActive"] &&
      GraphPageState["messageStatus"] == 2
    ) {
      return (
        <div>
          <p>Are you sure you want to discard everything.</p>
          <div className="flex flex-row justify-center text-xl ">
            <div className="m-2 p-2 w-fit">
              <button
                type={"button"}
                name={"backResults"}
                id={""}
                value={"backResults"}
                onClick={handleButtonClick}
                className="border-green-400 bg-green-100 border-2 rounded-md p-2 hover:bg-green-200"
              >
                Back to results
              </button>
            </div>
            <div className="m-2 p-2 w-fit">
              <button
                type={"button"}
                name={"deleteResults"}
                id={""}
                value={"deleteResults"}
                onClick={handleButtonClick}
                className="border-red-400 bg-red-100 border-2 rounded-md p-2 hover:bg-red-200"
              >
                Discard results
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`font-semibold bg-slate-100`}>
      <div
        className={`${GraphPageState["pageActive"] ? "blur:none" : "blur-sm"} z-10`}
      >
        <div className={`p-4 bg-slate-100 hover:bg-blue-100 `}>
          <p className="font-bold text-xl">Results summary:</p>
          <p>Orientation (&deg;)</p>
          <div className="flex flex-row space-x-28">
            <div>
              <input
                type="radio"
                id="yaw"
                name="orientation"
                value="yaw"
                onChange={handleChange}
                defaultChecked={true}
              />
              <label htmlFor="yaw" className="p-1">
                Yaw
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="roll"
                name="orientation"
                value="roll"
                onChange={handleChange}
              />
              <label htmlFor="roll" className="p-1">
                Roll
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="pitch"
                name="orientation"
                value="pitch"
                onChange={handleChange}
              />
              <label htmlFor="pitch" className="p-1">
                Pitch
              </label>
            </div>
          </div>
          <LineGraph
            XAxis="time"
            YAxis={GraphPageState["orientation"]}
            data={graphData["orientation"]}
          />
        </div>
        <div className="p-4 bg-slate-100 hover:bg-blue-100 rounded-md">
          <p>Acceleration (m/s)</p>
          <div className="flex flex-row space-x-28">
            <div>
              <input
                type="radio"
                id="xAxis"
                name="acceleration"
                value="xAxis"
                onChange={handleChange}
                defaultChecked={true}
              />
              <label htmlFor="X-axis" className="p-1">
                X-axis
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="yAxis"
                name="acceleration"
                value="yAxis"
                onChange={handleChange}
              />
              <label htmlFor="Y-axis" className="p-1">
                Y-axis
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="zAxis"
                name="acceleration"
                value="zAxis"
                onChange={handleChange}
              />
              <label htmlFor="Z-axis" className="p-1">
                Z-axis
              </label>
            </div>
          </div>
          <LineGraph
            XAxis="time"
            YAxis={GraphPageState["acceleration"]}
            data={graphData["acceleration"]}
          />
        </div>
        <div className="p-4 bg-slate-100 hover:bg-blue-100">
          <p>Total Force (N)</p>
          <LineGraph
            XAxis="time"
            YAxis={"totalForce"}
            data={graphData["force"]}
          />
        </div>
        <div className="flex flex-row-reverse">
          <div className="m-2 p-2 w-fit">
            <button
              type={"button"}
              name={"saveResults"}
              id={""}
              value={"saveResults"}
              onClick={handleButtonClick}
              className="border-green-400 bg-green-100 border-2 rounded-md p-2 hover:bg-green-200"
            >
              Save results
            </button>
          </div>
          <div className="m-2 p-2 w-fit">
            <button
              type={"button"}
              name={"discardResults"}
              id={""}
              value={"discardResults"}
              onClick={handleButtonClick}
              className="border-red-400 bg-red-100 border-2 rounded-md p-2 hover:bg-red-200"
            >
              Discard results
            </button>
          </div>
        </div>
      </div>
      {resultsMessage()}
    </div>
  );
}

GraphPage.propTypes = {
  endTest: PropTypes.func,
};

export function LineGraph(props) {
  return (
    <ResponsiveContainer width={"80%"} height={300}>
      <LineChart
        data={props.data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <XAxis
          dataKey="time"
          type="number"
          tick={true}
          tickCount={"auto"}
          scale={"time"}
          interval={"equidistantPreserveStart"}
          domain={["dataMin", "dataMax"]}
        >
          <Label
            value={"time (ms)"}
            position={"bottom"}
            style={{ textAnchor: "middle" }}
          />
        </XAxis>
        <YAxis dataKey={props.YAxis} domain={["dataMin","dataMax"]}>
          <Label
            value={props.YAxis}
            position={"left"}
            angle={-90}
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip />
        <CartesianGrid/>
        
        <Line type="monotone" dataKey={props.YAxis} stroke={"#8884d8"} dot={true} />
      </LineChart>
    </ResponsiveContainer>
  );
}

LineGraph.propTypes = {
  XAxis: PropTypes.string,
  YAxis: PropTypes.string,
  data: PropTypes.array,
};
