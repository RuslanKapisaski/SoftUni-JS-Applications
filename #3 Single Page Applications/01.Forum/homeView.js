import { showDetails } from "./detailsView.js";

const endpoints = {
	posts: "http://localhost:3030/jsonstore/collections/myboard/posts",
	comments: "http://localhost:3030/jsonstore/collections/myboard/comments",
};

const mainRef = document.querySelector("main");
const topicTitleRef = document.querySelector("div.topic-title");
const topicContainer = document.querySelector("div.topic-container");
const topicBorderRef = document.querySelector("div.new-topic-border");
const formRef = mainRef.querySelector("form");

formRef.addEventListener("submit", onSubmit);

export async function showHome() {
	mainRef.replaceChildren(topicBorderRef);
	mainRef.appendChild(topicTitleRef);
	const postResponce = await fetch(endpoints.posts);
	if (!postResponce.ok) {
		return alert("Error loading the posts");
	}
	const posts = await postResponce.json();
	topicContainer.innerHTML = "";
	Object.entries(posts).forEach((x) => {
		const post = renderPost(x);
		topicContainer.appendChild(x);
	});
}

async function renderPost(post) {
	const divContainer = document.createElement("div");
	divContainer.classList.add("topic-container");
	divContainer.innerHTML = `
    <div class="topic-name-wrapper">
        <div class="topic-name">
            <a href="#" class="normal" data-id=${post._id}>
                <h2>${post.title}</h2>
            </a>
            <div class="columns">
                <div>
                    <p>Date: <time>${post.date}</time></p>
                    <div class="nick-name">
                        <p>Username: <span>${post.username}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
	divContainer.querySelector("a").addEventListener("click", showDetails);
	return divContainer;
}

function onSubmit(e) {
	const formData = new FormData(e.target);
	const hasCancel = e.submitter.classList.contains("cancel");
	if (hasCancel) {
		clear(e.target);
		return;
	}
	const title = formData.get("topicName");
	const username = formData.get("username");
	const content = formData.get("postText");
	if (!title || !username || !content) {
		return alert("All inputs should be filled!");
	}
	savePost({ title, username, textArea: content, date: new Date() });
}

function clear(formRef) {
	formRef.reset();
}

async function savePost(data) {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "Application/json",
		},
		body: JSON.stringify(data),
	};
	const responce = await fetch(endpoints.posts, options);
	if (!responce.ok) {
		return alert("Error creating a post!");
	}
	const post = await responce.json();
	showHome();
}
