import PropTypes from "prop-types";


export function HorizontalSlider(props) {
  
  if(props.value > props.max){
    var value = props.max
  }
  else if(props.value < props.min ){
    value = props.min
  }
  else{
    value = props.value
  }
  var textCoordinates = [];
  for (var i = 0; i <= props.divisions; i++) {
    textCoordinates.push(
      <text
        x={10 + divisionRange(props.SVGWidth - 20, props.divisions, i)}
        y={60}
        key={i}
        className="text-sm font-semibold"
        textAnchor="middle"

        transform={`rotate(0,${20 + divisionRange(props.SVGWidth - 30, 6, i)},${30})`}
      >
        {divisionContent(props.min, props.max, props.divisions, i)}
      </text>
    );
  }
  return (
    <div className="flex flex-row justify-center">
      <svg height={props.SVGHeight} width={props.SVGWidth}>
        <rect
          width={props.SVGWidth - 10}
          height={20}
          rx={10}
          x={5}
          y={props.SVGHeight/2 - 20}
          fill="grey"
        ></rect>
        <rect
          width={10}
          height={20}
          rx={10}
          x={5 + (Math.round(((value + (props.max - props.min)/2)/((props.max - props.min))) * (props.SVGWidth - 20)))}
          y={props.SVGHeight/2 - 20}
          fill="red"
        ></rect>
        {textCoordinates}
      </svg>
    </div>
  );
}

HorizontalSlider.propTypes = {
  SVGHeight: PropTypes.number,
  SVGWidth: PropTypes.number,
  divisions: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number
};


export function VerticalSlider(props) {
  
  var textCoordinates = [];
  if(props.value > props.max){
    var value = props.max
  }
  else if(props.value < props.min ){
    value = props.min
  }
  else{
    value = props.value
  }
  for (var i = 0; i <= props.divisions; i++) {
    textCoordinates.push(
      <text
        x={50}
        y={10 + divisionRange(props.SVGHeight - 20, props.divisions, i)}
        className="text-sm font-semibold"
        textAnchor="start"
        key={i}
      >
        {divisionContent(props.min, props.max, props.divisions, i)}
      </text>
    );
  }
 
  return (
    <div className="flex flex-row justify-center">
      <svg width={props.SVGWidth} height={props.SVGHeight}>
        <rect
          height={props.SVGHeight - 10}
          width={30}
          rx={10}
          ry={10}
          x={props.SVGWidth/2 -30}
          y={0}
          fill="grey"
        ></rect>
        <rect
          height={10}
          width={30}
          rx={10}
          ry={10}
          x={props.SVGWidth/2 -30}
          y={Math.round(((value + (props.max - props.min)/2)/((props.max - props.min))) * (props.SVGHeight-20))}
          fill="red"
        ></rect>
        {textCoordinates}
      </svg>
    </div>
  );
}

VerticalSlider.propTypes = {
  divisions: PropTypes.number,
  SVGHeight: PropTypes.number,
  SVGWidth: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number
};

function divisionRange(SVGHeight, divisions, interval) {
  var gap = Math.round(SVGHeight / divisions);
  return gap * interval;
}

function divisionContent(min, max, divisions, interval) {
  var gap = Math.round((max - min) / divisions);
  return min + gap * interval;
}


