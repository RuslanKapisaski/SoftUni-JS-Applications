// //AJAX
// function getInfoAJAX() {
//   let resultDiv = document.getElementById("result");
//   let stopNameDiv = resultDiv.querySelector("#stopName");
//   let busUl = resultDiv.querySelector("#buses");
//   const stopIdRef = document.getElementById("stopId");
//   const validIds = [1287, 1308, 1327, 2334];

//   if (!validIds.includes(Number(stopIdRef.value))) {
//     stopNameDiv.textContent = "Error";
//     clear();
//     return;
//   }

//   const url = `http://localhost:3030/jsonstore/bus/businfo/${stopIdRef.value}`;
//   const httpRequest = new XMLHttpRequest();

//   httpRequest.addEventListener("readystatechange", () => {
//     if (httpRequest.readyState == 4 && httpRequest.status == 200) {
//       let response = JSON.parse(httpRequest.responseText);
//       stopIdRef.value = "";
//       stopNameDiv.textContent = response.name;
//       for (const bus in response.buses) {
//         let minutes = response.buses[bus];
//         let li = document.createElement("li");
//         li.textContent = `Bus ${bus} arrives in ${minutes} minutes`;
//         busUl.appendChild(li);
//       }
//     }
//   });

//   httpRequest.open("GET", url);
//   httpRequest.send();

//   function clear() {
//     stopIdRef.value = "";
//     busUl.innerHTML = "";
//   }
// }

// //Async Await
// async function getInfoAsync() {
//   let resultDiv = document.getElementById("result");
//   let stopNameDiv = resultDiv.querySelector("#stopName");
//   let busUl = resultDiv.querySelector("#buses");
//   const stopIdRef = document.getElementById("stopId");

//   const url = `http://localhost:3030/jsonstore/bus/businfo/${stopIdRef.value}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     stopIdRef.value = "";
//     renderList(data);
//   } catch (error) {
//     stopNameDiv.textContent = "Error";
//     clear();
//   }

//   function renderList(data) {
//     Object.entries(data.buses).forEach((element) => {
//       const [busId, timeToArrive] = element;
//       const li = document.createElement("li");
//       li.textContent = `Bus ${busId} arrives in ${timeToArrive} minutes`;
//       busUl.appendChild(li);
//     });
//   }

//   function clear() {
//     stopIdRef.value = "";
//     busUl.innerHTML = "";
//   }
// }

//Promises
function getInfo() {
  let resultDiv = document.getElementById("result");
  let stopNameDiv = resultDiv.querySelector("#stopName");
  let busUl = resultDiv.querySelector("#buses");
  const stopIdRef = document.getElementById("stopId");

  const url = `http://localhost:3030/jsonstore/bus/businfo/${stopIdRef.value}`;

  fetch(url)
    .then((response) => {
      response
        .json()
        .then((data) => {
          clear();
          renderList(data);
        })
        .catch((e) => {
          clear();
          stopNameDiv.textContent = "Error";
        });
    })
    .catch((e) => {
      clear();
      stopNameDiv.textContent = "Error";
    });

  function renderList(data) {
    Object.entries(data.buses).forEach((element) => {
      const [busId, timeToArrive] = element;
      const li = document.createElement("li");
      li.textContent = `Bus ${busId} arrives in ${timeToArrive} minutes`;
      busUl.appendChild(li);
    });
  }

  function clear() {
    stopIdRef.value = "";
    busUl.innerHTML = "";
  }
}
