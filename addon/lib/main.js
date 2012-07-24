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
  OS = 'mac'
  break;
}
//const customUrl = encodeURI(prefs.prototypeUrl.replace('%OS%', OS));
const customUrl = "file:///Users/bwinton/Programming/bookmarks/index.html";

var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://people.mozilla.com/~bwinton/australis-customization/images-win7/toolbarButton-customize.png",
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
  contentScript: 'self.port.on("bookmark", function (bookmark) {' +
                 '  window.alert(JSON.stringify(bookmark));' +
                 '})',
  onAttach: function(worker) {
    var folders = [];
    var search = places.bookmarks.search({
        onResult: function(result) {
            if (result.type == "folder") {
                if (!folders[result.folder]) folders[result.folder] = { bookmarks: [] };
                folders[result.folder].title = result.title || result.location;
            }
            else if (result.type == "bookmark") {
                var bookmark = {
                    folder: result.folder,
                    location: result.location,
                    title: result.title,
                    icon: result.icon
                }
                if (!folders[result.folder]) folders[result.folder] = { bookmarks: [] };
                folders[result.folder].bookmarks[result.position] = bookmark;
            }
        },
        onComplete: function() {
            folders.forEach(function(folder) {
                folder.bookmarks.forEach(function(bookmark) {
                    worker.port.emit("bookmark", {folder: folder.title, bookmark: bookmark.title});
                });
            });
        }
    });
  }
});