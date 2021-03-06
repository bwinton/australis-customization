define(["jquery", "underscore", "backbone", "jquery-ui"], function($, _, Backbone) {

  // Base classes.

  var Button = Backbone.Model.extend({
    defaults: {
      type: "error",
      description: "Error button",
      shortcut: "Cmd-Error",
      label: "Error",
      template: _.template(
        "<div class='menuPanelButton <%= type %>'" +
        "     title='<%= description %>  (<%= shortcut %>)'>" +
        "  <div style='background-image: url(\"images/button-<%= type %>.png\")'" +
        "       class='button'></div>" +
        "  <div class='label'><%= label %></div>" +
        "  <div class='shortcut'><%= shortcut %></div>" +
        "</div>")
    }
  });

  var Spacer = Button.extend({
    defaults: {
      template: _.template(
        "<div class='spacer' title='Drop buttons here!'></div>")
    }
  });

  var SplitButton = Button.extend({
    defaults: {
      template: _.template(
        "<div class='splitToolbarButton <%= type %>'" +
        "     title='<%= description %>  (<%= shortcut %>)'>" +
        "  <div class='toolbarButton bookmarkStar'><div class='icon'></div></div>" +
        "  <div class='splitToolbarButtonSeparator'></div>" +
        "  <div class='toolbarButton dropDown'><img src='images/toolbarButton-dropDown.png'></div>" +
        "  <div class='label'><%= label %></div>" +
        "</div>")
    }
  });

  var ButtonList = Backbone.Collection.extend({
    model: Button
  });


  var ButtonView = Backbone.View.extend({
    renderHeader: function($el) {},
    renderFooter: function($el) {},

    render: function () {
      var self = this;
      var $el = $(this.el);

      // Empty element
      $el.html("");

      this.renderHeader($el);

      $("<div class='panelToolbarIconsRow'></div>").appendTo($el);

      this.collection.each(function(model, i) {
        $(model.attributes.template(model.toJSON()))
          .appendTo($el.children(":last-child"));
      });

      this.renderFooter($el);

    }
  });


  // Subclasses.

  var Toolbar = ButtonView.extend({

    renderHeader: function ($el) {
      $el.append(
        '<div class="toolbarButton backButton">' +
        '  <img src="images/toolbarButton-back.png">' +
        '</div>' +
        '<div class="locationBar" contentEditable="true">' +
        '  <div class="locationBarLabel">' +
        '    <span class="domainName"></span>' +
        '<span class="urlPath">Go to a Website</span>' +
        '  </div>' +
        '  <div class="stopGoReload">' +
        '    <div class="icon"></div>' +
        '  </div>' +
        '</div>');
    },

    renderFooter: function($el) {
      $el.append(
        '<div class="toolbarButtonSeparator"></div>' +
        '<div class="toolbarButton menuButton">' +
        '  <img src="images/toolbarButton-menu.png">' +
        '</div>');
    }
  });

  var toolbar = new Toolbar({
    el: $(".navBar"),
    collection: new ButtonList([
      new Spacer(),
      { type: "bookmark", description: "Bookmark this page",
        shortcut: "Ctrl-D", label: "Bookmark" },
      { type: "download", description: "Downloads",
        shortcut: "Ctrl-J", label: "Downloads" }
      ])
  });

  var menuPanel = new ButtonView({
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
        shortcut: "Ctrl+Shift+A", label: "Add-ons" },
      new Spacer()
      ])
  });

  var CustomizePanel = ButtonView.extend({

    renderHeader: function ($el) {
      $el.append('<div class="customizeCategoryHeader">' +
                   'More Tools to add to the Menu and Toolbar' +
                 '</div>');
    },

    renderFooter: function($el) {
      $el.children(".panelToolbarIconsRow").append(
        "<div class='panelSectionEditContainer'>" +
        "  <div class='panelSectionEditContainerButton' title='Ctrl+V'>" +
        "    <div class='panelSectionEditContainerIcon'><img src='images/searchbox-icon.png' alt='searchbox-icon'/></div>" +
        "    <div style='-moz-box-flex: 1'></div>" +
        "    <div class='panelSectionEditContainerLabel' style='margin-right: 5px; color: rgb(150, 150, 150);'>Google</div>" +
        "  </div>" +
        "</div>");
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
      { type: "subscribe", description: "Subscribe",
        shortcut: "Ctrl-Shift-B", label: "Subscribe" },
      { type: "tabGroups", description: "Group your Tabs",
        shortcut: "Ctrl-Shift-E", label: "tabGroups" },
      { type: "home", description: "Go to your home page",
        shortcut: "Ctrl-H", label: "Home" },
      { type: "sync", description: "Sync",
        shortcut: "Ctrl-Shift-B", label: "Sync" },
      { type: "openFile", description: "Open a file",
        shortcut: "Ctrl-F", label: "Open File" },
      { type: "developer", description: "Open the developer tools",
        shortcut: "Ctrl-Shift-J", label: "Developer" },
      { type: "encoding", description: "Choose your character encoding",
        shortcut: "Ctrl-Shift-?", label: "Encoding" }
      ])
  });

  function render() {
    toolbar.render();
    menuPanel.render();
    customizePanel.render();
    $(".panelToolbarIconsRow").sortable({
      disabled: true,
      scroll: false,
      containment: "document",
      connectWith: ".panelToolbarIconsRow",
      items: ".menuPanelButton",
    });
  }

  return {menuPanel: menuPanel,
          customizePanel: customizePanel,
          render: render};

});