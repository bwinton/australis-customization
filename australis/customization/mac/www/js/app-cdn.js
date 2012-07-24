// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: "js/lib",
    paths: {
        "app": "../app",
        "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",
        "jquery-ui": "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main']);