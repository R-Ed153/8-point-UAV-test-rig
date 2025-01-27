import PropTypes from 'prop-types'

function ErrorPage(props) {
  

  return (
    <div className="flex flex-col h-screen place-item-center justify-center">
      <div className="flex flex-col items-center justify-center border-4 bg-green-100 p-4 m-4 rounded-md">
        <h1 className="font-bold text-3xl">Ooops!</h1>
        <p className="font-semibold text-2xl p-4">
          {props.statusText || props.message} ({props.status}){" "}
        </p>
      </div>
    </div>
  );
}

ErrorPage.propTypes = {
  statusText: PropTypes.string,
  message: PropTypes.string,
  status: PropTypes.string
}

export { ErrorPage };