var flag=1;

var requestAllPosts = {
    "url": "https://jsonplaceholder.typicode.com/posts?_start=0&_limit=15",
    "method": "GET",
    "timeout": 0,
};
$.ajax(requestAllPosts).done(loadAllPosts);

function loadAllPosts(allPosts){
    allPosts.forEach(element => {
        let divPost=($(`<div class='div-list'></div>`));
        let divInfoPost =($(`<div class='div-info' userid='${element.userId}' postid='${element.id}' id='${element.id}'></div>`));
        divInfoPost.on("click", clickPost);
        let postTitle=($(`<h3>${element.title}</h3>`));
        divInfoPost.append(postTitle);
        let postBody=($(`<div>${element.body}</div>`));
        divInfoPost.append(postBody);

        divPost.append(divInfoPost);

        let modifyBTN=($(`<p class="modify-btn" postid='${element.id}'><i class="fas fa-edit"></i></p>`));
        modifyBTN.on("click", modifyPost);
        divPost.append(modifyBTN);

        let deleteBTN=($(`<p class="delete-btn" postid='${element.id}'><i class="fas fa-trash"></i></p>`));
        deleteBTN.on("click", deletePost);
        divPost.append(deleteBTN);

        $("#postList").append(divPost);
    });
    if(flag<85) {
        let morePost=$("<button class='morePost-btn' id='morePost'>Load more post</button>");
        morePost.on('click', loadMorePost);
        $('#postList').append(morePost);
        flag+=15;
    }
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
    $(".modal-content").append($(`<button id="commentsBtn" class="commentsBtn" mypostid="${myPostId}">Load comments</button>`));
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

function modifyPost() {
    $('.modify-btn').off("click", modifyPost);
    let postNumber=$(this).attr("postid");

    $("#modal-wrapper").removeClass("hidden");
    $('#closed-modal').on('click', clickCloseModify);

    let form = $('<form class="form"></form>');
    let labelTitle = $(`<h4 class="labelForm">Title:</h4>`);
    let labelBody = $(`<h4 class="labelForm">Body:</h4>`);
    let inputTitle=$("<textarea class='input-title'></textarea>")
    let inputBody=$("<textarea class='input-body'></textarea>");
    let saveBtn=$(`<button class='saveBtn' postid='${postNumber}'>Save</button>`);

    form.append($(`<h2>Edit post</h2>`));
    form.append(labelTitle);
    form.append(inputTitle);
    form.append(labelBody);
    form.append(inputBody);
    form.append(saveBtn);
    $(".modal-content").append(form);
    $('.modify-btn').on("click", modifyPost);
    $('.saveBtn').on('click', saveForm);
}

function clickCloseModify() {
    $('#closed-modal').off('click', clickCloseModify);
    $('.modal-content').text('');
    $("#modal-wrapper").addClass("hidden");
    $('#closed-modal').on('click', clickCloseModify);
}

function saveForm(e) {
    e.preventDefault();
    let postNumber=$(this).attr("postid");
    let newTitle=$(".input-title")[0].value;
    let newBody=$('.input-body')[0].value;

    var requestUpdatePost = {
        "url": `https://jsonplaceholder.typicode.com/posts/${postNumber}`,
        "method": "PATCH",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify({"title":newTitle,"body":newBody}),
    };
    $.ajax(requestUpdatePost).done(function (updatePost) {
        clickCloseModify();
        changePost(updatePost);
    });
}

function changePost(updatePost){
    let editPost=$(`[id = ${updatePost.id}]`)[0];
    editPost.childNodes[0].innerHTML=updatePost.title;
    editPost.childNodes[1].innerHTML=updatePost.body;
}

function loadMorePost() {
    $(this).off('click', loadMorePost);
    $(this).remove();
    var request15MorePosts = {
        "url": `https://jsonplaceholder.typicode.com/posts?_start=${flag}&_limit=15`,
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(request15MorePosts).done(loadAllPosts);
}