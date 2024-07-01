const [tab] = await chrome.tabs.query({
    active: true
});

const tabId = tab.id;
const button = document.getElementById('sidepanel_btn');
button.addEventListener('click', async () => {
    window.close();
    await chrome.sidePanel.open({ tabId });
    await chrome.sidePanel.setOptions({
        tabId,
        path: 'sidepanel.html',
        enabled: true
    });
});