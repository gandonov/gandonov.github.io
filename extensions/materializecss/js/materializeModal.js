MaterializeModal = Framework.AbstractModal.extend({
    template: TemplatePaths.common + 'templates/modals/MaterializeModal.html',
    dismissible: true,
    in_duration: 200,
    out_duration: 200,
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
            opacity: .5,
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

TransparentModal = MaterializeModal.extend({
    render: function(callback) {
        MaterializeModal.prototype.render.call(this, callback);
        this.$el.find('.modal').css({
            'box-shadow': 'none',
            'background': 'transparent'
        });
    
    }
});


InfoModal = MaterializeModal.extend({
    InfoModalView: Framework.BaseView.extend({
        template: TemplatePaths.common + 'templates/InfoModal.html',
        initialize: function(options) {
            if (options.preloadDataAsync) {
                this.preloadDataAsync = options.preloadDataAsync;
            }
            if (options.refreshable) {
                this.refreshable = options.refreshable;
            }
            
            Framework.BaseView.prototype.initialize.call(this, options);
            if (this.refreshable) {
                this.buttons = this.buttons + '<a id="refreshInfo" class="waves-effect waves-green btn-flat">refresh</a>';
            }
        }
    }),
    
    initialize: function(options) {
        options = options ? options : {};
        options.ContentView = this.InfoModalView;
        options.contentOptions = options;
        MaterializeModal.prototype.initialize.call(this, options);
    },
    //     render: function() {
    //         MaterializeModal.prototype.render.call(this, function(){
    //              this.contentView.process(this.onSuccess.bind(this), this.onError.bind(this));
    //         }.bind(this));
    //     }
});
