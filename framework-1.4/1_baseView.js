
/**
 * Base View. All other classes must inherit from it. 
 * @example MyClass = Framework.BaseView.extend({ });
 * @constructor
 * @export
 */
Framework.BaseView = Backbone.View.extend({
    /** @lends Framework.BaseView.prototype */
    template: null ,
    isRendered: false,
    
    snippets: {},
    
    doNotKillDiv: true,
	
    oldURL: "",
    newURL: location.href,


    
    setOverlay: function() {
        this.__$temp = null ;
        if (this.loadingTemplate && Framework.templateCache[this.loadingTemplate]) {
            this.__$temp = $(Framework.templateCache[this.loadingTemplate])
        } else if (this['overlayClass']) {
            this.$('.' + this['overlayClass']).remove();
            this.$el.append('<div class="' + this['overlayClass'] + '"></div>');
            return;
        } else {
            this.__$temp = $('<div>Validate Async In Progress (this.loadingTemplate == null)</div>');
        }
        this.__$children = this.$el.children();
        this.__$children.detach();
        this.$el.append(this.__$temp);
    },
    removeOverlay: function() {
        if (this['overlayClass']) {
            this.$('.' + this['overlayClass']).remove();
        } else {
            this.$el.append(this.__$children);
            this.__$temp.remove();
            this.__$temp = null ;
        }
    
    },
    
    validateView: function(callback, error) {
        this.setOverlay();
        this.validateAsync(function(data) {
            this.removeOverlay();
            callback(data);
        }
        .bind(this), function(data) {
            this.removeOverlay();
            error(data);
        }
        .bind(this));
    
    },
    
    validateAsync: function(callback, error) {
        console.log('validateAsync is empty, override me');
        callback({});
    },
    
    _killChildren: function() {
        for (var i in this.viewsSack) {
            this.viewsSack[i].destroy();
        }
    },
    // calls on renderView or destroy
    _terminateAllActiveXHRs: function() {
        if (this._xhrs) {
            for (var i = 0, l = this._xhrs.length; i < l; i++) {
                this._xhrs[i].abort();
            }
            this._xhrs = null ;
        }
    },
    _getParameters: function(url) {
        url = url.split('?');
        if (url.length > 1) {
            url = url[1];
        } else {
            url = url[0];
        }
        var url = url.split('#');
        if (url.length > 1) {
            url = url[1];
        } else {
            url = url[0];
        }
        url = url.split('&');
        var map = {};
        for (var i = 0, l = url.length; i < l; i++) {
            var tokens = url[i].split('=');
            map[tokens[0]] = tokens[1];
        }
        return map;
    
    },
    _diff: function(oldMap, newMap) {
        var diff = {};
        for (var i in newMap) {
            if (!oldMap[i] || oldMap[i] != newMap[i]) {
                try {
                    diff[i] = decodeURI(newMap[i]);
                } catch (e) {
                    diff[i] = newMap[i];
                }
            
            }
        }
        // if something disappeared
        for (var i in oldMap) {
            if (!newMap[i]) {
                diff[i] = null ;
            }
        }
        return diff;
    },
    
    /** @private */
    initialize: function(options) {
        this.viewsSack = {};
        options || (options = {});
        this._options = options;

        this._parent = options._parent;
        if (this.onHashChange) {
            $(window).on('hashchange.' + this.cid, function(e) {
                // var originalEvent = e.originalEvent;
                // var newURL = originalEvent.newURL;
                // var oldURL = originalEvent.oldURL;
                //i.e doesn't seem to pass old/new URL in originalEvent obj...
                this.oldURL = this.newURL;
                this.newURL = location.href;
                var oldURL = this.oldURL;
                var newURL = this.newURL;
                var newParameters = this._getParameters(newURL);
                var oldParameters = this._getParameters(oldURL);
                var diff = this._diff(oldParameters, newParameters);
                // console.log(diff);
                this.onHashChange(diff);
            }
            .bind(this));
        }

        
        _.bindAll(this, 'render', 'destroy');
        
        var _this = this;
        this.render = _.wrap(this.render, function(render, b) {
            _this._beforeRender();
            render(b);
            _this.afterRender();
            return _this;
        }
        );
        this.destroy = _.wrap(this.destroy, function(destroy, b, c, d) {
            _this._beforeDestroy();
            destroy(b, c, d);
            return _this;
        }
        );
    },
    /** @private */
    _renderView: function(callback, data) {
        this._terminateAllActiveXHRs();
        var success = function(html, preloadData) {
            
            data = data ? data : {};
            data['_this'] = this;
            data['_options'] = this._options;
            this['_preloadData'] = preloadData;
            data['_preloadData'] = preloadData;
            
            this.$el.html(_.template(html)(data));
            
            this.render();
            if (callback) {
                callback();
            }
        }
        .bind(this);
        if (this.template != null ) {
            if (Framework.templateCache[this.template]) {
                
                this['preloadDataAsync'](function(data) {
                    success(Framework.templateCache[this.template], data);
                }
                .bind(this)
                , function(errorResp) {
                    var str = (this.errorTemplate && Framework.templateCache[this.errorTemplate]) ? Framework.templateCache[this.errorTemplate] : "ERROR in preloadDataAsync";
                    success(str, errorResp);
                }
                .bind(this)
                );
            
            } else {
                var ajaxSuccess = function(response) {
                    if (Framework.CACHE_TEMPLATES) {
                        Framework.templateCache[this.template] = response;
                    }
                    this['preloadDataAsync'](function(data) {
                        success(response, data);
                    }
                    .bind(this)
                    , function(errorResp) {
                        var str = (this.errorTemplate && Framework.templateCache[this.errorTemplate]) ? Framework.templateCache[this.errorTemplate] : "ERROR in preloadDataAsync";
                        success(str, errorResp);
                    }
                    .bind(this)
                    );
                }
                .bind(this);
                $.ajax({
                    url: this.template,
                    method: 'GET',
                    success: ajaxSuccess,
                    error: function(response) {
                        this.$el.html('template [' + this.template + '] failed to load.');
                    }
                    .bind(this)
                });
            }
        } else {
            
            this['preloadDataAsync'](function(data) {
               	    this._preloadData = data;
		    this.render();
		    
		if (callback) {
                	callback();
            	}
            }
            .bind(this), function() {
                this.$el.html("ERROR in preloadDataAsync");

            }
            .bind(this));
            

        }
    },
    /** @override */
    render: function() {
        return this;
    },
    /** @private */
    afterRender: function() {
        this.isRendered = true;
    },
    /** @private */
    _beforeRender: function() {
    
    },
    /** @private */
    _beforeDestroy: function() {
    // do all extra clean up here
    }

});

