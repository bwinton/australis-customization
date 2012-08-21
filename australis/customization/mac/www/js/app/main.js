define(function (require) {
  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var models = require("./models");
  require("./tags");
  require("jquery-ui");
  require("jquery.contextMenu");

  function toggleBookmarkStar() {
    if ($("div.window").hasClass("customizeMode"))
      // We're in customize mode!
      return;
    $('.bookmark .button').toggleClass('starred');
  }

  function toggleCustomizeTab() {
    $("div.window").toggleClass("customizeMode");
  }

  function enterCustomizeMode() {
    if ($("div.window").hasClass("customizeMode"))
      // We're in customize mode already!
      return;

    // We're in customize mode!!!
    toggleCustomizeTab();
    $("#menuPanel").appendTo($("div.customizeMenuArea"));
    $("#menuPanel").css("z-index", "auto");
    $("div.customizeContentContainer").css({"display":"block"});
    $("#arrowPanel").disableContextMenu();
    $(".menuPanelButton").disableContextMenu();
    $(".panelToolbarIconsRow").sortable("enable");
    setTimeout(function() {
      $(".spacer").slideDown("fast", function() {
        $(".navBar .spacer").css("display", "-moz-box");
      });
    }, 100);
  }

  function leaveCustomizeMode() {
    if (!$("div.window").hasClass("customizeMode"))
      // We're out of customize mode already!
      return;

    toggleCustomizeTab();
    $(".spacer").slideUp("fast");
    $(".panelToolbarIconsRow").sortable("disable");
    $(".menuPanelButton").enableContextMenu();
    $("#arrowPanel").enableContextMenu();
    $("#menuPanel").css("z-index", 9999);
    $("#menuPanel").appendTo($("div.window"));
    $("div.customizeContentContainer").css({"display":"none"});
    toggleMenuPanel();
  }

  function toggleMenuPanel() {
    $('div.toolbarButton.customizeButton').toggleClass('toggled');
    $('div.arrowPanelContainer#menuPanel').fadeToggle();
  }

  $(function() {
    var options = {};
    if (window.location.search)
      try {
        options = JSON.parse(decodeURI(window.location.search.substr(1)));
      } catch (e) {
        console.log(e);
      }
    console.log("Options = "+JSON.stringify(options));

    models.render();
    $(".navBar").on("click", ".menuButton", function() {
      if (!$("div.window").hasClass("customizeMode"))
        toggleMenuPanel();
    });

    if (options.scroll) {
      var current = 0;
      setInterval(function scrollBg(){
        current -= 1;
        if (current >= 8871){
          current = 0;
        }
        $(".contentArea").css("background-position",current+"px 0");
      }, 50);
    }

    $('.bookmark').click(toggleBookmarkStar);
    $('#customize').click(enterCustomizeMode);
    $('#done').click(leaveCustomizeMode);
    $('html').keypress(function(event) {
      if (event.keyCode === 27)
        leaveCustomizeMode();
    });

    $('#restore').click(function() {
      models.render();
      $(".spacer").show(0, function() {
        $(".navBar .spacer").css("display", "-moz-box");
      });
      $(".panelToolbarIconsRow").sortable("enable");
    });

    $('#arrowPanel')
      .contextMenu({menu: 'panelContext'}, function(a, el, pos) {
      switch (a) {
      case "addMore":
        enterCustomizeMode();
        break;
      default:
        console.log(
            "Action: " + a + "\n\n" +
            "Element ID: " + $(el).attr("id") + "\n\n" +
            "X: " + pos.x + "  Y: " + pos.y + " (relative to element)\n\n" +
            "X: " + pos.docX + "  Y: " + pos.docY+ " (relative to document)"
            );
      }
    });

    $('.menuPanelButton').contextMenu({menu: "buttonContext"}, function(a, el, pos) {
      switch (a) {
      case "customize":
        enterCustomizeMode();
        break;
      default:
        console.log(
            "Action: " + a + "\n\n" +
            "Element ID: " + $(el).attr("id") + "\n\n" +
            "X: " + pos.x + "  Y: " + pos.y + " (relative to element)\n\n" +
            "X: " + pos.docX + "  Y: " + pos.docY+ " (relative to document)"
            );
      }
    });

    var clicks = 0;
    $(".window").on("click", ".menuPanelButton", function(event) {
      if (!$("div.window").hasClass("customizeMode"))
        return;
      var self = $(this);
      clicks++;
      if (clicks == 1) {
        setTimeout(function() {
          if (clicks == 1) {
            self.effect("shake", { times: options.times || 1, distance: options.distance || 2 }, options.duration || 100);
          } else {
            var sortable;
            var spacer;
            var inMenu = self.parents('#arrowPanel').length;
            var position = self.css("position");
            var offset = self.offset();
            self.appendTo($(".customizeToolsArea .panelToolbarIconsRow"));
            self.css({position: "absolute", top: offset.top, left: offset.left});

            if (inMenu) {
              sortable = $(".navBar .panelToolbarIconsRow");
              if (options.goToPanel)
                sortable = $(".customizeToolsArea .panelToolbarIconsRow");
              spacer = sortable.find(".menuPanelButton:last-child");
              self.animate({top: spacer.offset().top, left: spacer.offset().left}, 300, function(){
                self.insertAfter(spacer);
                self.css("position", position);
                sortable.sortable("refresh");
              });
            } else {
              sortable = $("#arrowPanel .panelToolbarIconsRow");
              spacer = sortable.find(".spacer");
              self.animate({top: spacer.offset().top, left: spacer.offset().left}, 300, function(){
                self.insertBefore(spacer);
                self.css("position", position);
                sortable.sortable("refresh");
              });
            }

          }
          clicks = 0;
        }, 200);
      }
    });

  });

});