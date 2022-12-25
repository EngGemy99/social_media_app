// display data
let currentPage = 1;
let lastPage = 1;
function disPlayData(reload = true, currentPage = 1) {
  axios.get(`${baseUrl}/posts?limit=5&page=${currentPage}`).then((response) => {
    lastPage = response.data.meta.last_page;
    let posts = document.querySelector(".posts");
    if (reload) {
      posts.innerHTML = "";
    }
    let tags = ["Politician", "sports"];
    let userId = JSON.parse(localStorage.getItem("user"));
    for (const card of response.data.data) {
      posts.innerHTML += `
         <div class="card shadow mb-3">
                <div class="card-header d-flex align-items-center">
                  <div class="me-auto d-flex align-items-center" style="cursor:pointer" onclick="openProfilePage(${
                    card.author.id
                  })">
                      <img
                        src="
                        ${
                          !Object.keys(card.author.profile_image).length
                            ? "../images/1.png"
                            : card.author.profile_image
                        }"
                        class="rounded-circle d-block"
                        style="width: 40px; height: 40px"
                      />
                      <span 
                      class="userName d-block fw-bold mx-2"
                        
                      >
                      ${card.author.username}
                      </span>
                  </div>
                  ${
                    userId && userId.id == card.author.id
                      ? `
                      <span
                          onclick="handelPostDelete(${card.id})"
                          style="cursor:pointer"
                          class="text-danger mx-3"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </span> 
                      <span
                          class="text-primary"
                          style="cursor:pointer"
                          onclick="handelEditPost(
                              ${card.id}
                            ,'${card.title || ""}'
                            , '${card.body}'
                            ,'${card.image}'
                            )"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                        </span> 
                      
                      `
                      : ""
                  }
                      
                </div>
                <div class="card-body" style="cursor:pointer" onclick="goToDetails(${
                  card.id
                })">
                  <img src="${
                    !Object.keys(card.image).length
                      ? "../images/bg.jpg"
                      : card.image
                  }" class="w-100 rounded" />
                  <p class="text-secondary">${card.created_at}</p>
                  <h5 class="card-title">${card.title || ""}</h5>
                  <p class="card-text">
                  ${card.body}
                  </p>
                  <hr />
                    <div class="d-flex align-items-center">
                  <div class="icon me-auto d-flex align-items-center">
                     <lord-icon
                        src="https://cdn.lordicon.com/flvisirw.json"
                        trigger="loop"
                        delay="2000"
                        style="width:50px;height:50px">
                    </lord-icon>
                    <span> (${card.comments_count}) comment </span>
                  </div>
                      ${tags.map((ele) => {
                        return `
                        <span class="badge text-bg-secondary">${ele}</span>

                        `;
                      })}
                  </div>
                </div>
              </div>
    `;
    }
    // display none loader
    let loader = document.querySelector(".loader");
    loader.style.display = "none";
  });
}
disPlayData();
//end display data

// displayData when scroll//
window.addEventListener("scroll", () => {
  let endOfPage =
    window.pageYOffset + window.innerHeight >= document.body.offsetHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage += 1;
    disPlayData(false, currentPage);
  }
});
//End displayData when scroll//

// to change ui
setUpUI();
