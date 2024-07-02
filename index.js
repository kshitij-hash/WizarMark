document.getElementById('bookmarkForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addBookmark();
});

document.getElementById("close_btn").addEventListener('click', () => {
    window.close();
})

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

function checkIfAlreadyBookmarked(url, title, callback) {
    chrome.storage.local.get({ bookmarks: [] }, (result) => {
        const bookmarks = result.bookmarks || [];
        const isBookmarked = bookmarks.some(bookmark => bookmark.url === url || bookmark.title === title);
        callback(isBookmarked);
    });
}

function addBookmark() {
    const url = document.getElementById("urlInput").value;
    const title = document.getElementById('title').value;
    const favicon = document.getElementById('favicon').value;

    checkIfAlreadyBookmarked(url, title, (isBookmarked) => {
        if (isBookmarked) {
            alert('This URL is already bookmarked');
        } else {
            const bookmark = {
                url: url,
                title: title,
                faviconUrl: favicon
            };
            chrome.storage.local.get({ bookmarks: [] }, (result) => {
                const bookmarks = result.bookmarks || [];
                bookmarks.push(bookmark);

                chrome.storage.local.set({ bookmarks: bookmarks }, () => {
                    chrome.runtime.sendMessage({ action: 'update_icon' });
                    chrome.runtime.sendMessage({ action: 'added_bookmark' })
                    document.getElementById('urlInput').value = "";
                    document.getElementById('title').value = "";
                })
            })
        }
    })
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
    deleteIcon.innerHTML = `<span class="material-symbols-outlined">delete</span>`;
    deleteIcon.onclick = (e) => {
        e.stopPropagation();
        handleDelete(bookmark.url)
    }
    div2.appendChild(deleteIcon);
    listItem.appendChild(div2);

    return listItem;
}