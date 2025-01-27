import { useState } from "react";
import PropTypes from "prop-types";
import { validateInput } from "../utilities";

export function StartForm(props) {
  var [formState, setFormState] = useState({
    testName: "",
    strainGaugeNo: "8",
    errorState: false,
    errorMessage: "",
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    return setFormState((previousformData) => {
      if (name) {
        return {
          ...previousformData,
          [name]: type === "checkbox" ? checked : value,
        };
      }
    });
  }

  return (
    <div
      className="absolute left-1/4 top-1/3
     text-2xl w-96"
    >
      <form
        className="flex flex-col bg-blue-50 p-2"
        onSubmit={(event) => {
          let formData = {
            testName: formState.testName,
            strainGaugeNo: formState.strainGaugeNo,
          };
          event.preventDefault();

          let test = validateInput(formData.testName);
          if(props.ifFileExists){
            setFormState((previousformData) => {
              return {
                ...previousformData,
                errorState: true,
                errorMessage: "File exists, select another name",
              };
            });
            props.handleSubmit(formData);
          }
          else if (test.result) {
            setFormState((previousformData) => {
              return {
                ...previousformData,
                errorState: false,
                errorMessage: "",
              };
            });
            props.handleSubmit(formData);
          } else {
            setFormState((previousformData) => {
              return {
                ...previousformData,
                errorState: true,
                errorMessage: test.message,
              };
            });
          }
        }}
      >
        <div className="m-2 ">
          <p className="font-bold">Welcome to the test-rig</p>
          <div className="text-xl">
            <p className="mx-2 shrink-0 ">Name of Test:</p>
            <input
              type="text"
              name="testName"
              value={formState.testName}
              placeholder="Test Name"
              className="px-2 mx-2 w-30  bg-slate-100 rounded-md hover:brightness-90"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="m-2 text-xl">
          <p>Number of strain gauges</p>
          <div className="flex flex-row ">
            <div className="p-2">
              <input
                type="radio"
                id="eight"
                name="strainGaugeNo"
                value="8"
                onChange={handleChange}
                defaultChecked={true}
              />
              <label htmlFor="eight" className="p-1">
                Eight
              </label>
            </div>
            <div className="p-2">
              <input
                type="radio"
                id="six"
                name="strainGaugeNo"
                value="6"
                onChange={handleChange}
              />
              <label htmlFor="six" className="p-1">
                Six
              </label>
            </div>
            <div className="p-2">
              <input
                type="radio"
                id="four"
                name="strainGaugeNo"
                value="4"
                onChange={handleChange}
              />
              <label htmlFor="four" className="p-1">
                Four
              </label>
            </div>
          </div>
        </div>
        {formState.errorState && (
          <div className="bg-red-300 rounded-xl m-2">
            <p className="font-normal text-md p-2">{formState.errorMessage}</p>
          </div>
        )}
        <button type="submit" className="p-1 rounded-md hover:bg-slate-200">
          Submit
        </button>
      </form>
    </div>
  );
}

StartForm.propTypes = {
  handleSubmit: PropTypes.func,
  ifFileExists: PropTypes.bool,
};
