// so much empty
const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("titleInput");
const bodyInput = document.getElementById("bodyInput");
const formError = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");
const fetchButton = document.getElementById("fetchButton");
const erreor = document.getElementById("error");
const postList = document.getElementById("postList");




//Fetchand display Posts
fetchButton.addEventListener("click",() =>{
     
      fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response =>{
            if (!response.ok) {
                  throw new Error("HTTP Error: ${response.status}");
            }
            return response.json();
      })
      .then(posts => {
            postList.innerHTML = "";

            posts.forEach(post => {
             
                  const div = document.createElement("div");
                  div.innerHTML = `<p><h3>${post.title}</h3></p><p>${post.body}</p>`;
                  
                  postList.appendChild(div);
            });
      });
});

// Create and send a new post
postForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formError.textContent = "";
      formSuccess.textContent = "Submitting the post";

      const title = titleInput.value;
      const body = bodyInput.value;

      fetch("https://jsonplaceholder.typicode.com/posts", {
            method : "POST",
            headers : { "Content-Type": "application/json" },
            body : JSON.stringify({
                  title : title,
                  body : body,
                  userId : 1
            })

      })
      .then(response => {
            if (!response.ok) {
                  throw new Error("Failed to create post");
            }
       return response.json();
      })
      .then(data =>{
         formSuccess.innerHTML = `<br/>Post created!<br>Title: ${data.title}<br>Body: ${data.body}`; 
         postForm.reset();  
      })
      .catch(error => {
         formSuccess.textContent = "";
      formError.textContent = "Error: " + error.message;    
      });
      

});