function getBookmarks(callback) {
  chrome.storage.local.get({ bookmarks: [] }, (result) => {
    callback(result.bookmarks);
  });
}

function checkIfAlreadyBookmarked(url, callback) {
  getBookmarks((bookmarks) => {
    const isBookmarked = bookmarks.some((bookmark) => bookmark.url === url);
    callback(isBookmarked);
  });
}

function updateIcon(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (!tab) {
      return;
    }

    const tabUrl = tab.url;
    checkIfAlreadyBookmarked(tabUrl, (isBookmarked) => {
      const iconPath = isBookmarked
        ? {
          16: "icons/icon16_dark.png",
          32: "icons/icon32_dark.png",
          48: "icons/icon48_dark.png",
          128: "icons/icon128_dark.png",
        }
        : {
          16: "icons/icon16.png",
          32: "icons/icon32.png",
          48: "icons/icon48.png",
          128: "icons/icon128.png",
        };
      chrome.action.setIcon({ path: iconPath });
    });
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    updateIcon(tabId);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  updateIcon(activeInfo.tabId);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "update_icon") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab) {
        updateIcon(activeTab.id);
      }
    });
  }
});

chrome.cookies.get({ url: 'https://wizarmark.vercel.app', name: 'token' }, (cookie) => {
  console.log(cookie)
})

chrome.cookies.onChanged.addListener((changeInfo) => {
  console.log(changeInfo)
})