/**
 * RestSource. This is a class that will handle interaction with rest points that change the output depending on constraints passed in as parameters.<br>
   RestSource handles caching, queuing of callbacks, aborts and transfers requests as they come in.<br>
   It is assumed that each declared source will have one current state. That means that if you have two views that render data from this source and some constraintPanels,
   And a view calls .get , it will request the most "current" state of constraint model.<br>
   For example imagine a sequence of events <br> <hr>
   currentUrlState : '/search?q=money'<br>
   1.] source.get(callbackA); callbackA queued for '/search?q=money'<br>
   2.] source.get(callbackB); callbackB queued for '/search?q=money'<br>
   change currentUrlState to : '/search?q=test';<br>
   3.] '/search?q=money' xhr is aborted and callbackA and callbackB transferred to queue for '/search?q=test'<br>
   If you want to derive data from the same url but not bind together, simple create new RestSource of that type. <hr>
 * 
 * @example
MySource = new Framework.RestSource.extend({
	url : '/search'
	constraintType : "GET",
	ConstraintModelPrototype : MyConstraintModel // see AbstractConstraintModel for details
});

var source = new MySource();
source.get(function(data){
	console.log(data);
});

 * @constructor
 * @export
 */
Framework.RestSource = Framework.BaseView.extend({
    dataType: "json",
    url: null ,
    
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        this.constraintModel = new this['ConstraintModelPrototype']();
        this.constraintPanels = {};
        this.callbackQueues = {};
        this.cache = {};
        this.countcache = {};
        this._loading = {};
        this.noCache = false;
        if (!this.url) {
            throw "this.url must be defined";
        }
    },
    subscribe: function(constraintPanel) {
        this.constraintPanels[constraintPanel.cid] = constraintPanel;
        if (constraintPanel instanceof Framework.ScrollPaginationPanel) {
            this._contineous = true;
        }
        this.listenTo(constraintPanel, 'constraint:append', function(constraintModel) {
            this.onConstraintAppend(constraintModel, constraintPanel, false);
        }
        .bind(this));
        this.listenTo(constraintPanel, 'constraint:replace', function(constraintModel) {
            this.onConstraintAppend(constraintModel, constraintPanel, true);
        }
        .bind(this));
    },
    
    onConstraintAppend: function(toAppend, constraintPanel, replace) {
        var constraintModel = null ;
        if (replace) {
            constraintModel = toAppend;
        } else {
            constraintModel = this.getConstraintModel();
            constraintModel = constraintModel.union(toAppend);
        }
        if (!(constraintPanel instanceof Framework.PaginationPanel)) {
            constraintModel.setPageNumber(null );
            this._cwrapperdata = null ;
        }
        this.setConstraintModel(constraintModel);
    },
    unsubscribe: function(constraintPanel) {
        delete this.constraintPanels[constraintPanel.cid];
        // I think that's all there is to it.
    },
    
    clearCache: function() {
        this.cache = {};
    },
    
    _triggerChange: function() {
        var constraintModel = this.getConstraintModel();
        var pageNumber = constraintModel.getPageNumber();
        if (!pageNumber) {
            this._cwrapperdata = null ;
        }
        this.trigger('source:change');
    },
    
    onHashChange: function(map) {
        if (this.persistBy && map.hasOwnProperty(this.persistBy)) {
            this._triggerChange();
        }
    },
    
    setConstraintModel: function(constraintModel) {
        if (this.persistBy) {
            this.setParameter('cm', constraintModel.getJSONString());
        } else {
        // TODO -- redo.
        }
    },
    
    getCount: function() {
        return this.count;
    },
    
    
    getAll: function(path, callback, errorcallback) {
        var constraintUrl = "";
        this.constraintModel = this.getConstraintModel();
        if (this.constraintModel && this['ConstraintModelPrototype'].prototype.type == "GET") {
            constraintUrl = "?" + this.constraintModel['getUrl']();
        }
        
        var url = this.url + constraintUrl;
        if (this.countcache.hasOwnProperty(url)) {
            this.count = this.countcache[url];
        }
        if (this.cache[url] == null  || (this._lastPayload && this._lastPayload != this.payload)) {

            if (this._loading[url]) {
                if (!this.callbackQueues[url]) {
                    this.callbackQueues[url] = [];
                }
                this.callbackQueues[url].push(callback);
                return;
            }
            this._loading[url] = true;
            this.callbackQueues[url] = [];
            // override or create new queue
            this.callbackQueues[url].push(callback);
            // add this callback to the queue
            if (this._xhr) {
                if (this._xhr.url) {
                    this.callbackQueues[url] = this.callbackQueues[this._xhr.url].concat(this.callbackQueues[url]);
                    delete this.callbackQueues[this._xhr.url];
                }
                this._xhr.abort();
            }
            this._xhr = $.ajax({
                headers: {
                    Accept: "application/json"
                },
                cache: false,
                contentType: "application/json",
                type: this.constraintType,
                processData: false,
                url: url,
                dataType: this.dataType,
                data: this.payload,
                success: function(data) {
                    var postParse = function(data) {
                        this._loading[url] = false;
                        if (this._contineous) {
                            if (!this._cwrapperdata) {
                                this._cwrapperdata = [];
                            }
                            this._cwrapperdata = this._cwrapperdata.concat(data);
                            data = this._cwrapperdata;
                        }
                        
                        this._lastPayload = this.payload;
                        
                        if (!this.noCache) {
                            this.cache[url] = data;
                            this.countcache[url] = this.count;
                        }
                        
                        for (var i = 0, l = this.callbackQueues[url].length; i < l; i++) {
                            this.callbackQueues[url][i](data);
                        }
                        this.callbackQueues[url] = [];
                    
                    }
                    .bind(this);
                    this['parseAsync'](data, function(result) {
                        postParse(result);
                    }
                    .bind(this));
                
                }
                .bind(this),
                error: function(error) {
                    this._loading[url] = false;
                    if (error.statusText != "abort" && errorcallback) {
                        errorcallback(error);
                    }
                }
                .bind(this)
            });
            this._xhr.url = url;
        
        } else {
            this._xhr.abort();
            callback(this.cache[url]);
        }
    
    },
    refresh: function() {
        this.cache = {};
        this.trigger('source:change');
    }

});
/** @export */
Framework.RestSource.prototype.getConstraintModel = function() {
    if (this.persistBy) {
        var cmStr = this.getParameter(this.persistBy);
        if (cmStr) {
            var constraintModel = new this.ConstraintModelPrototype();
            constraintModel.setFromJSONString(cmStr);
            return constraintModel;
        } else {
            return new this.ConstraintModelPrototype();
        }
    
    } else {
        throw "only persistBy implemented in 1.4";
    }

}

Framework.RestSource.prototype['ConstraintModelPrototype'] = Framework.AbstractConstraintModel;

/** 
First (if not done so prior), RestSource will collect all Constraint Models from subscribed ConstaintPanels. <br>
Then, this.constraintModel will be created by taking an intersection of all the constraint models.
Then, this.constraintModel.getUrl is called to construct the second part of the server request url that contains search constraints.
Then, RestSource issues ajax call and queues corresponding callbacks
Once Response is received, either callbacks or errorcallbacks are called.

@param {function} callback function call upon successful response from server.
@param {function} errorcallback function that handles error response from server.
@example
var source = new MySource();
var callback = function(data){
	// ... do stuff with data
}
var errorcallback = function(data){
	// handle error
}
source.get(callback, errorcallback);
@export {*} */
Framework.RestSource.prototype.get = function(callback, errorcallback) {
    this.getAll(null , callback, errorcallback);
}
/** @export */
Framework.RestSource.prototype.setCount = function(count) {
    this.count = count;
}
/** @export */
Framework.RestSource.prototype.getCount = function() {
    return this.count;
}
Framework.RestSource.prototype['parseAsync'] = function(data, callback) {
    callback(data);
}
