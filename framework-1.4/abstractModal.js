Framework.AbstractModal = Framework.BaseView.extend({
    initialize : function(options){
        var options = options ? options : {};
        if(!options.ContentView){
            throw "must pass constructor. Missing parameter \"options.ContentView\"";
        }
        if(!this.template){
            throw "you must specify this.template (refer to API for proper HTML markup)";
        }
        Framework.BaseView.prototype.initialize.call(this, options);
        this.contentView = this.instantiate(options.ContentView, options.contentOptions);
    },

    render : function(){
        this.contentView.setElement($(this.$('.fw-modal-content')[0])).renderView();
    }
});
