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
  cmd = message.cmd
  key = message.key
  val = message.val
  console.log("message " + cmd + ":" + key + ":" + val)
  if (cmd == "set") {
    switch (key) {
      case "command":
        document.getElementById("button-use-command-as-" + val).click()
        cmd_save("command-persistence", val)
        break;
      case "streaming":
        aFunc(val)
        cmd_save("streaming-persistence", val)
        break
      case "screen":
        document.getElementsByClassName("button-settings-resolution-" + val)[0].click()
        cmd_save("screen-persistence", val)
        break;
      case "menubar":
        if (val == "show") {
          document.getElementById("toolbar-content").style.height = "45px"
          document.getElementById("toolbar-content").style.display = ""
        } else if (val == "hide") {
          document.getElementById("toolbar-content").style.height = "0px"
          document.getElementById("toolbar-content").style.display = "none"
        }
        cmd_save("menubar-persistence", val)
    }
  } else if (cmd == "get") {
    cmd_load(key + "-persistence", function (value) {
      callback(value)
    })
  }
}


function cmd_load(key, func) {
  val = localStorage.getItem(key)
  func(val)
}

function cmd_save(key, val) {
  localStorage.setItem(key, val)
}

function init() {
  cmd_load("command-persistence", function (value) {
    if (value == "meta" || value == "control") {
      gotMessage({ "cmd": "set", "key": "command", "val": value })
    }
  });

  cmd_load("streaming-persistence", function (value) {
    if (value == "smooth" || value == "sharp") {
      gotMessage({ "cmd": "set", "key": "streaming", "val": value })
    }
  });

  cmd_load("screen-persistence", function (value) {
    if (value == "keep" || value == "auto") {
      gotMessage({ "cmd": "set", "key": "screen", "val": value })
    }
  });

  cmd_load("menubar-persistence", function (value) {
    if (value == "show" || value == "hide") {
      gotMessage({ "cmd": "set", "key": "menubar", "val": value })
    }
  });
}

// レンダリング完了まで待つ
function waitForElement(callback, intervalMs, timeoutMs) {
  const startTimeInMs = Date.now();
  findLoop();

  function findLoop() {
    if (document.getElementsByClassName("button-settings")[0] != null &&
      document.getElementsByClassName("button-settings")[0].disabled != false) {
      callback();
      return;
    } else {
      console.log("waiting " + intervalMs)
      setTimeout(() => {
        if (timeoutMs && Date.now() - startTimeInMs > timeoutMs) return;
        findLoop();
      }, intervalMs);
    }
  }
}

waitForElement(function () { init() }, 3000, 600000)