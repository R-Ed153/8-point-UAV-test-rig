import {  useEffect, useRef } from "react";


export function buttonClick(event) {
  console.log(event);
  var command = JSON.stringify({
    name: event.target.name,
    id: event.target.id,
    value: event.target.value,
  });
  fetch("/api/commands/setCommand", {
    method: "POST",
    body: command,
    headers: { "Content-type": "application/json" },
  })
    .then((res) => {
      if (res.status != 200) {
        alert("Command was unsuccessful");
      } else {
        return res.json();
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));
}

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay != null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export async function getData(link){
 try{
  const response = await fetch(link,{
    method: "GET",
    headers: {"accept": "application/json"},
  })
  const 
  data = await response.json();
  return data}
catch(error){
  throw new Error(500,{cause: "Server error"})
}
}

export function validateInput(input){
  let val = input.trim().replaceAll(' ','');
  let result = {
    "result": false
  }

  let RegEx1 = /^[\w\d-_]+$/i; //Ensure only letters,numbers, - and _ are used
  let RegEx2 = /^[^-_]/;  //Ensure name starts with letters or numbers
  let RegEx3 = /[^-_]$/;

  if(!val){
    result["message"] = "Enter the test name"
  }
  else if(RegEx1.test(val) && RegEx2.test(val) && RegEx3.test(val)){
    result["result"] = true
  }
  else if(!RegEx1.test(val)){
    result["message"] = "Test names should only include letters, digits, hyphens and underscores "
  }
  else if(!RegEx2.test(val) || !RegEx3.test(val))
  {
    result["message"] = "Test names must start and end with letters or digits"
  }
  
  return result
}






export function forceSummation(forceData){
  let summation = 0;
  let forceValues = Object.values(forceData);
  summation = forceValues.reduce((partialSum,a)=>partialSum + a,0)
  return Math.round(summation);
}






//let time = new Date("2024-12-01 10:52:08:500").getTime()
//console.log(new Date(time).getMilliseconds());
