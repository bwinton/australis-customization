define(function (require) {
  require(["jquery", "underscore", "backbone"], function($, _, Backbone) {

    var Button = Backbone.Model.extend({
      defaults: function() {
        return {
          type: "error",
          description: "Error button",
          shortcut: "Cmd-Error",
          label: "Error"
        };
      },

      initialize: function() {
        if (!this.get("title")) {
          this.set({"title": this.defaults.title});
        }
      },

    });

    var ButtonList = Backbone.Collection.extend({
      model: Button
    });

    var ButtonView = Backbone.View.extend({
      initialize: function (options) {
        this.collection.bind('add', this.addOne, this)
                       .bind('remove', this.removeOne, this)
                       .bind('reset', this.render, this);
      },
      addOne: function (model) {
        $('<li id="' + model.cid + '" class="item"><span class="title">' + model.get('title') + '</span></li>')
          .hide()
          .appendTo(this.el)
          .slideDown(300);
      },

      removeOne: function (model) {
        this.$('#' + model.cid).slideUp(300, function () {
          $(this).remove();
        });
      },
    });

    var MenuPanel = ButtonView.extend({
      buttonTmpl: _.template("<panel-button type='<%= type %>' " +
        "description='<%= description %>' shortcut='<%= shortcut %>'>" +
        "<%= label %></panel-button>"),

      render: function () {
        var self = this;
        var $el = $(this.el);

        // Empty element
        $el.html("");

        this.collection.each(function(model, i) {
          if (i % 3 == 0) {
            $el.append("<div class='panelToolbarIconsRow'>");
          }
          $el.children(":last-child").append(self.buttonTmpl(model.toJSON()));
        });
      }
    });

    var menuPanel = new MenuPanel({
      el: $('.panelToolbarIcons'),
      collection: new ButtonList([
        { type: "newWindow", description: "Open a new window",
          shortcut: "Ctrl+N", label: "New Window" },
        { type: "privateBrowsing", description: "Enter private browsing mode",
          shortcut: "Ctrl+Shift-P", label: "Guest Mode" },
        { type: "savePage", description: "Save the current page",
          shortcut: "Ctrl+S", label: "Save Page" },
        { type: "print", description: "Print the current page",
          shortcut: "Ctrl+P", label: "Print" },
        { type: "history", description: "Open a tab showing your history",
          shortcut: "Ctrl+Shift+H", label: "History" },
        { type: "fullScreen", description: "Expand the window to fill the screen",
          shortcut: "F11", label: "Full Screen" },
        { type: "find", description: "Find some words in the current page",
          shortcut: "Ctrl+F", label: "Find" },
        { type: "options", description: "Open Firefox’s options",
          shortcut: "Ctrl+O", label: "Preferences" },
        { type: "addons", description: "Open a panel to manage your add-ons",
          shortcut: "Ctrl+Shift+A", label: "Add-ons" }
        ])
    });
    menuPanel.render();

    var CustomizePanel = ButtonView.extend({
      buttonTmpl: _.template("<panel-button type='<%= type %>' " +
        "description='<%= description %>' shortcut='<%= shortcut %>'>" +
        "<%= label %></panel-button>"),

      render: function () {
        var self = this;
        var $el = $(this.el);

        // Empty element
        $el.children("toolbar-item").remove;

        this.collection.each(function(model, i) {
          if (i % 4 == 0) {
            $el.append("<div class='panelToolbarIconsRow'>");
          }
          $el.children(":last-child").append(self.buttonTmpl(model.toJSON()));
        });
      }
    });

    var customizePanel = new CustomizePanel({
      el: $('.customizeToolsArea'),
      collection: new ButtonList([
        { type: "share", description: "Share this item",
          shortcut: "F1", label: "Share" },
        { type: "bookmarks", description: "Open your bookmarks",
          shortcut: "Ctrl-Shift-B", label: "Bookmarks" },
        { type: "subscribe", description: "Who even uses RSS anymore?",
          shortcut: "Ctrl-Shift-B", label: "Subscribe" },
        { type: "reload", description: "Reload this page",
          shortcut: "Ctrl-R", label: "Reload" },
        { type: "stop", description: "Stop loading this page",
          shortcut: "Escape", label: "Stop" },
        { type: "home", description: "Go to your home page",
          shortcut: "Ctrl-H", label: "Home" },
        { type: "tabGroups", description: "Formerly Panorama",
          shortcut: "Ctrl-Shift-E", label: "tabGroups" },
        { type: "sync", description: "Now with BrowserID",
          shortcut: "Ctrl-Shift-B", label: "Sync" },
        { type: "openFile", description: "Open a file",
          shortcut: "Ctrl-F", label: "Open File" },
        { type: "developer", description: "Open the developer tools",
          shortcut: "Ctrl-Shift-J", label: "Developer" },
        { type: "encoding", description: "Choose your character encoding",
          shortcut: "Ctrl-Shift-?", label: "Encoding" }
        ]),
      buttonTmpl: _.template("<toolbar-item type='<%= type %>' " +
        "description='<%= description %>' shortcut='<%= shortcut %>'>" +
        "<%= label %></toolbar-item>")
    });
    customizePanel.render();

  });
});