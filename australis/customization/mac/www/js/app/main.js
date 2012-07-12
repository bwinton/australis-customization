define(function (require) {
  // Load any app-specific modules
  // with a relative require call,
  // like:
  // var util = require('./util');
  console.log('Hello world');
  require(["jquery", "underscore", "backbone"], function($, _, Backbone) {
    // Load in jquery-ui _after_ jquery, and load our custom x-tags while we're here.
    require(["jquery-ui", "jquery.contextMenu", "./tags"]);

    function toggleBookmarkStar() {
      $('.bookmarkStar').toggleClass('starred');
    }
    
    function toggleCustomizeTab() {
      $("div.customizeContentContainer").toggle();
      $("div.windowOuterContainer").toggleClass("customizeMode");
      $("div.window").toggleClass("customizeMode");
      $("div.backButton").toggleClass("customizeMode");
      $("div.locationBar").toggleClass("customizeMode");
      var button = $("div.menuButton");
      button.toggleClass("customizeMode");
      if (button.hasClass("customizeMode")) {
        // We're in customize mode!!!
        button.attr("custom", true);
        $("#arrowPanel").appendTo($("div.customizeMenuArea"));
        toggleMenuPanel();
        $("#customize").text("Done");
      } else {
        button.attr("custom", false);
        $("#arrowPanel").appendTo($("div.arrowPanelContainer"));
        $("#customize").text("Customize");
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

      $("panel-button").mouseup(function(e) {
        // If we got a right-click
        if (e.button == 2) {
          var offset = $("#arrowPanel").offset();
          $("#panelContext").css({top: e.pageY - offset.top,
                                  left: e.pageX - offset.left})
                            .fadeIn('fast');
        }
      }).bind("contextmenu", function(e) {
        e.preventDefault();
      });
    });
  });
});