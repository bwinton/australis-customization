define(function (require) {
  // Load any app-specific modules
  // with a relative require call,
  // like:
  // var util = require('./util');
  console.log('Hello world');
  require(["jquery", "underscore", "backbone"], function($, _, Backbone) {
    // Load in jquery-ui _after_ jquery, and load our custom x-tags while we're here.
    require(["jquery-ui", "jquery.contextMenu", "./tags", "./models"]);

    function toggleBookmarkStar() {
      $('.bookmarkStar').toggleClass('starred');
    }
    
    function toggleCustomizeTab() {
      $("div.windowOuterContainer").toggleClass("customizeMode");
      $("div.window").toggleClass("customizeMode");
      $("div.backButton").toggleClass("customizeMode");
      $("div.locationBar").toggleClass("customizeMode");
      var button = $("div.menuButton");
      button.toggleClass("customizeMode");
      if (button.hasClass("customizeMode")) {
        // We're in customize mode!!!
        button.attr("custom", true);
        $("#menuPanel").appendTo($("div.customizeMenuArea"));
        $("#menuPanel").css("z-index", 0);
        toggleMenuPanel();
        $("#customize").text("Done");
        $("div.customizeContentContainer").css({"display":"-moz-box"});
        $("div.customizeContentContainer").css({"display":"block"});
        $(".menuPanelButton").disableContextMenu();
        $(".menuPanelButton").draggable("enable");
        setTimeout(function() {
          $(".spacer").slideDown("fast", function() {
            $(".menuPanelButtonHighlight").effect("pulsate", { times:3 }, 1000, function() {
              $(".menuPanelButtonHighlight").hide("fade", {}, 1500);
            });
          });
        }, 100);
      } else {
        button.attr("custom", false);
        $(".spacer").slideUp("fast");
        $(".menuPanelButton").draggable("disable");
        $(".menuPanelButton").enableContextMenu();
        $("#menuPanel").css("z-index", 9999);
        $("#menuPanel").appendTo($("div.window"));
        $("#customize").text("Customize");
        $("div.customizeContentContainer").css({"display":"none"});
        toggleMenuPanel();
      }
    }

    function toggleMenuPanel() {
      $('div.toolbarButton.customizeButton').toggleClass('toggled');
      $('div.arrowPanelContainer#menuPanel').fadeToggle();
    }

    $(function() {
      $(document).delegate('div.menuButton[custom!="true"]', 'click', function() {
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

      $('#customize').click(toggleCustomizeTab);
      $('.bookmarkStar').click(toggleBookmarkStar);

      $(".menuPanelButton").draggable({
        disabled: true,
        containment: '.windowOuterContainer',
        snap: '.customizeToolbarItem-placeholder',
        grid: [ 85, 72 ],
        revert: "invalid",
      });

      $("#arrowPanel").contextMenu({menu: "panelContext"}, function(a, el, pos) {
        switch (a) {
        case "addMore":
          toggleCustomizeTab();
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
          toggleCustomizeTab();
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
});