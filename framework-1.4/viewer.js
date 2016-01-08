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

    id : 'id',
    
    initialize: function(options) {
        Framework.AbstractConstraintPanel.prototype.initialize.call(this, options);
        this.markedRecordsMap = {};
    },
    getRecord: function(id) {
        return true;
        // override for your own needs. Implement your logic of caching/retrieving record values.   
    },
    toggleCheckbox: function(event) {
        event.originalEvent.preventDefault();
        event.preventDefault();
        var $el = $(event.currentTarget);
        var id = $el.data('id');
        var $e = this.$('.fw-record[data-id="' + id + '"]');
        this._$select($e, true);
        return false;
    },
    clearSelection : function(){
        this.$('.fw-checkbox').prop('checked', false);
        this.$('.fw-record').removeClass('fw-row-selected');
        this.markedRecordsMap = {};       
    },
    _$select: function($e, ctrlKey) {
        var id = $e.data('id');
        var $cb = $e.find('.fw-checkbox');
        if (!ctrlKey) {
            this.clearSelection();
            $cb.prop('checked', true);
            $e.addClass('fw-row-selected');
            this.markedRecordsMap[id] = this.getRecord(id);
        } else if ($e.hasClass('fw-row-selected')) {
            $cb.prop('checked', false);
            $e.removeClass('fw-row-selected');
            delete this.markedRecordsMap[id];
        } else {
            $cb.prop('checked', true);
            $e.addClass('fw-row-selected');
            this.markedRecordsMap[id] = this.getRecord(id);
        }
        this.trigger('change', this.markedRecordsMap);
    },
    
    getSelection: function() {
        var ids = [];
        for(var prop in this.markedRecordsMap){
            ids.push(prop);
        }
        var data = {};
        data.ids = ids;
        return ids;
    },
    
    onClick: function(e) {
        var $e = $(e.currentTarget);
        var $target = $(e.target);
        if ($target.hasClass('fw-checkbox-specific') || $target.hasClass('k6-action')) {
            return true;
        }
        var id = $e.data('id');
        var record = {
            'test': 'test'
        };
        var time = Date.now();
        if (!this._lc) {
            this._lc = {
                id: id,
                record: record,
                time: time
            };
            this._$select($e, e.ctrlKey);
            this.trigger('click', id);
        } else if (this._lc.id == id && (time - this._lc.time) < 400) {
            this.trigger('dblclick', id);
            this._lc = null ;
        } else {
            this._$select($e, e.ctrlKey);
            this.trigger('click', id);
            this._lc = {
                id: id,
                record: record,
                time: time
            };
        }
    },
    preloadDataAsync: function(callback) {
        this.source.get(callback);
    },
    
    switchView: function(index) {
        if (this.bundle.length <= index) {
            throw "index is out of range";
        } else {
            this._currentBundleSelection = index;
            this.renderView();
        }
    
    },
    
    renderView: function(callback) {
        if (this.bundle) {
            if (!this._currentBundleSelection) {
                this._currentBundleSelection = 0;
            }
            var o = this.bundle[this._currentBundleSelection];
            if (o.template) {
                this.template = o.template;
            }
            if (o.snippets) {
                this.snippets = o.snippets;
            }
        }
        Framework.AbstractConstraintPanel.prototype.renderView.call(this, callback);
    }
});

//markup .fw-switcher-toggle attr[data-index]
Framework.ViewerSwitcher = Framework.BaseView.extend({
    
    events: {
        'click .fw-switcher-toggle': 'switch'
    },
    
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        this.viewer = options.viewer;
        if (!this.viewer) {
            throw "viewer must be defined.";
        }
    },
    
    switch: function(e) {
        var index = $(e.currentTarget).data('index');
        this.viewer.switchView(index);
    
    }

});

Framework.ViewerActionPanel = Framework.BaseView.extend({
    
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        this.viewer = options.viewer;
        this.listenTo(this.viewer, 'change', this.renderView.bind(this));
    },
    
    preloadDataAsync: function(callback) {
        var ids = this.viewer.getSelection();
        var data = {};
        data.ids = ids;
        callback(data);
    }

});
