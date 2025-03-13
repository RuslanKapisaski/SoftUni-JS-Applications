import { html, render } from "../node_modules/lit-html/lit-html.js";
import { cats } from "./catSeeder.js";

const container = document.querySelector("section#allCats");

const htmlElement = renderCats(cats);
render(htmlElement, container);

function renderCats(data) {
	return html`<ul>
		${data.map(
			(cat) => html`
				<li>
					<img
						src="./images/${cat.imageLocation}.jpg"
						width="250"
						height="250"
						alt="Card image cap"
					/>
					<div class="info">
						<button class="showBtn" @click="${displayStatus}">
							Show status code
						</button>
						<div class="status" style="display: none" id="${cat.id}">
							<h4>Status Code: ${cat.statusCode}</h4>
							<p>${cat.statusMessage}</p>
						</div>
					</div>
				</li>
			`
		)}
	</ul>`;
}

function displayStatus(e) {
	const button = e.target;
	const infoDiv = e.target.parentNode;
	const statusDiv = infoDiv.querySelector("div.status");
	if (button.textContent == "Show status code") {
		statusDiv.style.display = "block";
		button.textContent = "Hide status code";
	} else {
		statusDiv.style.display = "none";
		button.textContent = "Show status code";
	}
}
