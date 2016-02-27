MaterializeModal = Framework.AbstractModal.extend({
    template: Framework.Ext.TemplatePath + 'templates/modals/MaterializeModal.html',
    dismissible: true,
    in_duration: 200,
    out_duration: 200,
    opacity: .5,
    fixedFooter: false,
    close: function() {
        this.$el.find('.modal').closeModal();
        this.destroy();
    },
    render: function(callback) {
        Framework.AbstractModal.prototype.render.call(this, callback);
        $('body').append(this.$el);
        this.$el.find('.modal').openModal({
            dismissible: this.dismissible,
            // Modal can be dismissed by clicking outside of the modal
            opacity: this.opacity,
            // Opacity of modal background
            in_duration: this.in_duration,
            // Transition in duration
            out_duration: this.out_duration,
            // Transition out duration
            complete: function(e) {
                this.destroy();
            }
            .bind(this)
        });
    }

});
// message
// onYes
// onCancel

Materialize.AreYouSureView = Framework.BaseView.extend({
    title : "Are you sure?",
    description : "Performing this action cause some regrets in future.",
    buttons : {
        "yes" : "Do it",
        "no" : "Cancel"
    },
    events : {
        'click #yes' : 'onYesBtn',
        'click #no' : 'onNoBtn'
    },

    onNoBtn : function(){
        this.getParent().close();
    },

    onYesBtn : function(){
        
        this._options.callback ? this._options.callback() : (function(){ console.log('callback not defined')})();
        this.getParent().close();
    },
    template : Framework.Ext.TemplatePath + 'templates/AreYouSureView.html'

});


TransparentModal = MaterializeModal.extend({
    template: Framework.Ext.TemplatePath + 'templates/modals/MaterializeModalTransparent.html',
    opacity: .85,
    
    render: function(callback) {
        MaterializeModal.prototype.render.call(this, callback);
    }
});
