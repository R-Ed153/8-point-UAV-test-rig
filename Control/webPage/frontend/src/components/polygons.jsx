import PropTypes from "prop-types";

const rad = (1 * Math.PI) / 180;

export function Polygon(props) {
  var SVGSize = 400;
  var SVGRadius = (SVGSize - 100) / 2;
  var sides = props.sides == 4 ? 8 : props.sides;

  var lineCoordinates = [];
  var textCoordinates = [];
  var gaugeLocationCoordinates = [];

  var i = 0;
  if (sides % 4 == 0) {
    i = 180 / sides;
  }

  var angles = [];
  for (var m = 0; m < sides / 2; m++) {
    var rotationAngle = (m * 360) / sides - 360 / sides;
    if (m == sides / 2 - 1) angles.push(rotationAngle + 180);
    else angles.push(rotationAngle);
  }
  console.log(angles);

  var counterSides = 0;
  for (var counter = 0; counter < sides; counter++) {
    lineCoordinates.push(
      <line
        key={counter}
        x1={Coordinates(i, SVGSize, SVGRadius)["x"]}
        y1={Coordinates(i, SVGSize, SVGRadius)["y"]}
        x2={Coordinates(i + 360 / sides, SVGSize, SVGRadius)["x"]}
        y2={Coordinates(i + 360 / sides, SVGSize, SVGRadius)["y"]}
        stroke={props.sides == 4 && counter % 2 == 1 ? "red" : "black"}
        strokeLinecap="round"
        strokeWidth="10"
      />
    );
    if (props.measurements[counter] != undefined) {
      if (props.sides == 4) {
        textCoordinates.push(
          <text
            key={counter}
            x={
              Coordinates((2 * i)  + 360 / (props.sides), SVGSize + 15, SVGRadius + 15)[
                "x"
              ]
            }
            y={
              Coordinates((2 * i) + 360 / (props.sides), SVGSize + 15, SVGRadius + 15)[
                "y"
              ]
            }
            transform={`rotate(${angles[2 * (((counter + 1) % 2) )]},${Coordinates((2 * i) + 360 / (props.sides), SVGSize, SVGRadius + 15)["x"]},${Coordinates((2 * i) + 360 / (props.sides), SVGSize, SVGRadius)["y"]})`}
            textAnchor="middle"
            className="hover:text-blue-500"
          >
            {`G${(counterSides % 4) + 1}: ${props.measurements[counterSides % 4]}`}
          </text>
        );
        counterSides = counterSides + 1;
      } else {
        textCoordinates.push(
          <text
            key={counter}
            x={
              Coordinates(i + 360 / (2 * sides), SVGSize + 15, SVGRadius + 15)[
                "x"
              ]
            }
            y={
              Coordinates(i + 360 / (2 * sides), SVGSize + 15, SVGRadius + 15)[
                "y"
              ]
            }
            transform={`rotate(${angles[counter % (sides / 2)]},${Coordinates(i + 360 / (2 * sides), SVGSize, SVGRadius + 15)["x"]},${Coordinates(i + 360 / (2 * sides), SVGSize, SVGRadius)["y"]})`}
            textAnchor="middle"
            className="hover:text-blue-500"
          >
            {`G${counter + 1}: ${props.measurements[counter]}`}
          </text>
        );
      } 
    }
    gaugeLocationCoordinates.push(
      <line
        key={counter}
        x1={
          (Coordinates(i + 360 / sides, SVGSize, SVGRadius)["x"] +
            Coordinates(i, SVGSize, SVGRadius)["x"]) /
            2 -
          (Coordinates(i + 360 / sides, SVGSize, SVGRadius)["x"] -
            Coordinates(i, SVGSize, SVGRadius)["x"]) /
            20
        }
        y1={
          (Coordinates(i + 360 / sides, SVGSize, SVGRadius)["y"] +
            Coordinates(i, SVGSize, SVGRadius)["y"]) /
            2 -
          (Coordinates(i + 360 / sides, SVGSize, SVGRadius)["y"] -
            Coordinates(i, SVGSize, SVGRadius)["y"]) /
            20
        }
        x2={
          (Coordinates(i + 360 / sides, SVGSize, SVGRadius)["x"] +
            Coordinates(i, SVGSize, SVGRadius)["x"]) /
            2 +
          (Coordinates(i + 360 / sides, SVGSize, SVGRadius)["x"] -
            Coordinates(i, SVGSize, SVGRadius)["x"]) /
            20
        }
        y2={
          (Coordinates(i + 360 / sides, SVGSize, SVGRadius)["y"] +
            Coordinates(i, SVGSize, SVGRadius)["y"]) /
            2 +
          (Coordinates(i + 360 / sides, SVGSize, SVGRadius)["y"] -
            Coordinates(i, SVGSize, SVGRadius)["y"]) /
            20
        }
        stroke={props.sides == 4 && counter % 2 == 1 ? "red" : "blue"}
        strokeLinecap="round"
        strokeWidth="10"
        fill="red"
      />
    );
    i = i + 360 / sides;
    
  }
  return (
    <svg
      height={SVGSize}
      width={SVGSize}
      transform={`rotate(${props.sides == 4 ? -360/sides : 360 / sides},${0},${0})`}
    >
      {lineCoordinates}
      {textCoordinates}
      {gaugeLocationCoordinates}
    </svg>
  );
}

Polygon.propTypes = {
  sides: PropTypes.string,
  measurements: PropTypes.object,
};

function Coordinates(angle, SVGSize, SVGRadius) {
  return {
    x: Math.round(SVGSize / 2 + SVGRadius * Math.cos(angle * rad)),
    y: Math.round(SVGSize / 2 + SVGRadius * Math.sin(angle * rad)),
  };
}
