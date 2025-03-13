function attachEvents() {
  const phonebookUl = document.getElementById("phonebook");
  const personInputRef = document.getElementById(`person`);
  const phoneInputRef = document.getElementById(`phone`);
  const loadBtn = document.getElementById("btnLoad");
  const createBtn = document.getElementById("btnCreate");

  const endpoints = {
    phonebooks: `http://localhost:3030/jsonstore/phonebook/`,
    deletePhonebook: `http://localhost:3030/jsonstore/phonebook/`,
  };

  loadBtn.addEventListener("click", loadContacts);
  createBtn.addEventListener("click", () =>
    postContacts([personInputRef.value, phoneInputRef.value])
  );

  async function loadContacts() {
    const response = await fetch(endpoints.phonebooks);
    const result = await response.json();
    renderContacts(result);
  }

  function renderContacts(data) {
    const contacts = Object.values(data);
    phonebookUl.innerHTML = "";
    for (const contact of contacts) {
      let liEl = document.createElement("li");
      let delBtn = document.createElement("button");
      delBtn.classList.add("delete");
      delBtn.textContent = "Delete";
      liEl.textContent = `${contact.person}: ${contact.phone}`;
      liEl.append(delBtn);
      phonebookUl.append(liEl);
      delBtn.addEventListener("click", () => deleteContancts(contact._id));
    }
  }

  async function postContacts(data) {
    const options = {
      person: data[0],
      phone: data[1],
    };
    const response = await fetch(endpoints.phonebooks, {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      return alert("Error creating new contact");
    }

    let result = await response.json();
    console.log(`Successfuly created contact: ${result}`);

    clear(personInputRef);
    clear(phoneInputRef);
  }

  async function deleteContancts(id) {
    const response = await fetch(endpoints.deletePhonebook + id, {
      method: "delete",
    });
    if (!response.ok) {
      return alert("Error withd deleting this contact");
    }
    const deletedContact = await response.json();
    alert(`Deleted: ${deletedContact.person} - ${deletedContact.phone}`);
    loadContacts();
  }

  function clear(element) {
    return (element.value = " ");
  }
}

attachEvents();
