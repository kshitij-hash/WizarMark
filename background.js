console.log("Background script running!");

chrome.action.onClicked.addListener(() => {
    alert("Hello from the background script!");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        console.log(url);
        chrome.runtime.sendMessage({ url }); // Send URL to popup script
    });
});