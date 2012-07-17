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
        toggleMenuPanel();
        $("#customize").text("Done");
        $("div.customizeContentContainer").css({"display":"-moz-box"});
        $("div.customizeContentContainer").css({"display":"block"});
      } else {
        button.attr("custom", false);
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
      $('.customizeToolbarItem').draggable({
        containment: '.customizeContentContainer',
        cursor: 'move',
        snap: '.customizeToolbarItem-placeholder',
        revert: true
      });
      $('.customizeToolbarItem-placeholder').droppable({
        accept: '.customizeToolbarItem',
        hoverClass: 'hovered',
        drop: function handleDropEvent( event, ui ) {
          var draggable = ui.draggable;
          draggable.draggable('option', 'revert', false);
          draggable.offset($(this).offset());
          setTimeout(function() {
            draggable.draggable('option', 'revert', true);
          }, 1000);
        }
      });
      $('.customizeToolsArea').droppable({
        accept: '.customizeToolbarItem',
        hoverClass: 'hovered',
        drop: function handleDropEvent( event, ui ) {
          var draggable = ui.draggable;
          draggable.draggable( 'option', 'revert', false );
          // draggable.offset($(this).offset());
          draggable.animate({left:'0px', top: '0px'});
          setTimeout(function() {
            draggable.draggable( 'option', 'revert', true );
          }, 1000);
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


      $("panel-button").contextMenu({menu: "buttonContext"}, function(a, el, pos) {
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