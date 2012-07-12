define(function (require) {
  require(["jquery", "x-tag"], function($, xtag) {
    xtag.register("toolbar-item", {
      onCreate: function(){
        // fired once at the time a component 
        // is initially created or parsed
        var self = $(this);
        self.html("<div class='customizeToolbarItem'>" +
                    "<div class='customizeToolbarItemIcon " + (self.attr("type") || "") + "'></div>" +
                    "<div class='customizeToolbarItemLabel'>" + self.text() + "</div>" +
                  "</div>");
      },
    });

    xtag.register("panel-button", {
      onCreate: function(){
        // fired once at the time a component 
        // is initially created or parsed
        var self = $(this);
        self.html("<div class='menuPanelButton " + self.attr("type") + "'>" +
                    "<img src='images/button-" + self.attr("type") + ".png'" +
                    "     class='button'>" +
                    "<div class='label'>" + self.text() + "</div>" + 
                  "</div>");
      },
    });
  });
});