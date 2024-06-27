document.getElementById('bookmarkForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addBookmark();
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        console.log(tabs);
        const activeTabUrl = activeTab.url;
        const activeTabTitle = activeTab.title;
        const activeTabFavIconUrl = activeTab.favIconUrl;
        document.getElementById('favicon').value = activeTabFavIconUrl;
        document.getElementById("title").value = activeTabTitle.toLowerCase();
        document.getElementById("urlInput").value = activeTabUrl;
    })
})

function checkIfAlreadyBookmarked(url, title) {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    for (const bookmark of bookmarks) {
        if (bookmark.url === url || bookmark.title === title) {
            return true;
        }
    }
    return false;
}

function addBookmark() {
    const url = document.getElementById("urlInput").value;
    const title = document.getElementById('title').value;
    const favicon = document.getElementById('favicon').value;

    if(checkIfAlreadyBookmarked(url, title)) {
        alert("This page is already bookmarked");
        return;
    }

    const bookmark = {
        url: url,
        title: title,
        faviconUrl: favicon
    };

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    bookmarks.push(bookmark);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    document.getElementById('urlInput').value = "";
    document.getElementById('title').value = "";

    showBookmarks();
}

function showBookmarks() {
    const bookmarkList = document.getElementById("bookmarkList");

    bookmarkList.innerHTML = "";

    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    for (const bookmark of bookmarks) {
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
        const editIcon = document.createElement('button')
        editIcon.textContent = "Edit";
        div2.appendChild(editIcon);

        const deleteIcon = document.createElement('button')
        deleteIcon.textContent = "Delete";
        deleteIcon.onclick = () => {
            handleDelete(bookmark.url)
        }
        div2.appendChild(deleteIcon);
        listItem.appendChild(div2);

        bookmarkList.appendChild(listItem);
        bookmarkList.appendChild(document.createElement("hr"));
    }
}

function handleDelete(url) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    bookmarks = bookmarks.filter(bookmark => bookmark.url !== url);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    showBookmarks();
}

showBookmarks();