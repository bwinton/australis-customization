define(function (require) {
  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var models = require("./models");
  require("./tags");
  require("jquery-ui");
  require("jquery.contextMenu");

  function toggleBookmarkStar() {
    $('.bookmarkStar').toggleClass('starred');
  };

  function toggleCustomizeTab() {
    var button = $("div.menuButton");
    $("div.windowOuterContainer").toggleClass("customizeMode");
    $("div.window").toggleClass("customizeMode");
    $("div.backButton").toggleClass("customizeMode");
    $("div.locationBar").toggleClass("customizeMode");
    button.attr("custom", !button.hasClass("customizeMode"));
    button.toggleClass("customizeMode");
  };

  function enterCustomizeMode() {
    var button = $("div.menuButton");
    if (button.hasClass("customizeMode"))
      // We're in customize mode already!
      return;

    // We're in customize mode!!!
    toggleCustomizeTab();
    $("#menuPanel").appendTo($("div.customizeMenuArea"));
    $("#menuPanel").css("z-index", 0);
    $("div.customizeContentContainer").css({"display":"block"});
    $("#arrowPanel").disableContextMenu();
    $(".menuPanelButton").disableContextMenu();
    $(".menuPanelButton").draggable("enable");
    setTimeout(function() {
      $(".spacer").slideDown("fast");
    }, 100);
  };

  function leaveCustomizeMode() {
    var button = $("div.menuButton");
    if (!button.hasClass("customizeMode"))
      // We're out of customize mode already!
      return;

    toggleCustomizeTab();
    $(".spacer").slideUp("fast");
    $(".menuPanelButton").draggable("disable");
    $(".menuPanelButton").enableContextMenu();
    $("#arrowPanel").enableContextMenu();
    $("#menuPanel").css("z-index", 9999);
    $("#menuPanel").appendTo($("div.window"));
    $("div.customizeContentContainer").css({"display":"none"});
    toggleMenuPanel();
  };

  function toggleMenuPanel() {
    $('div.toolbarButton.customizeButton').toggleClass('toggled');
    $('div.arrowPanelContainer#menuPanel').fadeToggle();
  }

  $(function() {
    $('div.menuButton').click(function() {
      if($(this).attr("custom") !== "true")
        toggleMenuPanel();
    });

    if (window.location.search == "?scroll") {
      var current = 0;
      setInterval(function scrollBg(){
        current -= 1;
        if (current >= 8871){
          current = 0;
        }
        $(".contentArea").css("background-position",current+"px 0");
      }, 50);
    }

    $('.bookmarkStar').click(toggleBookmarkStar);
    $('#customize').click(enterCustomizeMode);
    $('#done').click(leaveCustomizeMode);
    $('html').keypress(function(event) {
      if (event.keyCode === 27)
        leaveCustomizeMode();
    });

    $('#restore').click(function() {
      models.customizePanel.render();
      models.menuPanel.render();
      $(".spacer").show();
      $(".menuPanelButton").draggable("enable");
    });

    $('x-tabpanels').droppable({
      accept: '.menuPanelButton',
      hoverClass: 'hovered',
      drop: function handleDropEvent( event, ui ) {
        var draggable = ui.draggable;
        var target = $(this).find(".customizeToolsArea > .panelToolbarIconsRow").last();
        $(models.customizePanel.spacerTmpl).insertAfter(draggable)
          .droppable(models.customizePanel.spacerDropOpts).show();
        draggable.appendTo(target);
        draggable.css({top:"", left:""});
      }
    });

    $("#arrowPanel").contextMenu({menu: "panelContext"}, function(a, el, pos) {
      switch (a) {
      case "addMore":
        enterCustomizeMode();
        break;
      default:
        alert(
            "Action: " + a + "\n\n" +
            "Element ID: " + $(el).attr("id") + "\n\n" +
            "X: " + pos.x + "  Y: " + pos.y + " (relative to element)\n\n" +
            "X: " + pos.docX + "  Y: " + pos.docY+ " (relative to document)"
            );
      }
    });

    $(".menuPanelButton").contextMenu({menu: "buttonContext"}, function(a, el, pos) {
      switch (a) {
      case "customize":
        enterCustomizeMode();
        break;
      default:
        alert(
            "Action: " + a + "\n\n" +
            "Element ID: " + $(el).attr("id") + "\n\n" +
            "X: " + pos.x + "  Y: " + pos.y + " (relative to element)\n\n" +
            "X: " + pos.docX + "  Y: " + pos.docY+ " (relative to document)"
            );
      }
    });

  });
});