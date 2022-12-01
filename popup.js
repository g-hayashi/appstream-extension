function send(key, val, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs[0].url.includes('appstream2')) {
      return
    }
    chrome.tabs.sendMessage(tabs[0].id, { "key": key, "val": val }, callback);
  });
  // https://qiita.com/kmagai/items/95481a3b9fd97e4616c9
  chrome.storage.local.set({ [key]: val }, function () {
  })
}

function config_load(key, func) {
  chrome.storage.local.get(key, function (config) {
    func(config[key])
  });
}

document.getElementById('command-control').addEventListener("click",
  function () { send("command", "control") });

document.getElementById('command-meta').addEventListener("click",
  function () { send("command", "meta") });

document.getElementById('streaming-smooth').addEventListener("click",
  function () { send("streaming", "smooth") });

document.getElementById('streaming-sharp').addEventListener("click",
  function () { send("streaming", "sharp") });

document.getElementById('screen-auto').addEventListener("click",
  function () { send("screen", "auto") });

document.getElementById('screen-keep').addEventListener("click",
  function () { send("screen", "keep") });

document.getElementById('menu-visible').addEventListener("click",
  function () { send("menu", "visible") });

document.getElementById('menu-hidden').addEventListener("click",
  function () { send("menu", "hidden") });

document.getElementById('init').addEventListener("click",
  function () { send("init", "") });

config_load("command", function (value) {
  if (value == "meta" || value == "control") {
    document.getElementById("command-" + value).checked = true;
  }
});

config_load("streaming", function (value) {
  if (value == "smooth" || value == "sharp") {
    document.getElementById("streaming-" + value).checked = true;
  }
});

config_load("screen", function (value) {
  if (value == "keep" || value == "auto") {
    document.getElementById("screen-" + value).checked = true;
  }
});

config_load("menu", function (value) {
  if (value == "visible" || value == "hidden") {
    document.getElementById("menu-" + value).checked = true;
  }
});
