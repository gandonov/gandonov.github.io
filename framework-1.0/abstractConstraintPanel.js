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
        
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        // subscribe to source
        this.source = options.source;
        this.source.subscribe(this);
    },

    destroy: function() {
        this.source.unsubscribe(this);
        Framework.BaseView.prototype.destroy.call(this);
    }
});


/** Override this method to return constraintModel with explicit constraint values depending on state of this constraintPanel 
* @example

MyConstraintPanel = Framework.AbstractConstraintPanel.extend({
    getConstraintModel : function(){
        var constraintModel = new this.source.ConstraintModelPrototype();
        constraintModel.set('somefieldname', this.$('#input').val()); // assuming that this view constains #input element
        // we want to return the value of input everytime RestSource requests ConstraintModel from this panel
        return constraintModel;
    }
});

* @returns {Object} returns ConstraintModel
*/
Framework.AbstractConstraintPanel.prototype['getConstraintModel'] =  function() {
    var constraintModel = new this.source['ConstraintModelPrototype']();
    return constraintModel;
}

/**
* @export {*} 
* @returns {Object} returns RestSource
*/
Framework.AbstractConstraintPanel.prototype.getSource =  function() {
    return this.source;
};

/**
* @export {*} 
*/
Framework.AbstractConstraintPanel.prototype.onConstraintChange =  function() {
    this.trigger('constraintPanel:changed', this);
};