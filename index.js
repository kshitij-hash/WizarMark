document.getElementById('bookmarkForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addBookmark();
});
document.getElementById('fetch_bookmarks').addEventListener('click', () => {
    getBookMarks();
})
document.getElementById("close_btn").addEventListener('click', () => {
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
    chrome.storage.local.get({ bookmarks: [] }, (result) => {
        const existingBookmarks = result.bookmarks || [];
        const newBookmarks = []

        for(const bookmark of BOOKMARKS) {
            const exists = existingBookmarks.some(existing => existing.url === bookmark.url || existing.title === bookmark.title)
            if(!exists) {
                newBookmarks.push(bookmark)
            }
        }

        const updatedBookmarks = [...existingBookmarks, ...newBookmarks]
        chrome.storage.local.set({ bookmarks: updatedBookmarks }, () => {
            showBookmarks();
        })
    })
}

document.getElementById('delete_btn').addEventListener('click', () => {
    chrome.storage.local.set({ bookmarks: [] }, () => {
        showBookmarks();
    })
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
                    document.getElementById('urlInput').value = "";
                    document.getElementById('title').value = "";

                    showBookmarks();
                })
            })
        }
    })
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

        for (const bookmark of bookmarks) {
            const listItem = createBookmarkListItem(bookmark);
            bookmarkList.appendChild(listItem);
        }
    });
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

function handleDelete(url) {
    chrome.storage.local.get({ bookmarks: [] }, (result) => {
        let bookmarks = result.bookmarks || [];
        bookmarks = bookmarks.filter(bookmark => bookmark.url !== url);

        chrome.storage.local.set({ bookmarks: bookmarks }, () => {
            chrome.runtime.sendMessage({ action: 'update_icon' });
            showBookmarks();
        });
    });
}

showBookmarks();