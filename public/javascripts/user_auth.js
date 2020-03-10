var navdiv1 = document.getElementById("navdiv1");
var navdiv2 = document.getElementById("navdiv2");
if (localStorage.getItem("token")) {
  navdiv1.innerHTML = "";
} else {
  navdiv2.innerHTML = "";
}

function login_form_submit(e) {
  e.preventDefault;
  const url = "http://localhost:9000/user/login/";
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

function update_form_submit(e) {
  e.preventDefault;
  const url = "http://localhost:3000/user/update/";
  let data = {
    email: register_form.email.value,
    password: register_form.password.value,
    f_name: register_form.f_name.value,
    l_name: register_form.l_name.value,
    dob: register_form.dob.value,
    mobile: register_form.mobile.value,
    username: register_form.username.value,
    gender: register_form.gender.value
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json())
    .then(msg => {
      if (msg.updated == "success") {
        let token = localStorage.getItem("token");
        let form = document.getElementById("token_submit");
        form.token.value = token;
        form.submit();
      }
    });
}

function gettopost(e, link) {
  e.preventDefault;
  let form = document.getElementById("token_submit");
  form.token.value = localStorage.getItem("token");
  form.action = link;
  form.submit();
}

function logout(e) {
  e.preventDefault;
  localStorage.removeItem("token");
  let form = document.getElementById("token_submit");
  form.action = "/";
  form.method = "get";
  form.token.disabled = "true";
  form.submit();
}
