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
    deleteIcon.innerHTML = `<span class="material-symbols-outlined">delete</span>`;
    deleteIcon.onclick = (e) => {
        e.stopPropagation();
        handleDelete(bookmark.url)
    }
    div2.appendChild(deleteIcon);
    listItem.appendChild(div2);

    return listItem;
}

function showBookmarks() {
    const bookmarkList = document.getElementById("bookmarkList");

    chrome.storage.local.get({ bookmarks: [] }, (result) => {
        const bookmarks = result.bookmarks || [];
        bookmarkList.innerHTML = "";

        if (bookmarks.length === 0) {
            bookmarkList.innerHTML = "no bookmarks added yet...";
            return;
        }

        for (let i = 0; i < bookmarks.length; i++) {
            const listItem = createBookmarkListItem(bookmarks[i]);
            bookmarkList.appendChild(listItem);
        }
    });
}
showBookmarks();