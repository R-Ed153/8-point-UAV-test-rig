const fs = require("fs");

const path = "../../measurementFiles";

const testSchema = {
  orientation: {
    yaw: [10, 50, 12],
    pitch: [20, 40, 16],
    roll: [30, 20, 24],
    time: [40, 10, 32],
  },
  acceleration: { xAxis: [0], yAxis: [0], zAxis: [0], time: [0] },
};

const componentToCSV = (schema) => {
  //collect all titles to one array
  var titleArray = Object.keys(schema);

  //push all data to one array
  var dataArray = [];
  for (var i = 0; i < titleArray.length; i++) {
    dataArray.push(schema[`${titleArray[i]}`]);
  }

  //re-arrange data from format provided from micro-controller
  var dataTranspose = matrixTranspose(dataArray);

  //combine the titles and data to one array
  var overallArray = [titleArray, ...dataTranspose];
  //convert array to CSV string
  var CSVString = overallArray.map((e) => e.join(",")).join("\n");
  return CSVString;
};

const matrixTranspose = (matrix) => {
  return matrix[0].map((col, c) => {
    return matrix.map((row, r) => {
      return matrix[r][c];
    });
  });
};



const writeDataToFile = (schema,fileName) => {
  var componentArray = Object.keys(schema);
  for(var i = 0; i < componentArray.length; i++){
    var CSVString = componentToCSV(schema[`${componentArray[i]}`]) 
    fs.writeFileSync(`${path}/${fileName}/${componentArray[i]}.csv`,CSVString);
  }
};



//console.log(componentToCSV(overallSchema["orientation"]));
//console.log(componentToRechartFormat(overallSchema["orientation"]));
//console.log(overallSchema["orientation"]["yaw"])
//writeDataToFile(overallSchema,"test");
//fs.open(`${path}/Edmund.csv`,()=>{return true});
//fs.openSync(`${path}/Edtq.csv`,'a')