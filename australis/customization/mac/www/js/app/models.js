define(["jquery", "underscore", "backbone", "jquery-ui"], function($, _, Backbone) {

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
    buttonTmpl: _.template(
      "<div class='menuPanelButton <%= type %>'" +
      "     title='<%= description %>  (<%= shortcut %>)'>" +
      "  <div style='background-image: url(\"images/button-<%= type %>.png\")'" +
      "       class='button'></div>" +
      "  <div class='label'><%= label %></div>" +
      "</div>"),

    buttonDragOpts: {
      disabled: true,
      containment: '.windowOuterContainer',
      snap: '.customizeToolbarItem-placeholder',
      snapMode: "inner",
      revert: "invalid",
    },

    spacerTmpl: (
      "<div class='menuPanelButton spacer' title='Drop buttons here!'></div>"),

    spacerDropOpts: {
      accept: '.menuPanelButton',
      hoverClass: 'hovered',
      drop: function handleDropEvent( event, ui ) {
        var draggable = ui.draggable;
        draggable.insertAfter($(this));
        draggable.css({top:"", left:""});
        $(this).remove();
      }
    },

    renderHeader: function($el) {},
    renderFooter: function($el) {},

    render: function () {
      var self = this;
      var $el = $(this.el);

      // Empty element
      $el.html("");

      this.renderHeader($el);

      $el.append("<div class='panelToolbarIconsRow'>");

      this.collection.each(function(model, i) {
        $(self.buttonTmpl(model.toJSON()))
          .appendTo($el.children(":last-child"))
          .draggable(self.buttonDragOpts)
          .mousedown(function(event) {
            if ($(".window.customizeMode").length)
              $(this).add(".spacer").addClass("mousedown");
          })
          .mouseup(function(event) {
            $(this).add(".spacer").removeClass("mousedown");
          })
          .bind("dragstop", function(event, ui) {
            $(this).add(".spacer").removeClass("mousedown");
          });
      });

      this.renderFooter($el);
    },
  });

  var MenuPanel = ButtonView.extend({
    renderFooter: function($el) {
      // Now add a row of spacers.
      for (var i = 0; i < 3; i++) {
        $(this.spacerTmpl)
          .appendTo($el.children(":last-child"))
          .droppable(this.spacerDropOpts);
      };
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

    renderHeader: function ($el) {
      $el.append('<div class="customizeCategoryHeader">' +
                   'More Tools to add to the Menu and Toolbar' +
                 '</div>');
    },

    renderFooter: function($el) {
      // Now add the footer.
      $el.append("<div class='customizeFooter'></div>");
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
      { type: "tabGroups", description: "Formerly Panorama",
        shortcut: "Ctrl-Shift-E", label: "tabGroups" },
      { type: "reload", description: "Reload this page",
        shortcut: "Ctrl-R", label: "Reload" },
      { type: "stop", description: "Stop loading this page",
        shortcut: "Escape", label: "Stop" },
      { type: "home", description: "Go to your home page",
        shortcut: "Ctrl-H", label: "Home" },
      { type: "sync", description: "Now with BrowserID",
        shortcut: "Ctrl-Shift-B", label: "Sync" },
      { type: "openFile", description: "Open a file",
        shortcut: "Ctrl-F", label: "Open File" },
      { type: "developer", description: "Open the developer tools",
        shortcut: "Ctrl-Shift-J", label: "Developer" },
      { type: "encoding", description: "Choose your character encoding",
        shortcut: "Ctrl-Shift-?", label: "Encoding" }
      ]),
  });
  customizePanel.render();

  return {menuPanel: menuPanel,
          customizePanel: customizePanel}

});