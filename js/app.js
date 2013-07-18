requirejs.config({
    "baseUrl": "js/lib",
    "paths" : {
      "app" : "../app",
      "jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
	  "bootstrap" : "bootstrap.min",
	  "validate" : "jquery.validate.min"
    },
	"shim" : {
		"bootstrap" : {
            deps: ["jquery"]
        },
		"validate" : {
            deps: ["jquery"]
        }
	}
});

// Load the main app module to start the app
requirejs(["app/main"]);