(function() {
    app_environment = {};
    app_environment.deployment = 'prod';
    app_environment.constants = {
        dev: {
            isLive: false,
            production: false,
            apiBaseURL: "http://localhost:3000/"
        },
        uat: {
            isLive: false,
            production: true,
            apiBaseURL: "http://localhost:3000/"
        },
        prod: {
            isLive: true,
            production: true,
            apiBaseURL: "http://35.229.53.67:3000/"
        }
    }

    app_environment.getEnvValueByKey = function(key) {
        return app_environment.constants[app_environment.deployment][key];
    }

    app_environment.loadItHoursClientBase = function() {
            console.log("loadItHoursClientBase start");
            let script = document.createElement('script');
            script.src = this.getEnvValueByKey('apiBaseURL') + 'ithours-client-base'; // //"https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.3.0/lodash.js"
            script.setAttribute('api-url', this.getEnvValueByKey('apiBaseURL'));
            document.head.append(script);
            script.onload = function() {
                console.log("loadItHoursClientBase client base loaded");
            };
        }
        //app_environment.loadItHoursClientBase();
})();
