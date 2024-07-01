const BOOKMARKS = JSON.parse(localStorage.getItem("bookmarks")) || [];

function createBookmarkListItem(bookmark) {
    const listItem = document.createElement("li");

    const div = document.createElement("div");
    div.classList.add("bookmark-item");

    const faviconImg = document.createElement("img");
    faviconImg.src = bookmark.faviconUrl;
    faviconImg.alt = "favicon";
    faviconImg.style.width = "16px";
    faviconImg.style.height = "16px";

    div.appendChild(faviconImg);

    const anchor = document.createElement("a");
    anchor.href = bookmark.url;
    anchor.target = "_blank";

    const title = document.createElement("span");
    title.textContent = bookmark.title;
    anchor.appendChild(title);
    div.appendChild(anchor);
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
        
        if(title.includes(search) || url.includes(search)) {
            item.style.display = 'flex';
            found = true;
        } else {
            item.style.display = 'none';
        }
        
        if(found) {
            noResultMessage.style.display = 'none';
        } else {
            noResultMessage.style.display = 'block';
        }
    })
})