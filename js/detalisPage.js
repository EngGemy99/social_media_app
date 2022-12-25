let reg = /\d+/gi;
id = location.search.match(reg).join("");

function getPost(id) {
  axios.get(`${baseUrl}/posts/${id}`).then((response) => {
    let {
      image,
      body,
      title,
      comments_count,
      comments,
      author: { profile_image, username },
    } = response.data.data;
    let [
      profileImage,
      userName,
      bgImage,
      postTitle,
      postBody,
      postComment,
      commentsContainer,
    ] = createVariable(
      ".profile_image",
      ".userName",
      ".bgImage",
      ".postTitle",
      ".postBody",
      ".postComment",
      ".commentsContainer"
    );
    profileImage.src = profile_image;
    userName.innerHTML = username;
    bgImage.src = image;
    postTitle.innerHTML = title;
    postBody.innerHTML = body;
    postComment.innerHTML = `(${comments_count}) comment`;
    commentsContainer.innerHTML = "";
    if (comments.length > 0) {
      for (const comment of comments) {
        let {
          body,
          author: { username, profile_image },
        } = comment;
        commentsContainer.innerHTML += `
            <div class="comment">
              <img
                src="${profile_image}"
                style="width: 40px; height: 40px"
                class="rounded-circle"
                alt=""
              />
              <span>${username}</span>
              <p class="p-3">${body}</p>
            </div>
            <hr />
        `;
      }
    }
    // display none loader
    let loader = document.querySelector(".loader");
    loader.style.display = "none";
  });
}
getPost(id);

function handelAddComment() {
  let [commentValue] = createVariable(".commentValue");
  let token = localStorage.getItem("token");
  axios
    .post(
      `${baseUrl}/posts/${id}/comments`,
      {
        body: commentValue.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      iziToast.success({
        timeout: 1500,
        message: "comment Added Successfully",
      });
      getPost(id);
      commentValue.value = "";
    })
    .catch((error) => {
      iziToast.warning({
        timeout: 1500,
        message: error.response.data.message,
      });
    });
}

setUpUI();
