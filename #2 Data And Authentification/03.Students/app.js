function solve() {
  const submitBtn = document.getElementById("submit");
  const tBody = document.querySelector("#results tbody");
  const url = `http://localhost:3030/jsonstore/collections/students`;
  const form = new FormData(document.getElementById("form"));

  submitBtn.addEventListener("click", readData);

  async function readData(e) {
    e.preventDefault();
    const inputs = document.querySelector(".inputs");
    let inputsData = {
      fName: inputs.querySelectorAll("input")[0].value,
      sName: inputs.querySelectorAll("input")[1].value,
      fNum: inputs.querySelectorAll("input")[2].value,
      grade: inputs.querySelectorAll("input")[3].value,
    };

    if (
      inputsData.fName != "" ||
      inputsData.sName != "" ||
      inputsData.fNum != "" ||
      inputsData.grade != ""
    ) {
      try {
        let responce = await fetch(url, {
          method: "post",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(inputsData),
        });

        let result = await responce.json();
        //table tbody tr
        let tRow = document.createElement("tr");

        for (const data in result) {
          if (data === "_id") continue;

          let tdEl = document.createElement("td");
          tdEl.textContent = result[data];
          tRow.append(tdEl);
        }

        tBody.append(tRow);
        clear();
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  function clear(data) {
    debugger;
    const inputs = document.querySelector(".inputs");
    const inputElements = inputs.querySelectorAll("input");

    inputElements.forEach((input) => {
      input.value = "";
    });
  }
}

solve();
