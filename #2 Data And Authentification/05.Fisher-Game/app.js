function app() {
  const endpoints = {
    logout: "http://localhost:3030/users/logout",
    showAllCatches: "http://localhost:3030/data/catches",
    specificCatch: "http://localhost:3030/data/catches/",
  };

  const catchesDiv = document.getElementById("catches");
  document.getElementById("logout").addEventListener("click", onLogout);
  document
    .querySelector("button.load")
    .addEventListener("click", onLoadAllCatches);
  document.getElementById("addForm").addEventListener("submit", onCreateCatch);
  const userMailRef = document.querySelector("p.email span");
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  updateNav(userData);

  async function onLogout(e) {
    const option = {
      method: "GET",
      headers: {
        "X-Authorization": userData.accessToken,
      },
    };
    await fetch(endpoints.logout, option);
    sessionStorage.clear();
    window.location = "app.html";
  }

  function updateNav(userData) {
    const guestNavRef = document.getElementById("guest");
    const userNavRef = document.getElementById("user");
    const logoutEl = userNavRef.querySelector("#logout");
    const addButtonRef = document.querySelector("button.add");
    if (userData) {
      guestNavRef.style.display = "none";
      logoutEl.style.display = "inline-block";
      addButtonRef.disabled = false;
      userMailRef.textContent = userData.email;
    } else {
      guestNavRef.style.display = "inline-block";
      logoutEl.style.display = "none";
      addButtonRef.disabled = true;
      userMailRef.textContent = "guest";
    }
  }

  async function onLoadAllCatches() {
    try {
      const responce = await fetch(endpoints.showAllCatches);
      const result = await responce.json();
      catchesDiv.innerHTML = "";

      result.forEach((element) => {
        let domElement = renderCatch(element);
        domElement
          .querySelector("button.update")
          .addEventListener("click", onUpdateCatch);
        domElement
          .querySelector("button.delete")
          .addEventListener("click", onDeleteCatch);
        catchesDiv.appendChild(domElement);
      });
    } catch (e) {
      return alert("Error loading all catches" + e.message());
    }
  }

  function renderCatch(data) {
    const isAuthor = userData?._id === data._ownerId;
    const container = document.createElement("div");
    container.classList.add("catch");

    container.innerHTML =
      `<label>Angler</label>` +
      `<input type="text" class="angler" value="${data.angler}" />` +
      `<label>Weight</label>` +
      `<input type="text" class="weight" value="${data.weight}" />` +
      `<label>Species</label>` +
      ` <input type="text" class="species" value="${data.species}" />` +
      `<label>Location</label>` +
      ` <input type="text" class="location" value="${data.location}" />` +
      `<label>Bait</label>` +
      `<input type="text" class="bait" value="${data.bait}" />` +
      `<label>Capture Time</label>` +
      `<input type="number" class="captureTime" value="${data.captureTime}" />` +
      `<button
              class="update"
              ${isAuthor ? "" : "disabled"}
              data-id="07f260f4-466c-4607-9a33-f7273b24f1b4"
            >
              Update
            </button>` +
      `<button
              class="delete"
               ${isAuthor ? "" : "disabled"}
              data-id="07f260f4-466c-4607-9a33-f7273b24f1b4"
            >
              Delete
            </button>`;

    return container;
  }

  function onCreateCatch(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const angler = formData.get("angler");
    const weight = formData.get("weight");
    const species = formData.get("species");
    const location = formData.get("location");
    const bait = formData.get("bait");
    const captureTime = formData.get("captureTime");

    saveCatch({ angler, weight, species, location, bait, captureTime });
    debugger;
    e.target.reset();
  }

  async function saveCatch(data) {
    try {
      const post = {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
          "X-authorization": userData.accessToken,
        },
        body: JSON.stringify(data),
      };
      const responce = await fetch(endpoints.showAllCatches, post);
      const result = await responce.json();
      const newCatch = renderCatch(result);
      catchesDiv.appendChild(newCatch);
    } catch (error) {
      throw new Error("Error creating new catch" + error.message());
    }
  }

  function onUpdateCatch(e) {
    const id = e.target.dataset.id;
    const inputs = Array.from(e.target.parentElement.querySelectorAll("input"));

    const [angler, weight, species, location, bait, captureTime] = inputs;

    const data = {
      angler: angler.value,
      weight: weight.value,
      species: species.value,
      location: location.value,
      bait: bait.value,
      captureTime: captureTime.value,
    };

    updateCatch(data, id);

    onLoadAllCatches();
  }

  async function updateCatch(data, id) {
    try {
      const option = {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
          "X-Authorization": userData.accessToken,
        },
        body: JSON.stringify(data),
      };

      const responce = await fetch(endpoints.specificCatch + id, option);
    } catch (error) {
      return alert(error.message);
    }
  }

  async function onDeleteCatch(e) {
    const id = e.target.dataset.id;
    const option = {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
        "X-Authorization": userData.accessToken,
      },
    };

    console.log(endpoints.specificCatch + id);

    await fetch(endpoints.specificCatch + id, option);
    debugger;
    onLoadAllCatches();
  }
}

app();
