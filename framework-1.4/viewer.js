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
        if(!ctrlKey){
            this.$('.fw-record').removeClass('fw-row-selected');
            $e.addClass('fw-row-selected');
        }else if($e.hasClass('fw-row-selected')){
            $e.removeClass('fw-row-selected');        
        }else {
            $e.addClass('fw-row-selected');
        }
        this.trigger('change');
    },

    getSelection : function(){
        var ids = $.map(this.$('.fw-row-selected'), function(el) {
            return $(el).data('id'); 
        });
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
            this._$select($e, id, e.ctrlKey);
            this.trigger('click', id);
        } else if (this._lc.id == id && (time - this._lc.time) < 400) {
            this.trigger('dblclick', id);
            this._lc = null ;
        } else {
            this._$select($e, id, e.ctrlKey);
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

    events : {
        'click .fw-switcher-toggle' : 'switch'
    },
    
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        this.viewer = options.viewer;
        if (!this.viewer) {
            throw "viewer must be defined.";
        }
    },

    switch : function(e){
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

    preloadDataAsync : function(callback){
        var ids = this.viewer.getSelection();
        var data = {};
        data.ids = ids;
        callback(data);
    }

});