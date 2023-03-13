let currentTabId = null;
let currentUrl = null;
let timeSpent = {};
let timerInterval = null;

 chrome.tabs.onActivated.addListener(function (activeInfo) {
  try {
    let tabId = activeInfo.tabId;

    chrome.tabs.get(tabId, function (tab) {
      currentTabId = tabId;
      currentUrl = tab.url;

       if (!timeSpent[currentUrl]) {
        if (currentUrl === undefined) { return }
        timeSpent[currentUrl] = { time: 0, title: tab.title, favicon: faviconURL(currentUrl), tabId: currentTabId };
        console.log(timeSpent, "****", currentUrl, tab.title)
      }

       clearInterval(timerInterval);
      timerInterval = setInterval(function () {
        timeSpent[currentUrl].time += 5;
        chrome.action.setBadgeText({ text: timeSpent[currentUrl].time.toString(), tabId: currentTabId });
        chrome.action.setBadgeBackgroundColor({ color: '#3b5998', tabId: currentTabId });
      }, 5000);
    });
  } catch (error) {
    console.log('4r89343jdffjsdkfjdksfjksdfjksdj')
  }
});

 chrome.tabs.onActivated.addListener(function (activeInfo) {
  try {
    let tabId = activeInfo.tabId;

    if (tabId !== currentTabId) {
      clearInterval(timerInterval);
      chrome.action.setBadgeText({ text: '', tabId: currentTabId });
    }
  } catch (error) {
    console.log("kdsfjksdfjksdfjksdjfkj")
  }
});

 chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  try {
    if (tabId === currentTabId && changeInfo.url && changeInfo.url !== currentUrl) {
      clearInterval(timerInterval);
      chrome.action.setBadgeText({ text: '', tabId: currentTabId });

       if (!timeSpent[changeInfo.url]) {
        console.log("new url", changeInfo.url, tab.title)
        timeSpent[changeInfo.url] = { time: 0, title: tab.title, favicon: faviconURL(changeInfo.url), tabId: currentTabId };
      }

       currentUrl = changeInfo.url;
      timerInterval = setInterval(function () {
        timeSpent[currentUrl].time += 5;
        chrome.action.setBadgeText({ text: timeSpent[currentUrl].toString(), tabId: currentTabId });
        chrome.action.setBadgeBackgroundColor({ color: '#3b5998', tabId: currentTabId });
      }, 5000);
    }

  } catch (error) {
    console.log("kdsfjksdfjksdfjksdjfadfdsafdfdfsfsds324e324324324324324ffddssfkj");
  }

});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    if (request.command === "getTimeSpent") {
      sendResponse({ timeSpent: timeSpent });
    }
  } catch (error) {
    console.log("))))))))))))))))))")
  }
});



function faviconURL(u) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", "32");
  return url.toString();
}