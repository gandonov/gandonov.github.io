Materialize.UploadsView = Framework.Ext.UploadsView.extend({
    UploadsEntryViewConstructor: Framework.Ext.UploadsEntryView.extend({
        template: Framework.Ext.TemplatePath + 'materializecss/templates/UploadsEntryView.html',
        render: function() {
            console.log('rendered');
        },
        onDone: function() {
            this.$('#uploadProgress').html('<label class="right">done.</label>');
        },
        onError: function() {
            this.$('#uploadProgress').html('<label class="right red-text">error.</label>');
        }
    }),
    template: Framework.Ext.TemplatePath + 'materializecss/templates/UploadsView.html'
});
