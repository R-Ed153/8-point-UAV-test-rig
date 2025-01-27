import PropTypes from 'prop-types'

export function Button(props) {
  return (
    <div className="m-2 p-2 w-fit">
      <button
        type={props.type}
        name={props.name}
        id={props.number} 
        value={props.value}
        onClick = {props.onClick}
        className="border-green-400 bg-green-100 border-2 rounded-md p-2 hover:bg-green-200">
        {props.message}
      </button>
    </div>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  number: PropTypes.number,
  value: PropTypes.string,
  onClick: PropTypes.func,
  message: PropTypes.string,
}