/**
 * @example
TODO
 * @constructor
 * @export
 */
Framework.Viewer = Framework.AbstractConstraintPanel.extend({

    events: {
        'keyup': 'onKeyup',
        'dragover': 'onDragover',
        'dragenter': 'onDragenter',
        'drop': 'onDrop',
        'mousedown': 'onMousedown',
        'mouseup': 'onMouseup',
        'mouseover .fw-record': 'onMouseover',
        'mouseleave .fw-record': 'onMouseleave',
        'mousedown .fw-record': 'onClick',
        "change .fw-checkbox": "toggleCheckbox",
        'mousemove': 'onMousemove',
        'mouseleave': 'onMouseup'
    },
    _$select: function($e, record, ctrlKey) {
        this.$('.fw-record').removeClass('fw-row-selected');
        if (!ctrlKey) {
            $e.addClass('fw-row-selected');
            this.trigger('selected', record);
        } else {
            this.trigger('unselected');
        }
    },

    onClick: function(e) {
        var $e = $(e.currentTarget);
        var $target = $(e.target);
        if ($target.hasClass('fw-checkbox-specific') || $target.hasClass('k6-action')) {
            return true;
        }
        var id = $e.data('id');
        var record = { 'test' : 'test' };
        var time = Date.now();
        if (!this._lc) {
            this._lc = {id: id,record: record,time: time};
            this._$select($e, id, e.ctrlKey);
            this.trigger('click', id);
        } else if (this._lc.id == id && (time - this._lc.time) < 400) {
            this.trigger('dblclick', id);
            this._lc = null;
        } else {
            this._$select($e, id, e.ctrlKey);
            this.trigger('click', id);
            this._lc = {id: id,record: record,time: time};
        }
    },
    preloadDataAsync : function(callback) {
        this.source.get(callback);
    },

    initialize : function(options){
        Framework.AbstractConstraintPanel.prototype.initialize.call(this,options);
//         if(this.source){
//             this['preloadDataAsync'] = this.source.get.bind(this.source);
//         }
    }
});
