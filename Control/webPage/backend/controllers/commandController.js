//var dotenv = require('dotenv').config()
const { ifNameExists, makeFileStructure } = require("./utilities");
const {
  increaseSaveData,
  startMeasurementTest,
  zeroMeasurementTest,
  changeRefTime,
  saveMeasurementData,
  discardMeasurementData,
  updateStrainGaugeNo
} = require("./measurementController");

var port = process.env.PORT || 5000;
var INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN;

var testInit = false;
var testName = "";
var strainGaugeNumber = 8;

const initData = (body) => {
  testName = body["testName"];
  strainGaugeNumber = body["strainGaugeNo"];
  updateStrainGaugeNo(strainGaugeNumber);
  if (ifNameExists(testName)) {
    return "File name already exists";
  } else {
    makeFileStructure(testName, ".csv");
    testInit = true;
    startMeasurementTest();
    return "File structure was successfully made";
  }
};

const startTest = (body) => {
  startMeasurementTest();
  return "Measurement recording started successfully";
};

const endData = (body) => {
  increaseSaveData(false);
};

const endTest = (body) => {
  increaseSaveData(false);
  testInit = false;
  return "Test has been ended successfully";
};

const pause = (body) => {
  increaseSaveData(false);
  changeRefTime();
};

const play = (body) => {
  increaseSaveData(true);
};

const zero = (body) => {
  zeroMeasurementTest(body.name);
  return `${body.name} zeroed successfully`;
};

const saveResults = (body) => {
  try {
    saveMeasurementData(testName);
    return "Measurements saved successfully";
  } catch {
    console.error(error);
  }
};

const deleteResults = (body) => {
  try {
    startMeasurementTest();
    discardMeasurementData(testName);
    return "Measurements discarded successfully";
  } catch(e) {
    console.error(e);
  }
};

var commandList = {
  initData: initData,
  startTest: startTest,
  endTest: endTest,
  pause: pause,
  play: play,
  zero: zero,
  saveResults: saveResults,
  deleteResults: deleteResults,
};
var commands = [];
const getCommands = (req, res) => {
  if (commands.length == 0) {
    res.status(200).json({ command: "No command was found" });
  } else {
    res.status(200).json({ command: commands });
    commands = [];
  }
};

const setCommands = (req, res) => {
  console.log(req.body);

  if (Object.keys(commandList).includes(req.body.value)) {
    try {
      var response = commandList[req.body.value](req.body);
      res.status(200).json({ message: response });
      console.log(response);
    } catch (err) {
      res
        .status(500)
        .json({ message: "An error in command execution occurred " + err });
      console.log("An error in executing the command occurred: " + err);
    }
  } else {
    res.status(500).json({ message: "Command was not found!" });
    console.log("Command was not found");
  }
  commands.push(req.body);
};

const testStarted = (req, res) => {
  try {
    if (testInit) {
      res.status(200).json({ message: "true" ,strainGaugeNumber: strainGaugeNumber});
    } else {
      res.status(200).json({ message: "false" });
    }
  } catch (err) {
    res.status(500).json({ message: `Error ${err} occurred` });
  }
};

const testEnded = (req, res) => {
  try {
    if (testInit) {
      res.status(200).json({ message: "true"});
    } else {
      res.status(200).json({ message: "false" });
    }
  } catch (err) {
    res.status(500).json({ message: `Error ${err} occurred` });
  }
};

module.exports = { getCommands, setCommands, testEnded, testStarted };
