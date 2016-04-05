Materialize.InfoPanel = Framework.BaseView.extend({
    loadingTemplate: Framework.Ext.TemplatePath + 'materializecss/templates/Loading.html',
    
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        this.listenTo(this._options.viewer, 'change', function(markedRecordsMap) {
            this.markedRecordsMap = markedRecordsMap;
            this.renderView();
        }.bind(this));
    }
});
