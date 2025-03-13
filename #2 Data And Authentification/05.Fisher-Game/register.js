function register() {
  const register_url_endpoint = "http://localhost:3030/users/register";

  document.querySelector("form").addEventListener("submit", onSubmit);

  function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const repassword = formData.get("rePass");

    if (!email || !password || !password == repassword) {
      return alert("All fields shoud be filled!");
    }

    createUser({ email, password });
  }

  async function createUser(data) {
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(data),
    };
    const registerRequest = await fetch(register_url_endpoint, option);
    if (!registerRequest.ok) {
      return alert("Registration error");
    }
    const userData = await registerRequest.json();

    sessionStorage.setItem("userData", JSON.stringify(userData));

    window.location = "app.html";
  }
}

register();
