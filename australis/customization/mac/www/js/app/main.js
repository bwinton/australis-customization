define(function (require) {
  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var models = require("./models");
  require("./tags");
  require("jquery-ui");
  require("jquery.contextMenu");

  const ANIMATION_TIME = 300;

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
    var menuPanel = $("#menuPanel");
    if ($(".arrowPanelContainer:visible").length === 0) {
      $('div.toolbarButton.customizeButton').toggleClass('toggled');
      $('div.arrowPanelContainer#menuPanel').toggle();
    }
    toggleCustomizeTab();
    menuPanel.appendTo($("div.customizeMenuArea"));
    menuPanel.animate({top: "130px", right: "90px"}, ANIMATION_TIME, function(){
      menuPanel.css("z-index", "auto");
    });
    $("div.customizeContentContainer").css({"display":"block"});
    setCustomizeContextMenu($(".menuPanelButton"));
    $(".arrowPanel").disableContextMenu();
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
    setNormalContextMenu($(".menuPanelButton"));
    setNormalContextMenu($(".arrowPanel"));
    var menuPanel = $("#menuPanel");
    menuPanel.css("z-index", 9999);
    menuPanel.appendTo($("div.window"));
    menuPanel.animate({top: "40px", right: "0px"}, ANIMATION_TIME);
    $("div.customizeContentContainer").css({"display":"none"});
    toggleMenuPanel();
  }

  function toggleMenuPanel() {
    $('div.toolbarButton.customizeButton').toggleClass('toggled');
    $('div.arrowPanelContainer#menuPanel').fadeToggle();
  }

  function setCustomizeContextMenu(el) {
    el.destroyContextMenu();
    el.contextMenu({menu: "buttonContext"}, function(a, el, pos) {
      switch (a) {
      case "menu":
        moveToMenu($(el));
        break;
      case "toolbar":
        moveToToolbar($(el));
        break;
      case "remove":
        moveToPanel($(el));
        break;
      case "done":
        leaveCustomizeMode();
        break;
      default:
        console.log(
            "Action: " + a + "\n\n" +
            "Element ID: " + $(el).attr("id") + "\n\n" +
            "X: " + pos.x + "  Y: " + pos.y + " (relative to element)\n\n" +
            "X: " + pos.docX + "  Y: " + pos.docY+ " (relative to document)"
            );
        break;
      }
    });
  }

  function setNormalContextMenu(el) {
    el.destroyContextMenu();
    el.contextMenu({menu: 'panelContext'}, function(a, el, pos) {
      switch (a) {
      case "customize":
        enterCustomizeMode();
        break;
      case "list":
        $("#menuPanel").toggleClass("listview");
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
  }

  function moveToMenu(self) {
    if (self.parents(".arrowPanel").length) {
      $(".mousedown").add(".spacer").removeClass("mousedown");
      return;
    }
    var position = self.css("position");
    var offset = self.offset();
    self.appendTo($(".customizeToolsArea"));
    self.css({position: "absolute", top: offset.top, left: offset.left, "z-index": 999});

    var sortable = $(".arrowPanel .panelToolbarIconsRow");
    var spacer = sortable.find(".spacer");
    self.animate({top: spacer.offset().top,
                  left: spacer.offset().left},
                 ANIMATION_TIME, function(){
      self.insertBefore(spacer);
      $(".mousedown").add(".spacer").removeClass("mousedown");
      self.css({"position": position, top: "auto", left: "auto", "z-index": "auto"});
      sortable.sortable("refresh");
    });
  }

  function moveToToolbar(self) {
    if (self.parents(".navBar").length) {
      $(".mousedown").add(".spacer").removeClass("mousedown");
      return;
    }
    var position = self.css("position");
    var offset = self.offset();
    self.appendTo($(".customizeToolsArea"));
    self.css({position: "absolute", top: offset.top, left: offset.left, "z-index": 999});

    var sortable = $(".navBar .panelToolbarIconsRow");
    var spacer = sortable.children().last();
    self.animate({top: spacer.offset().top,
                  left: spacer.offset().left + spacer.width() - self.width()},
                 ANIMATION_TIME, function(){
      self.insertAfter(spacer);
      $(".mousedown").add(".spacer").removeClass("mousedown");
      self.css({"position": position, top: "auto", left: "auto", "z-index": "auto"});
      sortable.sortable("refresh");
    });
  }

  function moveToPanel(self) {
    if (self.parents(".customizeToolsArea").length) {
      $(".mousedown").add(".spacer").removeClass("mousedown");
      return;
    }
    var position = self.css("position");
    var offset = self.offset();
    self.appendTo($(".customizeToolsArea"));
    self.css({position: "absolute", top: offset.top, left: offset.left, "z-index": 999});

    var sortable = $(".customizeToolsArea .panelToolbarIconsRow");
    var spacer = sortable.children().last();
    console.log(spacer.html());
    self.animate({top: spacer.offset().top,
                  left: spacer.offset().left + spacer.width() - self.width()},
                 ANIMATION_TIME, function(){
      self.insertAfter(spacer);
      $(".mousedown").add(".spacer").removeClass("mousedown");
      self.css({"position": position, top: "auto", left: "auto", "z-index": "auto"});
      sortable.sortable("refresh");
    });
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

    if (options.list)
      $("#menuPanel").addClass("listview");


    models.render();
    $(".navBar").on("click", ".menuButton", function() {
      if (!$("div.window").hasClass("customizeMode"))
        toggleMenuPanel();
    });
    $(".window").on("mousedown", ".menuPanelButton", function(event) {
      if ($(".window.customizeMode").length)
        $(this).add(".spacer").addClass("mousedown");
    })
    .on("mouseup", ".menuPanelButton", function(event) {
      $(".mousedown").add(".spacer").removeClass("mousedown");
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

    setNormalContextMenu($('.menuPanelButton'));
    setNormalContextMenu($('.arrowPanel'));

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
            var inMenu = self.parents('.arrowPanel').length;
            if (inMenu)
              if (options.goToPanel)
                moveToPanel(self);
              else
                moveToToolbar(self);
            else
              moveToMenu(self);
          }
          clicks = 0;
        }, 200);
      }
    });

  });

});