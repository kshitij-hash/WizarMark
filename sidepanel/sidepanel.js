function createBookmarkListItem(bookmark) {
    const listItem = document.createElement("li");

    const div = document.createElement("div");
    div.classList.add("bookmark-item");

    const faviconImg = document.createElement("img");
    faviconImg.src = bookmark.faviconUrl;
    faviconImg.alt = "favicon";
    faviconImg.style.width = "20px";
    faviconImg.style.height = "20px";

    div.appendChild(faviconImg);

    const anchor = document.createElement("a");
    anchor.href = bookmark.url;
    anchor.target = "_blank";

    const container = document.createElement("div");
    container.className = "bookmark-title";

    anchor.textContent = bookmark.title;
    container.appendChild(anchor);

    const container2 = document.createElement("div");
    container2.className = "bookmark-details";

    const tags = document.createElement("div");
    tags.className = "tag-container";

    for (const tag of bookmark.tags) {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        const tagText = document.createElement('p');
        tagText.innerText = tag;
        tagElement.appendChild(tagText);

        tags.appendChild(tagElement);
    }

    container2.appendChild(tags);

    const dateAdded = document.createElement("span");
    let date = new Date(bookmark.dateAdded).toDateString();
    date = date.split(" ").slice(1).join(" ");
    dateAdded.textContent = date;
    container2.appendChild(dateAdded);

    container.appendChild(container2);
    div.appendChild(container);

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
            const noBookmarks = document.createElement("p");
            noBookmarks.textContent = "no bookmarks saved...";
            noBookmarks.style.textAlign = "center";
            noBookmarks.style.marginTop = "15%";
            bookmarkList.appendChild(noBookmarks);
            return;
        }

        bookmarks.sort((a, b) => b.dateAdded - a.dateAdded);
        console.log(bookmarks)
        for (let i = 0; i < bookmarks.length; i++) {
            const listItem = createBookmarkListItem(bookmarks[i]);
            bookmarkList.appendChild(listItem);
        }
    });
}
showBookmarks();

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

document.getElementById('search').addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const bookmarkList = document.getElementById("bookmarkList");
    const items = bookmarkList.querySelectorAll('li');
    const noResultMessage = document.getElementById('no-result-message');

    let found = false;

    items.forEach(item => {
        const title = item.querySelector('.bookmark-item span').textContent;
        const url = item.querySelector('.bookmark-item a').href;

        if (title.includes(search) || url.includes(search)) {
            item.style.display = 'flex';
            found = true;
        } else {
            item.style.display = 'none';
        }

        if (found) {
            noResultMessage.style.display = 'none';
        } else {
            noResultMessage.style.display = 'block';
        }
    })
})

document.getElementById('fetch_bookmarks').addEventListener('click', () => {
    getBookMarks();
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
                                faviconUrl: favicon,
                                dateAdded: subBookmark.dateAdded
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
                        faviconUrl: favicon,
                        dateAdded: bookmark.dateAdded
                    }
                    BOOKMARKS.push(bookmarkItem)
                }
            }
        }
    }
    chrome.storage.local.get({ bookmarks: [] }, (result) => {
        const existingBookmarks = result.bookmarks || [];
        const newBookmarks = []

        for (const bookmark of BOOKMARKS) {
            const exists = existingBookmarks.some(existing => existing.url === bookmark.url || existing.title === bookmark.title)
            if (!exists) {
                newBookmarks.push(bookmark)
            }
        }

        const updatedBookmarks = [...existingBookmarks, ...newBookmarks]
        chrome.storage.local.set({ bookmarks: updatedBookmarks }, () => {
            showBookmarks();
        })
    })
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'added_bookmark' || request.action === 'deleted_bookmark') {
        showBookmarks();
    }
});