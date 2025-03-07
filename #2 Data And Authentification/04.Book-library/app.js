function solve() {
  let table = document.querySelector("table");
  let tBody = document.querySelector("table tbody");
  let loadBookBtn = document.getElementById("loadBooks");
  let formButton = document.querySelector("form button");
  let form = document.querySelector("form");
  let inputs = form.querySelectorAll("input");

  let endpoints = {
    getUrl: `http://localhost:3030/jsonstore/collections/books`,
    specificBookUrl: `http://localhost:3030/jsonstore/collections/books/`,
  };

  //GET
  loadBookBtn.addEventListener("click", getData);

  form.addEventListener("submit", createData);

  async function getData() {
    const request = await fetch(endpoints.getUrl);
    if (!request.ok) {
      return alert("Error getting the books");
    }
    const result = await request.json();

    const rows = Object.entries(result).map(([id, book]) =>
      createRow(id, book)
    );
    tBody.replaceChildren(...rows);
  }

  //POST
  async function createData(e) {
    e.preventDefault();
    const options = {
      title: inputs[0].value,
      author: inputs[1].value,
    };

    if (!inputs[0].value || !inputs[1].value) {
      return alert("All fields should be filled");
    }

    const request = await fetch(endpoints.getUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(options),
    });
    if (!request.ok) {
      return alert("Error creating book" + request.statusText());
    }
    debugger;
    const result = await request.json();

    form.reset();
    let row = createRow(result);

    formButton.textContent = "Submit";
    tBody.appendChild(row);

    getData();
  }

  function createRow(id, book) {
    const row = document.createElement("tr");
    const titleCol = document.createElement("td");
    titleCol.textContent = book.title;
    const authorCol = document.createElement("td");
    authorCol.textContent = book.author;
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => editData(id));
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => deleteData(id));
    row.appendChild(titleCol);
    row.appendChild(authorCol);
    row.appendChild(editButton);
    row.appendChild(deleteButton);

    return row;
  }

  //UPDATE
  async function editData(id) {
    const request = await fetch(endpoints.specificBookUrl + id);
    if (!request.ok) {
      return alert("Error: Failed to fetch book data for editing.");
    }

    try {
      const result = await request.json();
      if (!result) {
        return alert("No data found for this book.");
      }

      inputs[0].value = result.title;
      inputs[1].value = result.author;

      formButton.textContent = "Save";
      form.dataset.bookId = id;

      form.removeEventListener("submit", createData);
      form.addEventListener("submit", onEdit);
    } catch (err) {
      alert("Error parsing the response: " + err.message);
    }
  }

  async function onEdit(e) {
    e.preventDefault();

    const bookId = form.dataset.bookId;

    const updatedData = {
      title: inputs[0].value,
      author: inputs[1].value,
    };

    const response = await fetch(endpoints.specificBookUrl + bookId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      return alert("Error updating the book");
    }

    const result = await response.json();
    console.log(result);

    form.reset();
    formButton.textContent = "Submit";
    delete form.dataset.bookId;

    getData();

    form.removeEventListener("submit", onEdit);
    form.addEventListener("submit", createData);
  }

  //DELETE
  async function deleteData(book_id) {
    debugger;
    const choice = confirm("Are you sure?");
    if (!choice) {
      return;
    }
    const request = await fetch(endpoints.specificBookUrl + book_id, {
      method: "DELETE",
    });

    if (!request.ok) {
      return alert("Error deleting the book");
    }
    getData();
  }
}

solve();
