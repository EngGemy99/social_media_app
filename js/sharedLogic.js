let baseUrl = "https://tarmeezacademy.com/api/v1";

// to handel logout clicked
function logout() {
  localStorage.clear();
  iziToast.success({
    timeout: 1000,
    message: "Logout Successfully",
  });
  setUpUI();
}

// handel register btn
function handelBtnRegister() {
  let [
    UsernameRegister,
    PasswordRegister,
    nameRegister,
    emailRegister,
    profileImage,
  ] = createVariable(
    "#UsernameRegister",
    "#PasswordRegister",
    "#nameRegister",
    "#emailRegister",
    "#profileImage"
  );
  let bodyFormData = new FormData();
  bodyFormData.append("username", UsernameRegister.value);
  bodyFormData.append("name", nameRegister.value);
  bodyFormData.append("password", PasswordRegister.value);
  bodyFormData.append("email", emailRegister.value);
  bodyFormData.append("image", profileImage.files[0]);
  axios({
    method: "post",
    url: `${baseUrl}/register`,
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((res) => {
      console.log(res);
      // Get Token and store it in local storage
      let { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // the ways to hidden modal in bs5
      new Promise((res, rej) => {
        setTimeout(() => {
          // first way form bs5 to close modal
          const myModalEl = document.getElementById("registerModal");
          const modal = bootstrap.Modal.getInstance(myModalEl);
          modal.hide();
          res();
        }, 1000);
      }).then((res) => {
        // do not execute that before do upper code (very important code)
        // show message Successfully when register
        iziToast.success({
          timeout: 1000,
          message: "Register Successfully",
        });
      });

      // when user login change ui for web site
      setUpUI();
      window.location.reload();
    })
    .catch((error) => {
      iziToast.warning({
        timeout: 1000,
        message: error.response.data.message,
      });
    });
}

// to create any number of variable
function createVariable(...variables) {
  let arr = [];
  for (const item of variables) {
    arr.push(document.querySelector(item));
  }
  return arr;
}

// handel login btn

function handelBtnLogin() {
  let [Username, Password] = createVariable("#Username", "#Password");
  axios
    .post(`${baseUrl}/login`, {
      username: Username.value,
      password: Password.value,
    })
    .then((res) => {
      console.log(res);
      // Get Token and store it in local storage
      let { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      new Promise((res, rej) => {
        setTimeout(() => {
          // first way form bs5 to close modal
          const myModalEl = document.getElementById("exampleModal");
          const modal = bootstrap.Modal.getInstance(myModalEl);
          modal.hide();
          res();
        }, 1000);
      }).then((res) => {
        // do not execute that before do upper code (very important code)
        // show message Successfully when register
        iziToast.success({
          timeout: 1000,
          message: "Login Successfully",
        });
      });
      // when user login change ui for web site
      setUpUI();
      window.location.reload();
    })
    .catch((error) => {
      iziToast.warning({
        timeout: 1000,
        message: error.response.data.message,
      });
    });
}
// to control on ui
function setUpUI() {
  let token = localStorage.getItem("token");
  let [
    btnContainer,
    userInformation,
    userImage,
    userName,
    addPostBtn,
    commentOptions,
  ] = createVariable(
    ".btns",
    ".user-information",
    ".user-image",
    ".user-name",
    ".create-post-btn",
    ".commentOptions"
  );
  if (token) {
    let user = JSON.parse(localStorage.getItem("user"));
    let { username, profile_image } = user;
    btnContainer.style.display = "none";
    userInformation.style.display = "block";
    if (addPostBtn != null) {
      addPostBtn.style.display = "block";
    }
    if (commentOptions != null) {
      commentOptions.style.display = "block";
    }

    userImage.src = `${profile_image}`;
    userName.innerHTML = username;
  } else {
    console.log("no");
    if (addPostBtn != null) {
      addPostBtn.style.display = "none";
    }
    if (commentOptions != null) {
      commentOptions.style.display = "none";
    }
    btnContainer.style.display = "block";
    userInformation.style.display = "none";
  }
}

// handel edit btn
function handelEditPost(id, title, body, image) {
  document.getElementById("hiddenInput").value = id;
  document.getElementById("model-post-title").innerHTML = "Edit Post";
  document.getElementById("add-post-btn").innerHTML = "Edit Post";
  document.getElementById("post-title-input").value = title;
  document.querySelector(".post-body").value = body;

  // A way to open modal in bs5
  let postModal = new bootstrap.Modal(document.getElementById("addPostModal"));
  postModal.toggle();
}

// to handel open modal and change ui
function handelCreatePostBtn() {
  document.getElementById("hiddenInput").value = "";
  document.getElementById("add-post-btn").innerHTML = "add Post";
  document.getElementById("model-post-title").innerHTML = "Create A New post";
  document.getElementById("post-title-input").value = "";
  document.querySelector(".post-body").value = "";

  // A way to open modal in bs5
  let postModal = new bootstrap.Modal(document.getElementById("addPostModal"));
  postModal.toggle();
}

// to handel delete a post
function handelPostDelete(postId) {
  let idDeleteInput = document.getElementById("id-delete-post");
  idDeleteInput.value = postId;
  console.log(idDeleteInput.value);
  // A way to open modal in bs5
  let postModal = new bootstrap.Modal(
    document.getElementById("deletePostModal")
  );
  postModal.toggle();
}

function confirmDeletePostBtn() {
  let idDeleteInput = document.getElementById("id-delete-post");
  let token = localStorage.getItem("token");
  axios
    .delete(`${baseUrl}/posts/${idDeleteInput.value}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const myModalEl = document.getElementById("deletePostModal");
      const modal = bootstrap.Modal.getInstance(myModalEl);
      modal.hide();
      iziToast.success({
        timeout: 1000,
        message: "Post Remove Successfully",
      });
      console.log("??del");
      disPlayData();
    })
    .catch((error) => {
      console.log();
      iziToast.warning({
        timeout: 1000,
        message: error.response.data.error_message,
      });
    });
}

// to create a new post
function handelAddPostBtn() {
  // to get id from hidden input
  let hiddenInput = document.getElementById("hiddenInput").value;
  let [postTitle, postBody, postImage] = createVariable(
    "#post-title-input",
    ".post-body",
    "#post-image-input"
  );
  let token = localStorage.getItem("token");
  let url = `${baseUrl}/posts`;
  let bodyParams = {
    title: postTitle.value,
    body: postBody.value,
    image: postImage.files[0],
  };

  let headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };

  if (hiddenInput != "") {
    url = `${baseUrl}/posts/${hiddenInput}`;
    // this part from Laravel to send put request
    bodyParams["_method"] = "put";
  }
  let addBtn = document.getElementById("add-post-btn");
  let addBtnValue = addBtn.innerHTML;
  addBtn.setAttribute("disabled", "true");
  addBtn.innerHTML = `
       <span
           class="spinner-grow spinner-grow-sm"
           role="status"
           aria-hidden="true"
         ></span>
         <span class="sr-only">Loading...</span>
      `;
  axios
    .post(url, bodyParams, {
      headers,
    })
    .then((res) => {
      new Promise((res, rej) => {
        setTimeout(() => {
          // first way form bs5 to close modal
          const myModalEl = document.getElementById("addPostModal");
          const modal = bootstrap.Modal.getInstance(myModalEl);
          modal.hide();
          addBtn.removeAttribute("disabled");
          addBtn.innerHTML = addBtnValue;
          res();
        }, 1000);
      }).then((res) => {
        disPlayData();
        // do not execute that before do upper code (very important code)
        // show message Successfully when register
        iziToast.success({
          timeout: 1000,
          message: "Post Added Successfully",
        });
      });
    })
    .catch((error) => {
      addBtn.removeAttribute("disabled");
      addBtn.innerHTML = addBtnValue;
      iziToast.warning({
        timeout: 1000,
        message: error.response.data.message,
      });
    });
}

// go to details page
function goToDetails(id) {
  location = `./detalisPage.html?postId=${id}`;
}

function openProfilePage(id) {
  location = `../profile.html?userid=${id}`;
}
