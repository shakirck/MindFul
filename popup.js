chrome.runtime.sendMessage({ command: "getTimeSpent" }, function (response) {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError, "error ");
  } else {
    let timeSpent = response.timeSpent;
    updateUI(timeSpent);
  }
});

function updateUI(timeSpent) {
  try {
    const list = document.querySelector('.list');

  // Clear existing list
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  // Update list with latest timeSpent data
  if(!timeSpent){ return}
  for (let url in timeSpent) {
    if(!url || !timeSpent[url]){continue}
    let row = document.createElement('li');
    row.classList.add('elem', 'card');

    let img = document.createElement('img');
    img.src = timeSpent[url].favicon;
    img.alt = '';
    row.appendChild(img);

    let details = document.createElement('div');
    details.classList.add('tab-details');
    let title = document.createElement('div');
    title.textContent = timeSpent[url].title;
    let link = document.createElement('a');
    link.href = url;
    link.textContent = url;
    details.appendChild(title);
    details.appendChild(link);
    row.appendChild(details);

    let time = document.createElement('div');
    time.textContent = `${Math.floor(timeSpent[url].time / 60)}m ${timeSpent[url].time % 60}s`;
    row.addEventListener('click', function () {
      chrome.tabs.update(timeSpent[url].tabId, { active: true });
    });
    row.appendChild(time);
    time.classList.add('time');

    list.appendChild(row);
  }
  } catch (error) {
   console.log("*****") 
  }
}


function updatePopup() {
try {
  chrome.runtime.sendMessage({command: "getTimeSpent"}, function(response) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      // The extension context is invalid, so clear the interval
      clearInterval(intervalId);
    } else {
      let timeSpent = response.timeSpent;
      updateUI(timeSpent);
    }
  });
} catch (error) {
  console.log("&&&&&&&&")
}
}

let intervalId = setInterval(function() {
  if (chrome.runtime && chrome.runtime.sendMessage) {
    updatePopup();
  } else {
    clearInterval(intervalId);
  }
}, 5000);


browser.runtime.connect().onDisconnect.addListener(function() {
  console.log("disconnected");
})