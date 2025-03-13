import { html, render } from "../node_modules/lit-html/lit-html.js";

const url = "http://localhost:3030/jsonstore/advanced/dropdown";
const container = document.querySelector("select#menu");

document.querySelector("form").addEventListener("submit", onSubmit);

(async function loadData() {
	const responce = await fetch(url);
	if (!responce.ok) {
		return alert("Error loading data");
	}
	const data = await responce.json();
	const result = Object.values(data);

	// Render all options at once by passing a single html template with all options
	render(html`${result.map((row) => createElement(row))}`, container);
})();

function createElement(entry) {
	return html` <option value=${entry._id}>${entry.text}</option>`;
}

function onSubmit(e) {
	e.preventDefault();
	const formData = e.target;
	const text = formData.querySelector("#itemText").value;
	createOption(text);
}

async function createOption(data) {
	const option = {
		method: "POST",
		headers: {
			"Content-Type": "Application/json",
		},
		body: JSON.stringify({ text: data }),
	};
	const responce = await fetch(url, option);
	if (!responce.ok) {
		throw new Error(responce.status);
	}
	const result = await responce.json();
	const newOption = createElement(result);
	render(html`${[...container.children, newOption]}`, container);
	debugger;
}