/** Use this method instead of $.ajax to get data
* This will ensure proper handling of xhr --
* If the view is destroyed before xhr completes, it will be aborted and any callbacks associated withit will not be executed. 
* @export {*} 
* @param {string} url to be passed in the ajax call
* @param {function} success callback on success of the xhr call
* @param {function} error callback method on error of the xhr call
* @param {object} options additional options such as type, data, etc..
* @example this.getJSON('/someUrl', function(data){
    console.log(data);
    }); 
});
*/
Framework.BaseView.prototype.getJSON = function(url, success, error, data, type,  extra) {
    if (!this._xhrs) {
        this._xhrs = [];
    }
    var options = {
        headers: {
            Accept: "application/json, text/javascript, */*; q=0.01"
        },
        cache: false,
        contentType: "application/json",
        type: type ? type : "GET",
        processData: false,
        url: url,
        success: success,
        error: error
    };
    if (data) {
        options.type = type ? type : "POST";
        options.data = JSON.stringify(data);
        options.dataType = "json";
        
        delete options.processData;
    }
    if(extra){
        options.headers = extra && extra.headers ? extra.headers : options.headers;
    }
	if(extra && extra.timeout){
        options.timeout = extra.timeout;
    }
    var xhr = $.ajax(options);
    this._xhrs.push(xhr);
}
;
/** @export {string} */
Framework.BaseView.prototype.postJSON = function(url, success, error, data, type, extra) {
    this.getJSON(url, success, error, data, type, extra);
}
;
/** @export {string} */
Framework.BaseView.prototype.errorTemplate = null ;

