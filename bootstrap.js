document.addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    console.log("Bootstrapping plugin...");

    const baseUrl = "https://seahorse-app-4yoyu.ondigitalocean.app/static/";

    const stylesheetUrls = [
      "https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/css/uikit.min.css",
      baseUrl + "css/styles.css",
    ];

    const scriptUrls = [
      "https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit.min.js",
      "https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit-icons.min.js",
      baseUrl + "js/Utility.js",
      baseUrl + "js/EventEmitter.js",
      baseUrl + "js/Marker.js",
      baseUrl + "js/MarkersManager.js",
      baseUrl + "js/PluginGui.js",
      baseUrl + "js/Plugin.js",
    ];

    for (let styleSheetUrl of stylesheetUrls) {
      const stylesheetLink = document.createElement("link");
      stylesheetLink.rel = "stylesheet";
      stylesheetLink.href = styleSheetUrl;
      document.head.appendChild(stylesheetLink);
    }

    for (let scriptUrl of scriptUrls) {
      const script = document.createElement("script");
      script.async = false;
      script.src = scriptUrl;
      document.body.appendChild(script);
    }

    console.log("plugin bootstrapped!");
  }, 5000);
});
