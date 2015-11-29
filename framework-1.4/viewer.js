/**
 * @example
TODO
 * @constructor
 * @export
 */
Framework.Viewer = Framework.AbstractConstraintPanel.extend({
    initialize : function(options){
        Framework.AbstractConstraintPanel.prototype.initialize.call(this,options);
        this['preloadDataAsync'] = this.source.get.bind(this.source);
    }
});
