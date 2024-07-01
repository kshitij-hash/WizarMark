const BOOKMARKS = JSON.parse(localStorage.getItem("bookmarks")) || [];

function createBookmarkListItem(bookmark) {
    const listItem = document.createElement("li");

    const div = document.createElement("div");
    div.classList.add("bookmark-item");
    div.onclick = () => window.open(bookmark.url, "_blank");

    const faviconImg = document.createElement("img");
    faviconImg.src = bookmark.faviconUrl;
    faviconImg.alt = "favicon";
    faviconImg.style.width = "16px";
    faviconImg.style.height = "16px";

    div.appendChild(faviconImg);

    const title = document.createElement("span");
    title.textContent = bookmark.title;
    div.appendChild(title);
    listItem.appendChild(div);

    const div2 = document.createElement("div");
    div2.classList.add("bookmark-actions");

    const deleteIcon = document.createElement('button')
    deleteIcon.innerHTML =  `<span class="material-symbols-outlined">delete</span>`;
    deleteIcon.onclick = () => {
        handleDelete(bookmark.url)
    }
    div2.appendChild(deleteIcon);
    listItem.appendChild(div2);

    return listItem;
}

function showBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    const bookmarkList = document.getElementById("bookmarkList");

    for (const bookmark of bookmarks) {
        const bookmarkElement = createBookmarkListItem(bookmark);
        bookmarkList.appendChild(bookmarkElement);
    }
}
showBookmarks();