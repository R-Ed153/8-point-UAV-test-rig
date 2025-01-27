const fs = require("fs");

const path = "../../measurementFiles";
const fileStructure = ["orientation", "acceleration", "force"];

function makeFileStructure(filePath, fileExtension) {
  try {
    fs.mkdirSync(`${path}/${filePath}`);
    for (var i = 0; i < fileStructure.length; i++) {
      var fileDescriptor = fs.openSync(
        `${path}/${filePath}/${fileStructure[i]}${fileExtension}`,
        "w");
      fs.close(fileDescriptor, (err) => {
        if (err) {
          return err;
        } else {
        }
      });
    }
    return "Files were successfully made";
  } catch (err) {
    console.log(`Error: ${err} occurred`);
  }
}

function ifNameExists(filePath) {
  if (fs.existsSync(`${path}/${filePath}`)) {
    return true;
  } else {
    return false;
  }
}

function componentToRechartFormat(schema) {
  var titleArray = [];
  titleArray = Object.keys(schema);

  //push all data to one array
  var dataArray = [];
  for (var i = 0; i < titleArray.length; i++) {
    dataArray.push(schema[`${titleArray[i]}`]);
  }
  //re-arrange data from format provided from micro-controller
  var dataTranspose = matrixTranspose(dataArray);

  var objectArray = [];
  for (var j = 1; j < dataTranspose.length; j++) {
    var componentArray = dataTranspose[j];
    var componentObject = {};
    for (var k = 0; k < componentArray.length; k++) {
      componentObject[titleArray[k]] = componentArray[k];
    }
    objectArray.push(componentObject);
  }

  return objectArray;
}

const matrixTranspose = (matrix) => {
  return matrix[0].map((col, c) => {
    return matrix.map((row, r) => {
      return matrix[r][c];
    });
  });
};

const writeDataToFile = (schema, fileName) => {
  var componentArray = Object.keys(schema);
  for (var i = 0; i < componentArray.length; i++) {
    var CSVString = componentToCSV(schema[`${componentArray[i]}`]);
    fs.writeFileSync(`${path}/${fileName}/${componentArray[i]}.csv`, CSVString);
  }
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

function deleteDirectories(fileName, fileExtension) {
  for (var i = 0; i < fileStructure.length; i++) {
    fs.unlinkSync(`${path}/${fileName}/${fileStructure[i]}${fileExtension}`);
  }
  fs.rmSync(`${path}/${fileName}`, { recursive: true, force: true });
}

//console.log(fs.openSync(path + "/orientation.csv","w"))
//console.log(fs.mkdirSync(path + "/Edmund/orientation"))
//console.log(makeFileStructure(fileStructure,"Edmund",".csv"));

//makeFileStructure("Edna", ".csv");
module.exports = {
  ifNameExists,
  makeFileStructure,
  componentToRechartFormat,
  writeDataToFile,
  deleteDirectories,
};
