function login() {
  const login_url_endpoint = "http://localhost:3030/users/login";
  document.querySelector("form").addEventListener("submit", onSubmit);

  function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    onLogin({ email, password });
  }

  async function onLogin(data) {
    const option = {
      method: "POST",
      haders: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(data),
    };
    const loginRequest = await fetch(login_url_endpoint, option);

    if (!loginRequest.ok) {
      return alert("Error logging in. Please try again with correct data!");
    }

    const userData = await loginRequest.json();

    sessionStorage.setItem("userData", JSON.stringify(userData));
    window.location = "app.html";
  }
}

login();
