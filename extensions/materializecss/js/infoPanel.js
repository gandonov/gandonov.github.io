InfoPanel = Framework.BaseView.extend({
    loadingTemplate: TemplatePaths.common + 'templates/Loading.html',
    
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        this.listenTo(this._options.viewer, 'selected', function(recordId){
            this.recordId = recordId;
            this.renderView();
        }.bind(this));
    }
});
