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
                faviconUrl: favicon,
                dateAdded: Date.now()
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