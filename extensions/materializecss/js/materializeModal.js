MaterializeModal = Framework.AbstractModal.extend({
    template : TemplatePaths.common + 'templates/modals/MaterializeModal.html',
    dismissible: true,
    in_duration : 200,
    out_duration : 200,
    fixedFooter : false,
    render : function(){
        Framework.AbstractModal.prototype.render.call(this);
        $('body').append(this.$el);
        this.$el.find('.modal').openModal({
              dismissible: this.dismissible, // Modal can be dismissed by clicking outside of the modal
              opacity: .5, // Opacity of modal background
              in_duration: this.in_duration, // Transition in duration
              out_duration: this.out_duration, // Transition out duration
              complete: function(e) {
                 this.destroy();                 
              }.bind(this) 
            });
    }

});