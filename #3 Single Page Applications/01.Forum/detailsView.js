const endpoints = {
	posts: "http://localhost:3030/jsonstore/collections/myboard/posts",
	comments: "http://localhost:3030/jsonstore/collections/myboard/comments",
};

const mainRef = document.querySelector("main");
const commentsRef = document.querySelector("div.comment");
const sectionCommentsRef = document.querySelector("div.answer");
const themeContentRef = document.querySelector("div.theme-content");
const themeTitleRef = document.querySelector("div.theme-title");

let postID = null;
export async function showDetails(e) {
	mainRef.replaceChild(themeContentRef);
	sectionCommentsRef
		?.querySelector("form")
		.addEventListener("submit", onCreateComment);
	postID = e.currentTarget.dataset.id;
	const responce = await fetch(endpoints.posts + "/" + postID);
	const post = await responce.json();
	const title = createPostTitle(post);
	const details = createPostDetails(post);
	const comments = await getComments();
	themeTitleRef.replaceChildren(title);
	commentsRef.replaceChildren(details);
	showComments(postID, Object.values(comments));
}

function createPostTitle(post) {
	const divContainer = document.createElement("div");
	divContainer.classList.add("theme-name-wrapper");
	divContainer.innerHTML = `
				<div class="theme-name">
						<h2>${post.title}</h2>
				</div>
    `;
	return divContainer;
}

function createPostDetails(post) {
	const divContainer = document.createElement("div");
	divContainer.classList.add("header");
	divContainer.innerHTML = `
    <img src="./static/profile.png" alt="avatar">
        <p><span>${post.username}</span> posted on <time>${post.date}</time></p>
        <p class="post-content">${post.content}</p>
    `;
	return divContainer;
}

function onCreateComment(e) {
	e.preventDefault();
	const formData = new FormData(e.target);
	const username = formData.get("username");
	const commentText = formData.get("postText");
	if (!commentText || !username) {
		return;
	}
	saveComment({ comment: commentText, username, date: new Date(), postID });
}

async function saveComment(data) {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	const responce = await fetch(endpoints.comments, options);
}

async function getComments() {
	const responce = await fetch(endpoints.comments);
	const data = await responce.json();
	return data;
}

async function showComments(postId, data) {
	const container = document.createElement("div");
	container.id = "user-comment";
	data
		.filter((x) => x.postId === postId)
		.forEach((x) => {
			const comment = createComment(x);
			container.appendChild(comment);
		});
	commentsRef.appendChild(container);
}

async function createComment(comment) {
	const container = document.createElement("div");
	container.classList.add("topic-name-wrapper");
	container.innerHTML = `
            <div class="topic-name">
                <p><strong>${comment.username}</strong> commented on <time>${comment.date}</time></p>
                <div class="post-content">
                ${comment.commentText}
                </div>
    `;
	return container;
}
