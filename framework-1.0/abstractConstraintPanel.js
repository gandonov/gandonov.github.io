Framework.AbstractConstraintPanel = Framework.BaseView.extend({
    
    constraintModel : null,

    initialize : function(options){
        // subscribe to source
        this.source = options.source;
        this.source.subscribe(this);
    },
    
    putConstraintModel : function(constraintModel){
        throw "putConstraintModel must be implemented";
    },

    getConstraintModel : function(){
    	if(!this.constraintModel){
    		this.constraintModel = new this.source.ConstraintModelPrototype();
    	}
        return this.constraintModel;
    },

    onConstraintChange : function(){
        this.trigger('constraintPanel:changed', this);        
    },
    render : function(){
       // this.$el.html('Abstract Panel');
    },

    destroy : function(){
        this.source.unsubscribe(this);
        Framework.BaseView.prototype.destroy.call(this);
    }

});

Framework.ProxyConstraintPanel = Framework.AbstractConstraintPanel.extend({
    initialize : function(options){
        this.from = options.from;
        Framework.AbstractConstraintPanel.prototype.initialize.call(this, options);
        this.listenTo(this.from, 'source:constraintChange', this.onFromChange);
    },

    onFromChange : function(constraintPanel){
        this.onConstraintChange();
    },

    getConstraintModel : function(){
		return this.from.constraintModel;
    }
});