/** @export {string} */
Framework.BaseView.prototype.loadingTemplate = null ;

/** @export {function(string):string} */
Framework.BaseView.prototype.getParameter = function(parameter) {
    var hash = location.hash;
    if (hash.length == 0) {
        return null ;
    }
    ;
    var params = hash.substr(1).split('&');
    for (var i = 0, l = params.length; i < l; i++) {
        var tokens = params[i].split('=');
        if (tokens[0] == parameter) {
            try {
                return decodeURI(tokens[1]);
            } catch (e) {
                return tokens[1];
            }
        
        }
    }
    return null ;
}
/**
 * You can Use this method to set Url parameter
 * @example this.setParameter('q', 'name="test"');
 * @export {function(string,string)} 

*/
Framework.BaseView.prototype.setParameter = function(parameter, value) {
    var hash = location.hash;
    location.hash = this._getNewHash(hash, parameter, value);
}
;


/**
 * You can Use this method to set parameter map to url, useful if you want to set multiple while setting url just once.
 * @example this.setParameters({ a : 'a', b : 'b'});
 * @export {function(Object)} 

*/
Framework.BaseView.prototype.setParameters = function(map, replaceState) {
    var result = location.hash;
    for (var parameter in map) {
        result = this._getNewHash(result, parameter, map[parameter]);
    }
    if(!replaceState){
        location.hash = result;
    }else {
        history.replaceState(null, null, result);   
    }
    
}
;


Framework.BaseView.prototype._getNewHash = function(hash, parameter, value) {
    if (value) {
        value = encodeURI(value);
    }
    if (hash.length == 0) {
        hash = '#';
    }
    var params = hash.substr(1).split('&');
    if (params[0] == '') {
        params = [];
    }
    var replaced = false;
    for (var i = 0, l = params.length; i < l; i++) {
        var tokens = params[i].split('=');
        if (tokens[0] == parameter) {
            if (!value) {
                params[i] = '';
            } else {
                params[i] = parameter + '=' + value;
            }
            replaced = true;
            break;
        }
    }
    if (!replaced && value) {
        params.push(parameter + '=' + value);
    }
    var noEmpty = [];
    for (var i = 0, l = params.length; i < l; i++) {
        if (params[i]) {
            noEmpty.push(params[i]);
        }
    }
    var result = '#' + noEmpty.join('&');
    return result;
}
/** Destroys view. Removes all handles from parent, removes all rendered DOM elements (including this.$el)
* If there any xhr in progress created by this.getJSON, they will be aborted. Backbone events are undelegated.
* @todo Option not to remove parent div
* @fires Framework.BaseView#destroy
* @export {function()} */
Framework.BaseView.prototype.destroy = function() {
    // kill off all registered xhrs to prevent side effects
    this._terminateAllActiveXHRs();
    // recursive destruction of all chidlren.
    this._killChildren();
    if (this.onHashChange) {
        $(window).off('hashchange.' + this.cid);
    }
    this.undelegateEvents();
    if (this._parent && this._parent.viewsSack[this.cid]) {
        delete this._parent.viewsSack[this.cid];
    }
    this.$el.removeData().unbind();
    if (this.doNotKillDiv) {
        this.$el.empty();
        this.stopListening();
    } else {
        this.remove();
    }
    this.trigger('destroy', this);
}
;

