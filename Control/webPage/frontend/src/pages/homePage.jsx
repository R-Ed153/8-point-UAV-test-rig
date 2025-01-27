import { useState } from "react";

//import { StrainGaugeList } from "../components/strainGaugeList";
import { OrientationList } from "../components/orientationList";
import { AccelerationList } from "../components/accelerationList";

import { StartForm } from "../components/startForm";
import { EndTest } from "../components/endTest";

import { Button } from "../components/button";
import { StrainGaugePolygon } from "../components/strainGaugeList";

import { buttonClick } from "../utilities";

export function HomePage() {
  var [homePageState, setHomePageState] = useState({
    initDone: false,
    testActive: false,

    testStart: false,
    testPlay: true,

    strainGaugeNumber: "",
    ifFileExists: false,
  });

  const startButton = () => {
    if (homePageState["testStart"]) {
      return (
        <Button
          type="button"
          name="testState"
          id="1"
          value="end"
          onClick={startButtonClick}
          message="End test"
        />
      );
    } else {
      return (
        <Button
          message="Start test"
          type="button"
          name="testState"
          number={0x01}
          value="startTest"
          onClick={startButtonClick}
        />
      );
    }
  };

  const pauseButton = () => {
    if (homePageState["testPlay"]) {
      return (
        <Button
          type="button"
          name="testState"
          id="1"
          value="pause"
          onClick={playButtonClick}
          message="Pause"
        />
      );
    } else {
      return (
        <Button
          type="button"
          name="testState"
          id="1"
          value="play"
          onClick={playButtonClick}
          message="Play"
        />
      );
    }
  };

  const startButtonClick = (event) => {
    if (!homePageState["testStart"]) {
      buttonClick(event);
      console.log(event["name"]);
      setHomePageState((prevHomePageState) => {
        return {
          ...prevHomePageState,
          testStart: true,
          testPlay: true,
        };
      });
    } else if (homePageState["testStart"] && homePageState["initDone"]) {
      setHomePageState((prevHomePageState) => {
        return {
          ...prevHomePageState,
          testStart: false,
          testActive: false,
          testPlay: false,
        };
      });
    }
  };

  const playButtonClick = (event) => {
    console.log(event.value)
    var command = JSON.stringify({
      name: "pausePlay",
      id: "00",
      value: `${homePageState["testPlay"]?"pause":"play"}`,
    });
    fetch("/api/commands/setCommand", {
      method: "POST",
      body: command,
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        if (response.status != 200) {
          ("Data was not sent");
        } else {
         return response.json()
        }
      })
    if (homePageState["testStart"]) {
      setHomePageState((prevHomePageState) => {
        return {
          ...prevHomePageState,
          testPlay: !prevHomePageState["testPlay"],
        };
      });
    }
  };

  function startSubmit(formData) {
    var command = JSON.stringify({
      ...formData,
      name: "initData",
      id: "00",
      value: "initData",
    });
    fetch("/api/commands/setCommand", {
      method: "POST",
      body: command,
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        if (response.status != 200) {
          ("Data was not sent");
        } else {
         return response.json()
        }
      }).then((result)=>{
        console.log(result.message);
        if(result.message == "File name already exists"){
          setHomePageState((prevHomePageState) => {
            return {
              ...prevHomePageState,
              ifFileExists: true
            };
          }
        )}
        else{
        setHomePageState((prevHomePageState) => {
          return {
            ...prevHomePageState,
            initDone: true,
            testActive: true,
            strainGaugeNumber: formData.strainGaugeNo,
            ifFileExists: false
          }
        }
      )}}
    )        
      .catch((error) => console.error(error));
  }

  function endSubmit(event) {
    console.log(event["target"]["value"]);
    if (event["target"]["value"] == "backTest") {
      return setHomePageState((prevHomePageState) => {
        return {
          ...prevHomePageState,
          testActive: true,
          testStart: true,
          testPlay: true,
        };
      });
    } else if (event["target"]["value"] == "endTest") {
      return setHomePageState((prevHomePageState) => {
        return {
          ...prevHomePageState,
          initDone: false,
          testActive: false,
        };
      });
    } else if (event["target"]["value"] == "homePage") {
      return setHomePageState((prevHomePageState) => {
        return {
          ...prevHomePageState,
          initDone: false,
          testActive: false,
        };
      });
    }
  }

  const startOrEndForm = () => {
    if (!homePageState["testActive"])
      if (homePageState["initDone"]) {
        return <EndTest handleSubmit={endSubmit} />;
      } else {
        return <StartForm handleSubmit={startSubmit} ifFileExists = {homePageState["ifFileExists"]}/>;
      }
  };

  return (
    <div className={"flex flex-col p-4 max-w-2xl grow"}>
      <div className="z-10">{startOrEndForm()}</div>

      <div
        className={`${!homePageState["testActive"] ? "opacity-40 blur-md" : "blur-none"}`}
      >
        <div className={"flex flex-row font-bold text-3xl justify-between"}>
          <p className="">UAV Test-Bed</p>
          <p className="font-semibold px-2 text-2xl">
            Time {timeNow()["hours"]}:{timeNow()["minutes"]}
            {timeNow()["timeOfDay"]}
          </p>
        </div>
        <div className={"text-2xl font-bold"}>
          <p className="">Orientation (&deg;) </p>
          <OrientationList
            testReady={homePageState["testPlay"] && homePageState["testActive"]}
          />
        </div>
        <div className={"text-2xl font-bold"}>
          <p>Acceleration (rad/s)</p>
          <AccelerationList
            testReady={ homePageState["testPlay"] && homePageState["testActive"] }
          />
        </div>
        <div className="text-2xl font-bold">
          <p>Force (N)</p>
          <div className="flex flex-col">
            <StrainGaugePolygon
              sides={homePageState["strainGaugeNumber"]}
              testReady={
                homePageState["testPlay"] && homePageState["testActive"]
              }
            />
          </div>
        </div>
        <div className="flex flex-row-reverse">
          {startButton()}
          {pauseButton()}
        </div>
      </div>
    </div>
  );
}

const timeNow = () => {
  var now = new Date();
  var timeFormat = { timeOfDay: "am" };
  var hours = now.getHours();
  var minutes = now.getMinutes();

  if (hours > 12) {
    timeFormat["timeOfDay"] = "pm";
    hours = hours - 12;
  } else if (hours == 12) {
    timeFormat["timeOfDay"] = timeFormat["timeOfDay"] == "am" ? "pm" : "am";
  } else {
    timeFormat["timeOfDay"] = "am";
  }
  timeFormat["hours"] = hours;

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  timeFormat["minutes"] = minutes;
  return timeFormat;
};
