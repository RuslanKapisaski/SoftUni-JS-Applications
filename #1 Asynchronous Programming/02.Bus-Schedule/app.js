function solve() {
  let infoSpan = document.querySelector("#info .info");
  let departBtn = document.getElementById("depart");
  let arriveBtn = document.getElementById("arrive");
  let isFirstQuerry = true;
  let stationName = "";

  const baseURL = `http://localhost:3030/jsonstore/bus/schedule/`;
  let depUrl = baseURL;
  let arrUrl = baseURL;

  function buttonHandler(btn, action) {
    btn.disabled = action;
  }
  function depart() {
    fetch(depUrl)
      .then((response) => response.json())
      .then((data) => {
        infoSpan.textContent = `Next stop ${loadRepo(data)}`;
      })
      .catch((error) => {
        infoSpan.textContent = "Error";
        buttonHandler(departBtn, true);
        buttonHandler(arriveBtn, true);
      });

    function loadRepo(data) {
      let elements = Object.entries(data);
      if (isFirstQuerry) {
        let [id, nextobj] = elements.pop();
        stationName = nextobj.name;
        nextStation = nextobj.next;
        depUrl = baseURL + id;
        arrUrl = depUrl;
        isFirstQuerry = false;
        buttonHandler(departBtn, true);
        buttonHandler(arriveBtn, false);
        return stationName;
      } else {
        depUrl = baseURL + data.next;
        buttonHandler(departBtn, true);
        buttonHandler(arriveBtn, false);
        console.log(data.name);

        return data.name;
      }
    }
  }

  function arrive() {
    buttonHandler(arriveBtn, false);

    fetch(arrUrl)
      .then((response) => response.json())
      .then((data) => {
        infoSpan.textContent = `Arriving at ${displayData(data)}`;
      })
      .catch((error) => {
        infoSpan.textContent = "Error";
        buttonHandler(departBtn, true);
        buttonHandler(arriveBtn, true);
      });
  }

  function displayData(data) {
    depUrl = baseURL + data.next;
    arrUrl = baseURL + data.next;
    buttonHandler(arriveBtn, true);
    buttonHandler(departBtn, false);
    return data.name;
  }

  return {
    depart,
    arrive,
  };
}

let result = solve();
