document.getElementById("bookmarkForm").addEventListener("submit", (e) => {
  e.preventDefault();
  addBookmark();
});

document.getElementById("close_btn").addEventListener("click", () => {
  window.close();
});


function getCurrentTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab) {
        resolve(tab);
      } else {
        reject(new Error("No active tab found"));
      }
    });
  });
}

function fetchPageContent(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: () => {
          return {
            title: document.title,
            content: document.body.innerText.substring(0, 1000), 
          };
        },
      },
      (results) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(results[0].result);
        }
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const tab = await getCurrentTab();
    const content = await fetchPageContent(tab.id);

    console.log("Content:", content);

    const activeTab = tab;
    const activeTabUrl = activeTab.url;
    const activeTabTitle = activeTab.title;
    const activeTabFavIconUrl = activeTab.favIconUrl;
    document.getElementById("favicon").value = activeTabFavIconUrl;
    document.getElementById("title").value = activeTabTitle.toLowerCase();
    document.getElementById("urlInput").value = activeTabUrl;

    // document.getElementById("contentDisplay").textContent =
    //   content.title + "\n\n" + content.content;
  } catch (error) {
    console.error("Error fetching page content:", error);
    // document.getElementById("contentDisplay").textContent =
    //   "Error fetching page content.";
  }
});


function checkIfAlreadyBookmarked(url, title, callback) {
  chrome.storage.local.get({ bookmarks: [] }, (result) => {
    const bookmarks = result.bookmarks || [];
    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.url === url || bookmark.title === title
    );
    callback(isBookmarked);
  });
}


function addBookmark() {
  const url = document.getElementById("urlInput").value;
  const title = document.getElementById("title").value;
  const favicon = document.getElementById("favicon").value;

  if (tags.length === 0 || !url || !title) {
    return;
  }

  checkIfAlreadyBookmarked(url, title, (isBookmarked) => {
    if (isBookmarked) {
      return;
    } else {
      const bookmark = {
        url: url,
        title: title,
        faviconUrl: favicon,
        dateAdded: Date.now(),
        tags: tags,
      };
      chrome.storage.local.get({ bookmarks: [] }, (result) => {
        const bookmarks = result.bookmarks || [];
        bookmarks.push(bookmark);
        console.log(bookmarks);

        chrome.storage.local.set({ bookmarks: bookmarks }, () => {
          chrome.runtime.sendMessage({ action: "update_icon" });
          chrome.runtime.sendMessage({ action: "added_bookmark" });
          document.getElementById("urlInput").value = "";
          document.getElementById("title").value = "";
          tagContainer.innerText = "no tags...";
        });
      });
    }
  });
}

const tagInput = document.getElementById("tags");
const tagContainer = document.getElementById("tag-container");
let tags = [];

tagInput.addEventListener("keydown", function (event) {
  const allowedCharacters = /^[a-zA-Z0-9_]*$/;
  if (event.key === " ") {
    event.preventDefault();
    const tag = tagInput.value.trim().toLowerCase();
    if (
      tag.startsWith("#") &&
      tag.length > 1 &&
      tag.length <= 12 &&
      allowedCharacters.test(tag.slice(1))
    ) {
      addTag(tag);
      tagInput.value = "";
    }
  }
});

tagInput.addEventListener("input", function () {
  if (!tagInput.value.startsWith("#")) {
    tagInput.value = "#" + tagInput.value.replace("#", "");
  }
});

function updateTagContainerText() {
  tagContainer.innerText = "no tags...";
}

function addTag(tag) {
  if (tag && !tags.includes(tag) && tags.length < 3) {
    if (tagContainer.innerText === "no tags...") {
      tagContainer.innerText = "";
    }
    tags.push(tag);
    if (tags.length >= 3) {
      tagInput.setAttribute("disabled", true);
    }

    const tagElement = document.createElement("div");
    tagElement.classList.add("tag");
    const tagText = document.createElement("p");
    tagText.innerText = tag;
    tagElement.appendChild(tagText);

    const closeButton = document.createElement("span");
    closeButton.id = "close_btn";
    closeButton.classList.add("material-symbols-outlined");
    closeButton.innerText = "close";
    closeButton.addEventListener("click", function () {
      removeTag(tag);
    });

    tagElement.appendChild(closeButton);
    tagContainer.appendChild(tagElement);
  }
}

function removeTag(tag) {
  const index = tags.indexOf(tag);
  if (index > -1) {
    tags.splice(index, 1);
    if (tags.length < 3) {
      tagInput.removeAttribute("disabled");
    }
    const tagElements = document.querySelectorAll(".tag");
    tagElements.forEach((tagElement) => {
      if (tagElement.innerText.startsWith(tag)) {
        tagContainer.removeChild(tagElement);
      }
    });
    if (tags.length === 0) {
      updateTagContainerText();
    }
  }
}
