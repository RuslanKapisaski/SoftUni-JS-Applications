function attachEvents() {
  const submitEl = document.getElementById("submit");
  const refreshEl = document.getElementById("refresh");
  const authorRef = document.querySelector(`[name="author"]`);
  const contentRef = document.querySelector(`[name="content"]`);
  const textArea = document.getElementById("messages");

  const baseUrl = `http://localhost:3030/jsonstore/messenger`;

  submitEl.addEventListener("click", postData);
  refreshEl.addEventListener("click", getData);

  async function postData(e) {
    const data = {
      author: authorRef.value,
      content: contentRef.value,
    };

    let responce = await fetch(baseUrl, {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!responce.ok) {
      return alert("Error posting a content");
    }

    authorRef.value = "";
    contentRef.value = "";

    let result = await responce.json();
  }

  async function getData(e) {
    let responce = await fetch(`http://localhost:3030/jsonstore/messenger`);
    let result = await responce.json();
    let values = Object.values(result);
    console.log(values);
    textArea.disabled = false;
    for (const el of values) {
      let p = document.createElement("p");
      textArea.value += `${el.author}: ${el.content}\n`;
      console.log(textArea.value);
      textArea.append(p);
    }
  }
}

attachEvents();
