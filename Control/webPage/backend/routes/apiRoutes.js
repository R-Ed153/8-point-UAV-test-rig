const express = require("express");
const router = express.Router();
const {
  getCommands,
  setCommands,
  testStarted,
  testEnded,
} = require("../controllers/commandController");
const {
  getLatestMeasurements,
  getGraphMeasurements,
  postMeasurements,
  forceMeasurements,

} = require("../controllers/measurementController");

//commands
router.get("/commands/getCommand", getCommands);
router.post("/commands/setCommand", setCommands);

router.get("/commands/testStarted", testStarted);
router.get("/commands/testEnded",testEnded)

//measurements
router.post("/sensorMeasurements", postMeasurements);
router.post("/sensorMeasurements/testForceMeasurements", forceMeasurements);
router.get("/sensorMeasurements/getGraphMeasurements", getGraphMeasurements);

router.get("/sensorMeasurements/getLatestPoint", getLatestMeasurements);

module.exports = router;
