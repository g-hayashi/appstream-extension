chrome.runtime.onMessage.addListener(gotMessage)

const sleep = waitTime => new Promise(resolve => setTimeout(resolve, waitTime));
const aFunc = async function (val) {
  document.getElementsByClassName("button-settings-streaming-mode")[0].click()
  await sleep(200);
  document.getElementById("streaming-mode-" + val).click()
  await sleep(200);
  document.getElementsByClassName("button-settings-streaming-mode")[0].click()
}


function gotMessage(message, sender, callback) {
  key = message.key; val = message.val
  switch (key) {
    case "command":
      document.getElementById("button-use-command-as-" + val).click()
      break;
    case "streaming":
      aFunc(val)
      break
    case "screen":
      document.getElementsByClassName("button-settings-resolution-" + val)[0].click()
      break;
    case "init":
      init()
      break;
  }
}


function config_load(key, func) {
  chrome.storage.local.get(key, function (config) {
    func(config[key])
  });
}


function init() {
  config_load("command", function (value) {
    if (value == "meta" || value == "control") {
      gotMessage({ "key": "command", "val": value })
    }
  });

  config_load("streaming", function (value) {
    if (value == "smooth" || value == "sharp") {
      gotMessage({ "key": "streaming", "val": value })
    }
  });

  config_load("screen", function (value) {
    if (value == "keep" || value == "auto") {
      gotMessage({ "key": "screen", "val": value })
    }
  });

}

// レンダリング完了まで待つ
function waitForElement(callback, intervalMs, timeoutMs) {
  const startTimeInMs = Date.now();
  findLoop();

  function findLoop() {
    if (document.getElementById("streaming-status") != null &&
      document.getElementById("streaming-status").getAttribute("data-is-streaming-ready") == "true") {
      sleep(10000)
      console.log("made a callback ")
      callback();
      return;
    } else {
      setTimeout(() => {
        if (timeoutMs && Date.now() - startTimeInMs > timeoutMs) {
          console.log("timeout " + timeoutMs + " ms")
          return;
        }
        findLoop();
      }, intervalMs);
    }
  }
}

waitForElement(function () { init() }, 5000, 500000)