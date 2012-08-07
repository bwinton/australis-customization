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

    dragOpts: {
      disabled: true,
      containment: '.windowOuterContainer',
      revert: "invalid",
      /* helper: "clone", */
      start: function handleDragStart(event, ui) {
        var draggable = $(event.target);
        /*
        draggable.css("opacity", "0");
        draggable.animate({width: "0px", margin: "0px", padding: "0px"}, 150);
        */
      },
      drag: function handleDragEvent(event, ui) {
        var drop = ui.helper.data("dropTarget");
        if (drop) {
          drop(event, ui);
        }
      },
    },

    dropOpts: {
      accept: '.menuPanelButton',
      over: function handleDropOver(event, ui) {
        var self = $(this);
        ui.helper.data("dropTarget", function handleDropDrag(event, ui) {
          var closest = JSON.stringify(ui.helper.offset()) + ", ";
          // Loop through those, to see which one gets closest to ui.helper.offset()
          self.find(".menuPanelButton").each(function(i, e) {
            closest += JSON.stringify($(this).offset()) + ", ";
          });
          console.log(closest);
        });
      },
      out: function handleDropOut(event, ui) {
        ui.helper.data("dropTarget", null);
      },
      drop: function handleDropEvent(event, ui) {
        ui.draggable.insertBefore($(this).find(".spacer").first())
          .css({width:"", margin:"", padding:"", opacity:"", top: "", left: ""});
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

      $("<div class='panelToolbarIconsRow'></div>").appendTo($el)
        .sortable({disabled: true});


      this.collection.each(function(model, i) {
        $(self.buttonTmpl(model.toJSON()))
          .appendTo($el.children(":last-child"))
          //.draggable(self.dragOpts)
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

      $("<div class='menuPanelButton spacer' title='Drop buttons here!'></div>")
        .appendTo($el.children(":last-child"));

      this.renderFooter($el);

    },
  });

  var MenuPanel = ButtonView.extend({
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