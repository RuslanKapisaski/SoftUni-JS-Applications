import { html, render } from "../node_modules/lit-html/lit-html.js";
import { towns } from "./towns.js";

const townsDiv = document.querySelector("div#towns");
const reusltDiv = document.querySelector("div#result");

document.querySelector("body article button").addEventListener("click", search);

function search() {
	const input = document.querySelector("input").value;
	const townHtml = listTowns(towns, input);
	render(townHtml, townsDiv);
	const resultHtml = listMatches(towns, input);
	render(resultHtml, reusltDiv);
}

function listTowns(towns, input) {
	let matches = 0;
	return html`
		<ul>
			${towns.map(
				(town) =>
					html`<li
						class=${town === input ? "active" : ""}
						${town === input ? matches++ : matches}
					>
						${town}
					</li>`
			)}
		</ul>
	`;
}

function listMatches(towns, input) {
	let matches = 0;
	towns.forEach((town) => {
		matches += town === input ? 1 : 0;
	});
	return html` <div id="result">${matches} matches found</div> `;
}
