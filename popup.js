function cmd_send(cmd, key, val, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs[0].url.includes('appstream2')) {
      return
    }
    chrome.tabs.sendMessage(tabs[0].id, { "cmd": cmd, "key": key, "val": val }, callback);
  });
}

function cmd_load(key, func) {
  val = localStorage.getItem(key)
  console.log('Value currently is ' + val);
  func(val)
}

document.getElementById('command-control').addEventListener("click",
  function () {
    cmd_send("set", "command", "control")
  });

document.getElementById('command-meta').addEventListener("click",
  function () {
    cmd_send("set", "command", "meta")
  });

document.getElementById('streaming-smooth').addEventListener("click",
  function () {
    cmd_send("set", "streaming", "smooth")
  });

document.getElementById('streaming-sharp').addEventListener("click",
  function () {
    cmd_send("set", "streaming", "sharp")
  });

document.getElementById('screen-auto').addEventListener("click",
  function () {
    cmd_send("set", "screen", "auto")
  });

document.getElementById('screen-keep').addEventListener("click",
  function () {
    cmd_send("set", "screen", "keep")
  });

document.getElementById('menubar-show').addEventListener("click",
  function () {
    cmd_send("set", "menubar", "show")
  });

document.getElementById('menubar-hide').addEventListener("click",
  function () {
    cmd_send("set", "menubar", "hide")
  });


cmd_send("get", "command", "", function (value) {
  if (value == "meta" || value == "control") {
    document.getElementById("command-" + value).checked = true;
  }
});

cmd_send("get", "streaming", "", function (value) {
  if (value == "smooth" || value == "sharp") {
    document.getElementById("streaming-" + value).checked = true;
  }
});

cmd_send("get", "screen", "", function (value) {
  if (value == "keep" || value == "auto") {
    document.getElementById("screen-" + value).checked = true;
  }
});

cmd_send("get", "menubar", "", function (value) {
  if (value == "show" || value == "hide") {
    document.getElementById("menubar-" + value).checked = true;
  }
});
