const pageMod = require('page-mod');
const places = require('places');
const prefs = require('simple-prefs').prefs;
const tabs = require('tabs');
const runtime = require('runtime');
const utils = require('api-utils/window-utils');
const widgets = require('widget');

var OS = 'linux';
switch (runtime.OS){
case 'WINNT':
  OS = 'windows';
  break;
case 'Darwin':
  OS = 'mac';
  break;
}
const customUrl = encodeURI(prefs.prototypeUrl.replace('%OS%', OS));

var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://people.mozilla.com/~bwinton/australis/customization/mac/images/toolbarButton-menu.png",
  onClick: function() {
    // Remove the location bar from the page.
    var whitelist = customUrl.toLowerCase();

    let active = utils.activeBrowserWindow.XULBrowserWindow;
    if (active.inContentWhitelist.indexOf(whitelist) == -1)
      active.inContentWhitelist.push(whitelist);

    // Open the page in a new tab.
    tabs.open(customUrl);
  }
});

var aboutHomeSearch = pageMod.PageMod({
  include: [customUrl],
  contentScriptWhen: 'ready',
  contentScript: 'document.addEventListener("tpemit", function(e) {self.port.emit("tp", e); return true;});',
  onAttach: function(worker) {
    worker.port.on('tp', function(data) {console.log(data);});
  }
});