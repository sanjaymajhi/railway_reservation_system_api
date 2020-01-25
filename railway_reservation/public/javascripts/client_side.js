function form_submit(e) {
  e.preventDefault;
  const url = "http://localhost:3000/user/login/";
  let data = {
    email: login_form.email.value,
    password: login_form.password.value,
    "g-recaptcha-response": login_form["g-recaptcha-response"].value
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json())
    .then(token => {
      localStorage.setItem("token", token);
      let form = document.getElementById("token_submit");
      form.token.value = token;
      form.submit();
    });
}
