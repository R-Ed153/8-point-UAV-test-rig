import PropTypes from 'prop-types'


export function IndicatorDials(props) { 
  return (
    <div className="flex flex-row justify-center items-center p-2">
      <svg width={props.SVG_side} height={props.SVG_side}>
        <g transform={`rotate(${(props.value)} ${props.SVG_side/2} ${props.SVG_side/2})`}>
          <circle
            r={props.diameter/2}
            cx={props.SVG_side/2}
            cy={props.SVG_side/2}
            fill="transparent"
            stroke="black"
            strokeWidth={props.strokeWidth}
            strokeDasharray={Math.PI * 2 * props.diameter/2}
            strokeDashoffset={0}
          ></circle>
          <circle
            r={props.diameter/2}
            cx={props.SVG_side/2}
            cy={props.SVG_side/2}
            fill="transparent"
            strokeLinecap="round"
            stroke="red"
            strokeWidth={props.strokeWidth}
            strokeDasharray={Math.PI* 2 * props.diameter/2}
            strokeDashoffset={
              Math.PI * 2 * props.diameter/2 * (50/ 100)
            }
          ></circle>
        </g>
        <text
          className="font-bold"
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
        >
          {props.text}
        </text>
      </svg>
    </div>
  );
}

IndicatorDials.propTypes = {
  strokeWidth : PropTypes.string,
  rotation : PropTypes.number,
  SVG_side: PropTypes.number,
  diameter: PropTypes.number,
  text: PropTypes.string,
  percent: PropTypes.number,
  value: PropTypes.number,
}


