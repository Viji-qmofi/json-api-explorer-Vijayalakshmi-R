// script.js

const API_URL = "https://jsonplaceholder.typicode.com/posts";

const postList = document.getElementById("postList");
const fetchButton = document.getElementById("fetchButton");
const postForm = document.getElementById("postForm");
const formError = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");
const errorDiv = document.getElementById("error");

// -------------------------------
// Create a container for Fetch + Filter controls
// -------------------------------
const postsSection = document.querySelector("section:last-of-type");

// Create a wrapper div for layout
const controlContainer = document.createElement("div");
controlContainer.style.display = "flex";
controlContainer.style.alignItems = "center";
controlContainer.style.gap = "10px"; // space between items
controlContainer.style.marginBottom = "10px";

let allPosts = [];

// -------------------------------
//  Create filter input + button dynamically
// -------------------------------
const filterInput = document.createElement("input");
filterInput.type = "text";
filterInput.id = "filterInput";
filterInput.placeholder = "Filter posts by keyword...";
filterInput.style.padding = "5px";

const filterButton = document.createElement("button");
filterButton.id = "filterButton";
filterButton.textContent = "Filter";
filterButton.style.padding = "5px 10px";

// Add Fetch + Filter controls side by side
controlContainer.appendChild(fetchButton);
controlContainer.appendChild(filterInput);
controlContainer.appendChild(filterButton);

// Insert the new container before the post list
postsSection.insertBefore(controlContainer, postList);

// -------------------------------
// 1️. Fetch and display posts
// -------------------------------
async function fetchPosts() {
  postList.innerHTML = "Loading posts...";
  errorDiv.textContent = "";
  try {
      const response = await fetch(API_URL);
      if (!response.ok) 
        throw new Error("Failed to fetch posts");
      const posts = await response.json();
      allPosts = posts.slice(0, 10); // show first 10 posts
      renderPosts(allPosts);
    } catch(error) {
      postList.innerHTML = "";
      errorDiv.textContent = "Error loading posts: " + error.message;
    };
}

//1.  Display posts on the page
function renderPosts(posts) {
  postList.innerHTML = "";
  posts.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.style.border = "1px solid#ccc";
    div.style.padding = "10px";
    div.style.margin = "10px 0";

    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <button class="delete-btn" data-id="${post.id}">Delete</button>
      <button class="edit-btn" data-id="${post.id}">Edit</button>
    `;

    postList.appendChild(div);
  });
}

// -------------------------------
// 2️. Create and send a new post
// -------------------------------
postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  formSuccess.textContent = "Submitting post...";

  const title = document.getElementById("titleInput").value.trim();
  const body = document.getElementById("bodyInput").value.trim();

  if (!title || !body) {
    formError.textContent = " Both title and body are required.";
    formSuccess.textContent = "";
    return;
  }
  try{
      const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId: 1 })
      });
    
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      const data = await response.json();
      formSuccess.innerHTML = ` Post created!<br>Title: ${data.title}<br>Body: ${data.body}`;
      postForm.reset();

      // Add new post to top of the list
      allPosts.unshift(data);
      renderPosts(allPosts);
 } catch(error) {
      formSuccess.textContent = "";
      formError.textContent = "Error: " + error.message;
    };
});

// -------------------------------
// 3️. Delete a post
// -------------------------------
postList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const postId = e.target.getAttribute("data-id");
  try {
    const response = await fetch(`${API_URL}/${postId}`, { method: "DELETE" });
      if (!response.ok) {
          throw new Error("Failed to delete post");
        }
        // Remove from local array + refresh view
        allPosts = allPosts.filter(post => post.id != postId);
        renderPosts(allPosts);
      }catch(error){ 
            alert("Error deleting post: " + error.message);
      }
}
});

// -------------------------------
// 4. Edit a post using PUT
// -------------------------------
postList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const postId = e.target.getAttribute("data-id");
    const post = allPosts.find(p => p.id == postId);

    const editDiv = document.createElement("div");
    editDiv.innerHTML = `
      <input type="text" id="editTitle" value="${post.title}" style="margin:5px; padding:4px;">
      <textarea id="editBody" rows="3" style="margin:5px; padding:4px;">${post.body}</textarea>
      <button id="saveEdit">Save</button>
      <button id="cancelEdit">Cancel</button>
    `;
    e.target.parentElement.appendChild(editDiv);

    // Save edit
    editDiv.querySelector("#saveEdit").addEventListener("click", async () => {
      const updatedTitle = editDiv.querySelector("#editTitle").value.trim();
      const updatedBody = editDiv.querySelector("#editBody").value.trim();

      if (!updatedTitle || !updatedBody) {
        alert("Both title and body are required!");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: postId,
            title: updatedTitle,
            body: updatedBody,
            userId: post.userId
          })
        });

        if (!response.ok) throw new Error("Failed to update post");

        const updatedPost = await response.json();
        const index = allPosts.findIndex(p => p.id == postId);
        allPosts[index] = updatedPost;
        renderPosts(allPosts);
      } catch (error) {
        alert("Error updating post: " + error.message);
      }
    });


    // Cancel Edit
    editDiv.querySelector("#cancelEdit").addEventListener("click", () => {
      editDiv.remove();
    });
  }
});


// -------------------------------
// 5. Filter posts by keyword (button click)
// -------------------------------
filterButton.addEventListener("click", function () {
  const keyword = filterInput.value.toLowerCase();

  if (!keyword) {
    renderPosts(allPosts); // show all if empty
    return;
  }

  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(keyword) ||
    post.body.toLowerCase().includes(keyword)
  );

  renderPosts(filteredPosts);
});

// -------------------------------
// 6. Fetch posts when button clicked
// -------------------------------
fetchButton.addEventListener("click", fetchPosts);
