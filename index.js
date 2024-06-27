document.getElementById('add_bookmark').addEventListener('click', addBookmark);
document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const activeTabUrl = activeTab.url;
        document.getElementById("urlInput").value = activeTabUrl;
    })
})

function addBookmark() {
    const url = document.getElementById("urlInput").value;

    if (!url) {
        alert("Please enter a website URL!");
        return;
    }

    const bookmark = {
        url: url,
        title: document.title || url 
    };

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    bookmarks.push(bookmark);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    document.getElementById("urlInput").value = "";

    showBookmarks();
}

function showBookmarks() {
    const bookmarkList = document.getElementById("bookmarkList");

    bookmarkList.innerHTML = "";

    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    for (const bookmark of bookmarks) {
        const listItem = document.createElement("li");
        listItem.innerText = bookmark.title;
        listItem.onclick = () => window.open(bookmark.url, "_blank");
        bookmarkList.appendChild(listItem);
    }
}
showBookmarks();