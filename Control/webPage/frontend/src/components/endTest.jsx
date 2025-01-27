import { useState } from "react";
import PropTypes from "prop-types"
import { buttonClick } from "../utilities";
import { GraphPage } from "../pages/graphPage";

export function EndTest(props) {
  const [endTestState, setEndTestState] = useState(1);
  const endButtonClick = (event) => {
    console.log(event["target"]);
    if(event["target"]["value"] == "backTest"){
      props.handleSubmit(event);
    }

    else if(event["target"]["value"] == "endTest"){
      setEndTestState(()=>{
      var state = useState
      state = 2
      return state})
      buttonClick(event);
    }

    else if(event["target"]["value"] == "homePage"){
      console.log(event["target"]["value"])
      setEndTestState(()=>{
        var state = useState
        state = 2
        return state})
        console.log("done2")
      props.handleSubmit(event);
    }

  };

  var endTestMessage = () => {
    if (endTestState == 1) {
      return (
        <div className="absolute top-1/2 left-1/3 bg-blue-100 m-5 p-5 text-2xl w-96">
          <p>Are you sure you want to end the test?</p>
          <div className="flex flex-row-reverse ">
          <button
              name="endButton"
              value="endTest"
              id="02"
              className="bg-red-300 text-xl rounded-md m-2 p-2 hover:bg-red-400"
              onClick={endButtonClick}
            >
              End Test
            </button>
            <button
              name="endButton"
              value="backTest"
              className="bg-green-300 text-xl rounded-md m-2 px-2 py-1 hover:bg-green-400"
              onClick={endButtonClick}
            >
              Back to test
            </button>
           
          </div>
        </div>
      );
    } else if (endTestState == 2) {
      return (
       <GraphPage
        endTest={endButtonClick}/>
      );
    }
    
  };

  return <div className="">{
    endTestMessage()
  }</div>;
}

EndTest.propTypes = {
  handleSubmit: PropTypes.func
}