/** 
* Renders View into desired DOM element (provided it is set prior with backbone's setElement(el) )
* Define template field with the path to your html template and it will be rendered then
* If you do not define template field, this method will not render template but goes directly to render()
* (render() executes last, regradless of whether the template is present or not )
* @example
MyView = Framework.BaseView.extend({
   template : 'templates/MyView.html' 
});

var myView = new MyView();
myView.setElement($('#myElement')).renderView();

@export {*} */
Framework.BaseView.prototype.renderView = function(callback, data) {
    this._loadSnippets(function() {
        if (this.loadingMessage) {
            this.$el.html(this.loadingMessage);
            this._renderView(callback, data);
        } else if (this['overlayClass']) {
            this.$('.' + this['overlayClass']).remove();
            this.$el.append('<div class="' + this['overlayClass'] + '"></div>');
            this._renderView(callback, data);
        } else if (this['loadingTemplate']) {
            if (Framework.templateCache[this['loadingTemplate']]) {
                this.$el.html(Framework.templateCache[this['loadingTemplate']]);
                this._renderView(callback, data);
            } else {
                this.$el.html("");
                $.ajax({
                    url: this['loadingTemplate'],
                    method: 'GET',
                    cache: Framework.CACHE_TEMPLATES,
                    success: function(response) {
                        Framework.templateCache[this['loadingTemplate']] = response;
                        this._renderView(callback, data);
                    }
                    .bind(this),
                    error: function(response) {
                        Framework.templateCache[this['loadingTemplate']] = 'Loading Template [' + this['loadingTemplate'] + '] failed to load.';
                        this._renderView(callback, data);
                    }
                    .bind(this)
                });
            }
        } else {
            this._renderView(callback, data);
        }
    }
    .bind(this));
}

Framework.BaseView.prototype.snippet = function(name, data) {
    var s = this.snippets[name];
    if (!s) {
        throw "error: snippet " + name + " is not declared in the prototype.";
    } else {
        return _.template(Framework.templateCache[s])(data);
    }
}

Framework.BaseView.prototype._loadSnippets = function(callback) {
    if(this.errorTemplate){
        this.snippets['__errorTemplate'] = this.errorTemplate;
    }
    var count = _.keys(this.snippets).length;
    if (count == 0) {
        callback();
        return;
    }
    var cb = function() {
        count--;
        if (count <= 0) {
            callback();
        }
    }
    for (var i in this.snippets) {
        var s = this.snippets[i];
        if (Framework.templateCache[s]) {
            cb();
        } else {
            var xhr = $.ajax({
                url: s,
                method: 'GET',
                cache: Framework.CACHE_TEMPLATES,
                success: function(response, c, d, e) {
                    Framework.templateCache[d.dirtyClosureHack] = response;
                    cb();
                }
                .bind(this),
                error: function(response, c, d, e) {
                    Framework.templateCache[response.dirtyClosureHack] = 'Loading Template [' + response.dirtyClosureHack + '] failed to load.';
                    cb();
                }
                .bind(this)
            });
            xhr.dirtyClosureHack = s;
        }
    }
}

/** 
@param {Object} Constructor constructor of the class (must extend from Framework.BaseView);
@param {Object} options pass in additional options, they can be accessed immediately via this._options
@returns {Object} reference to new child view.
@example
MySubView = Framework.BaseView.extend({
    render : function(){
        this.$el.html('rendered. Proud child of ' + this._parent.cid);
    }
});

MyView = Framework.BaseView.extend({
    initialize : function(options){
        Framework.BaseView.prototype.initialize.call(this, options);
        this.mySubView = this.instantiate(MySubView);
    },
    render : function(){
        this.mySubView.setElement(this.$('#subView')).renderView();
    }
});
@export {*} */
Framework.BaseView.prototype.instantiate = function(Constructor, options) {
    options = options ? options : {};
    options._parent = this;
    var view = new Constructor(options);
    this.viewsSack[view.cid] = view;
    return view;
}
;

/** @export {*} 
* @returns {Object} returns parent view
*/
Framework.BaseView.prototype.getParent = function() {
    return this._parent;
}


/** @export {*} 
* @returns {Object|Array} returns all instantiated children views within this view
*/
Framework.BaseView.prototype.getChildren = function() {
    return this.viewsSack;
}
;
/** 
* Override this function to preload data asynchronously. Data will become available in this._preloadData after renderView() is called, but before render()
* @param {callback} callback function to be executed by base view upon completion

* @example 
MyView = Framework.BaseView.extend({
 preloadDataAsync : function(callback, error){  
    this.getJSON('/someUrl', callback, error); 
 },
 render : function(){
     console.log(this._preloadData);
 }
});

*/
Framework.BaseView.prototype['preloadDataAsync'] = function(callback, error) {
    callback({});
}
