//modules
//const { dataFormatting, writeToDB } = require("../influxDB2.js");
const {
  componentToRechartFormat,
  writeDataToFile,
  deleteDirectories,
} = require("./utilities.js");

const refMeasurements = { orientation: {}, acceleration: {}, force: {} };
const refTime = { orientation: 0, acceleration: 0, force: 0 };
const refValues = { refMeasurements: refMeasurements, refTime: refTime };

const orientation = { yaw: [0], pitch: [0], roll: [0], time: [0] };
const acceleration = { xAxis: [0], yAxis: [0], zAxis: [0], time: [0] };
var force = { time: [0], totalForce: [0] };

var saveData = true;
var strainGaugeNo = 8;

const updateStrainGaugeNo = (strainGaugeNumber) => {
  for (var i = 1; i <= strainGaugeNumber; i++) {
    force[`gauge${i}`] = [0,];
  }
  strainGaugeNo = strainGaugeNumber;
  console.log(force)
};

const overallSchema = {
  orientation: orientation,
  acceleration: acceleration,
  force: force,
};
//console.log(overallSchema)

const increaseSaveData = (state) => {
  saveData = state;
};

//change to overallSchema
var saveMeasurementData = (testName) => {
  try {
    writeDataToFile(overallSchema, testName);
    return "Files successfully saved";
  } catch {
    console.error(e);
  }
};

var discardMeasurementData = (testName) => {
  deleteDirectories(testName, ".csv");
};

//startButton
const startMeasurementTest = () => {
  //remove all measurements
  Object.keys(overallSchema).forEach((parameter) => {
    var componentStructure = overallSchema[parameter];
    Object.keys(componentStructure).forEach((component) => {
      overallSchema[parameter][component] = [0];
      refValues["refMeasurements"][parameter][component] = 0;
    });
  });
  //remove all ref times
  Object.keys(refTime).forEach((parameter) => {
    refValues["refTime"][parameter] = 0;
  });
  //remove all ref values
};

const zeroMeasurementTest = (parameter) => {
  Object.keys(overallSchema[parameter]).forEach((component) => {
    var parameterArray = overallSchema[parameter][component];
    refMeasurements[parameter][component] =
      parameterArray[parameterArray.length - 1];
  });
};

//pauseButton
const changeRefTime = () => {
  Object.keys(overallSchema).forEach((parameter) => {
    var timeArray = overallSchema[parameter]["time"];
    refValues["refTime"][parameter] =
      timeArray[timeArray.length - 1] + refTime[parameter];
  });
};

//update array holding measurements
const postMeasurements = (req, res) => {
  var measurementStructure = req.body;
  console.log(measurementStructure);
  if (saveData) {
    Object.keys(measurementStructure).forEach((parameter) => {
      if (parameter != "force") {
        measurementStructure[parameter]["time"] =
          (measurementStructure[parameter]["time"] -
          refValues["refTime"][parameter])/1000;
        var componentStructure = measurementStructure[parameter];
        //console.log(refValues);
        Object.keys(componentStructure).forEach((component) => {
          if (component != "time") {
            measurementStructure[parameter][component] =
              measurementStructure[parameter][component] -
              (refValues["refMeasurements"][parameter][component] || 0);
          }
          overallSchema[parameter][component].push(
            Math.floor(
              (measurementStructure[parameter][component] * 10000) / 100
            ) / 100
          );
        });
      } else {
        var forceArray = measurementStructure["force"];
        forceArray[forceArray.length - 2] = forceArray[forceArray.length - 2] - refValues["refTime"][parameter];
        for(var i = 0; i < forceArray.length - 2; i++){
          force[`gauge${i+1}`].push(Math.floor((forceArray[i]*10000)/1000)/100);
        }
        force["time"].push((forceArray[forceArray.length - 2])/1000);
        force["totalForce"].push(Math.floor((forceArray[forceArray.length - 1]*10000)/1000)/100)  
      }
    });
    
  }
  console.log(overallSchema);
  res.status(200).json({ message: "Measurements recieved" });
  // console.log(force["time"]);
};

//format graph data
const getGraphMeasurements = (req, res) => {
  graphObject = {};
  var overallSchemaKeys = Object.keys(overallSchema);
  for (var i = 0; i < overallSchemaKeys.length; i++) {
    graphObject[overallSchemaKeys[i]] = componentToRechartFormat(
      overallSchema[overallSchemaKeys[i]]
    );
  
  }
  console.log(graphObject);
  res.status(200).json({
    graphMeasurements: graphObject,
  });
  
};

//update UI
const getLatestMeasurements = (req, res) => {
  var queryString = req.query;
  var parameter = queryString["parameter"];
  res.status(200).json({
    parameter: queryString.parameter,
    measurements: getLatestMeasurement(parameter),
  });
};

const getLatestMeasurement = (parameter) => {
  if (parameter == "orientation") {
    var yaw = overallSchema[parameter]["yaw"];
    var pitch = overallSchema[parameter]["pitch"];
    var roll = overallSchema[parameter]["roll"];

    return {
      yaw: yaw[yaw.length - 1] || 0,
      pitch: pitch[pitch.length - 1] || 0,
      roll: roll[roll.length - 1] || 0,
    };
  } else if (parameter == "acceleration") {
    var xAxis = overallSchema[parameter]["xAxis"];
    var yAxis = overallSchema[parameter]["yAxis"];
    var zAxis = overallSchema[parameter]["zAxis"];

    return {
      xAxis: xAxis[xAxis.length - 1] || 0,
      yAxis: yAxis[yAxis.length - 1] || 0,
      zAxis: zAxis[zAxis.length - 1] || 0,
    };
  } else if (parameter == "force") {
    var forceObject = {};
    for (var i = 0; i < strainGaugeNo; i++) {
      var forceArray = overallSchema["force"][`gauge${i+1}`]
      forceObject[i] = forceArray[forceArray.length - 1];
      console.log(forceArray);
    } 
    return forceObject;
  }
};

const forceMeasurements = (req, res) => {
  var measurementStructure = req.body;
  console.log(measurementStructure);
  res.status(200).json({ message: "Measurements recieved" });
};

module.exports = {
  getLatestMeasurements,
  getGraphMeasurements,
  postMeasurements,
  increaseSaveData,
  startMeasurementTest,
  zeroMeasurementTest,
  changeRefTime,
  saveMeasurementData,
  discardMeasurementData,
  forceMeasurements,
  updateStrainGaugeNo,
};

/*const testSchema = {
  orientation: {
    yaw: [10, 50, 12, 15, 12, 45],
    pitch: [20, 40, 16, 4, 7, 47],
    roll: [30, 20, 24, 21, 20, 45],
    time: [10, 15, 32, 40, 50, 60],
  },
  acceleration: { xAxis: [0], yAxis: [0], zAxis: [0], time: [0] },
  force: {
    gauge1: [-10, 20, 50, 40, 4, 40],
    gauge2: [-45, 87, 89, 45, 4],
    gauge3: [-40, 52, 44, 78, 95],
    time: [1, 5, 6, 78, 90, 100],
  },
};*/
