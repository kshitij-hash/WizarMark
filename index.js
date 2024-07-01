document.getElementById('bookmarkForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addBookmark();
});
document.getElementById('fetch_bookmarks').addEventListener('click', () => {
    getBookMarks();
})
document.getElementsByClassName("material-symbols-outlined")[0].addEventListener('click', () => {
    window.close();
})

function getFavicon(url) {
    return `https://www.google.com/s2/favicons?domain=${url}`;
}

const getBookMarks = async () => {
    const bookmarkTree = await chrome.bookmarks.getTree();
    const children = bookmarkTree[0].children;
    const BOOKMARKS = []

    for (const child of children) {
        if (child.children.length > 0) {
            for (const bookmark of child.children) {
                if (bookmark.url === undefined) {
                    if (bookmark.children.length > 0) {
                        for (const subBookmark of bookmark.children) {
                            const domain = new URL(subBookmark.url).hostname;
                            const favicon = getFavicon(domain)
                            const bookmarkItem = {
                                url: subBookmark.url,
                                title: subBookmark.title.toLowerCase(),
                                faviconUrl: favicon
                            }
                            BOOKMARKS.push(bookmarkItem)
                        }
                    }
                }
                else {
                    const domain = new URL(bookmark.url).hostname;
                    const favicon = getFavicon(domain)
                    const bookmarkItem = {
                        url: bookmark.url,
                        title: bookmark.title.toLowerCase(),
                        faviconUrl: favicon
                    }
                    BOOKMARKS.push(bookmarkItem)
                }
            }
        }
    }
    localStorage.setItem("bookmarks", JSON.stringify(BOOKMARKS));
    showBookmarks();
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
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

    if (checkIfAlreadyBookmarked(url, title)) {
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

    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (bookmarks.length === 0) {
        bookmarkList.innerHTML = "no bookmarks added yet...";
        return;
    } else {
        bookmarkList.innerHTML = "";
    }

    for (let i = 0; i < 3; i++) {
        const listItem = createBookmarkListItem(bookmarks[i]);
        bookmarkList.appendChild(listItem);
    }
}

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

function handleDelete(url) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    bookmarks = bookmarks.filter(bookmark => bookmark.url !== url);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    showBookmarks();
}

showBookmarks();