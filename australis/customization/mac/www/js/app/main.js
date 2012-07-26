define(function (require) {
  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  require("./tags");
  require("./models");
  require("jquery-ui");
  require("jquery.contextMenu");

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
      var evt = document.createEvent('Event');
      evt.initEvent('tpemit', true, true);
      document.body.dispatchEvent(evt);

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
      snapMode: "inner",
      revert: "invalid",
    });

    $('.menuPanelButton.spacer').droppable({
      accept: '.menuPanelButton',
      hoverClass: 'hovered',
      drop: function handleDropEvent( event, ui ) {
        var draggable = ui.draggable;
        draggable.insertAfter($(this));
        draggable.css({top:"", left:""});
        $(this).remove();
      }
    });

    $('x-tabpanels').droppable({
      accept: '.menuPanelButton',
      hoverClass: 'hovered',
      drop: function handleDropEvent( event, ui ) {
        var draggable = ui.draggable;
        // draggable.offset($(this).offset());
      }
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