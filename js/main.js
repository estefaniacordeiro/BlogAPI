var requestAllPosts = {
    "url": "https://jsonplaceholder.typicode.com/posts",
    "method": "GET",
    "timeout": 0,
};
$.ajax(requestAllPosts).done(loadAllPosts);

function loadAllPosts(allPosts){
    allPosts.forEach(element => {
        let divPost=($(`<div class='div-list'></div>`));
        let divInfoPost =($(`<div class='div-info' userid='${element.userId}' postid='${element.id}'></div>`));
        divInfoPost.on("click", clickPost);
        let postTitle=($(`<h3>${element.title}</h3>`));
        divInfoPost.append(postTitle);
        let postBody=($(`<div>${element.body}</div>`));
        divInfoPost.append(postBody);

        divPost.append(divInfoPost);

        let modifyBTN=($(`<button>modify</button>`));
        divPost.append(modifyBTN);

        let deleteBTN=($(`<button class="delete-btn" postid='${element.id}'>delete</button>`));
        deleteBTN.on("click", deletePost);
        divPost.append(deleteBTN);

        $("#postList").append(divPost);
    });
}

function clickPost(){
    $('.div-info').off('click', clickPost);

    let infoPost=$(this);

    let userNumber=$(this).attr("userid");

    var requestUserOfPost = {
        "url": `https://jsonplaceholder.typicode.com/users?id=${userNumber}`,
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(requestUserOfPost).done(function(userOfPost){
        createModal(userOfPost,infoPost);
    });
}

function createModal(userOfPost,infoPost){
    $("#modal-wrapper").removeClass("hidden");
    $('#closed-modal').on('click', clickCloseModal);
    let titleText=infoPost[0].childNodes[0].innerText;
    let bodyText=infoPost[0].childNodes[1].innerText;
    $(".modal-content").append($(`<h2>${titleText}</h2>`));
    $(".modal-content").append($(`<p>${bodyText}</p>`));

    $(".modal-content").append($(`<h3>${userOfPost[0].name}</h3>`));
    $(".modal-content").append($(`<p>${userOfPost[0].username}</p>`));
    $(".modal-content").append($(`<p class="email">${userOfPost[0].email}</p>`));
    $(".modal-content").append($('<h2>Comments:</h2>'));
    let myPostId=infoPost[0].attributes[2].value;
    $(".modal-content").append($(`<button id="commentsBtn" mypostid="${myPostId}">Load comments</button>`));
    $("#commentsBtn").on("click", loadComments);
}

function clickCloseModal() {
    $('#closed-modal').off('click', clickCloseModal);
    $('.modal-content').text('');
    $("#modal-wrapper").addClass("hidden");
    $('.div-info').on("click", clickPost);
}

function loadComments(){
    $("#commentsBtn").off("click", loadComments);
    $("#commentsBtn").addClass("hidden");
    let postIdHelp=$(this).attr("mypostid");
    console.log(postIdHelp);
    var requestLoadComments = {
        "url": `https://jsonplaceholder.typicode.com/comments?postId=${postIdHelp}`,
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(requestLoadComments).done(function(loadComments) {
        clickComments(loadComments);
    });
}

function clickComments(loadComments) {
    loadComments.forEach(element => {
        let divComment=$("<div class='comment'></div>");
        divComment.append($(`<h4>${element.name}</h4>`));
        divComment.append($(`<span>${element.body}<span>`));
        divComment.append($(`<p class="email">${element.email}</p>`));
        $(".modal-content").append(divComment);
    });
}

function deletePost(){
    let postNumber=$(this).attr("postid");

    $(this)[0].parentNode.remove();

    var requestDeletePost = {
        "url": `https://jsonplaceholder.typicode.com/posts/${postNumber}`,
        "method": "DELETE",
        "timeout": 0,
    };
    $.ajax(requestDeletePost).done();
}