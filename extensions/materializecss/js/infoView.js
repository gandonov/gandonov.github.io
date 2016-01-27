InfoView = Framework.BaseView.extend({
    template: TemplatePaths.common + 'templates/InfoView.html',
    
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        if (options.autorefresh) {
            this.timerId = setInterval(this.renderView.bind(this), options.refreshinterval ? options.refreshinterval : 3000);
        }
    },
    timerId: null ,
    
    
    destroy: function() {
        clearInterval(this.timerId);
        Framework.BaseView.prototype.destroy.call(this);
    
    },
    preloadDataAsync: function(callback, error) {
        if (this._options.url) {
            this.getJSON(this._options.url, callback, function() {
                callback({
                    "Error": "Info is not implemented for this service"
                })
            });
        } else {
            callback({
                "usage": " pass in URL in options { url : 'yoururl'}"
            });
        }
    }
});
