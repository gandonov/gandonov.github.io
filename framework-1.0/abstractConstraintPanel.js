/**
 * AbstractConstraintPanel. All constraint panels must inherit from it. 
   Instantiate this class to apply constraints on the RestSource via GET or POST methods, by changing it's constraintModel.getUrl() output. 
 * 
 * @example
DataSource = new Framework.RestSource.extend({
    
});
 * @constructor
 * @export
 */
Framework.AbstractConstraintPanel = Framework.BaseView.extend({
    
    constraintModel: null,
    
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        // subscribe to source
        this.source = options.source;
        this.source.subscribe(this);
    },
    
    putConstraintModel: function(constraintModel) {
        throw "putConstraintModel must be implemented";
    },
    
    getConstraintModel: function() {
        if (!this.constraintModel) {
            this.constraintModel = new this.source.ConstraintModelPrototype();
        }
        return this.constraintModel;
    },
    
    onConstraintChange: function() {
        this.trigger('constraintPanel:changed', this);
    },
    render: function() {
    
    },
    
    
    destroy: function() {
        this.source.unsubscribe(this);
        Framework.BaseView.prototype.destroy.call(this);
    }

});

// utility class
Framework.ProxyConstraintPanel = Framework.AbstractConstraintPanel.extend({
    initialize: function(options) {
        this.from = options.from;
        Framework.AbstractConstraintPanel.prototype.initialize.call(this, options);
        this.listenTo(this.from, 'source:constraintChange', this.onFromChange);
    },
    
    onFromChange: function(constraintPanel) {
        this.onConstraintChange();
    },
    
    getConstraintModel: function() {
        return this.from.constraintModel;
    }
});
