import { html, render } from "../node_modules/lit-html/lit-html.js";

const rootDiv = document.querySelector("div#root");
const form = document.querySelector("form");

form.addEventListener("submit", onSubmit);

function onSubmit(e) {
	e.preventDefault();
	const formData = new FormData(form);
	const { towns } = Object.fromEntries(formData);
	const townArr = towns.split(", ");
	const ohtmlTownList = createUl(townArr);
	render(ohtmlTownList, rootDiv);
}

function createUl(townArr) {
	return html`<ul>
		${townArr.map((town) => html`<li>${town}</li>`)}
	</ul>`;
}
