var requestAllPosts = {
    "url": "https://jsonplaceholder.typicode.com/posts",
    "method": "GET",
    "timeout": 0,
};
$.ajax(requestAllPosts).done(function loadAllPosts(allPosts) {
    allPosts.forEach(element => {
        let divPost=($(`<div class='div-list'></div>`));
        let divInfoPost =($(`<div class='div-info' userid='${element.userId}' postid='${element.id}'></div>`));
        divInfoPost.on("click", clickPost);
        let postTitle=($(`<h3>${element.title}</h3>`));
        divInfoPost.append(postTitle);
        let postBody=($(`<div>${element.body}</div>`));
        divInfoPost.append(postBody);

        divPost.append(divInfoPost)

        let modifyBTN=($(`<button>modify</button>`));
        divPost.append(modifyBTN);

        let deleteBTN=($(`<button>delete</button>`));
        divPost.append(deleteBTN);

        $("#postList").append(divPost);
    });
});

function clickPost(){
    console.log($(this));
}

// $("main").on("click", function(e){
    
//     console.log(e.target);
//     // var requestUserOfPost = {
//     //     "url": "https://jsonplaceholder.typicode.com/users?id=1",
//     //     "method": "GET",
//     //     "timeout": 0,
//     //     };
//     //     $.ajax(requestUserOfPost).done(function (response) {
//     //     console.log(response);
//     //     });

// })