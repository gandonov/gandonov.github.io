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
Framework.RestSource = Backbone.View.extend({
    dataType : "json",
    url : null,



    initialize : function(){
    	this.constraintModel = new this['ConstraintModelPrototype']();
    	this.constraintPanels = {};
    	this.callbackQueues = {};
    	this.cache = {};
    	this.countcache = {};
    	this.preParseCache = {};
    	this._loading = {};
    	this.noCache = false;
    	if(!this.url){
    		throw "this.url must be defined";
    	}
    },
    subscribe : function(constraintPanel){
        this.constraintPanels[constraintPanel.cid] = constraintPanel;
        if(constraintPanel instanceof Framework.ScrollPaginationPanel){
        	this._contineous = true;
        }
        this.listenTo(constraintPanel, 'constraintPanel:changed', this.onConstraintPanelChanged);
    },
	unsubscribe : function(constraintPanel){
		delete this.constraintPanels[constraintPanel.cid];
		// I think that's all there is to it.
	},
	putConstraintModel : function(constraintModel){
		this.constraintModel = constraintModel;
		for(var i in this.constraintPanels){
			var cp = this.constraintPanels[i];
			cp.putConstraintModel(this.constraintModel);
		}
	},
	_getConstaintModelFromPanels : function(resetPagers){
        var constraintModel = new this['ConstraintModelPrototype']();
        for(var i in this.constraintPanels){
            var cp = this.constraintPanels[i];
            if(resetPagers && cp instanceof Framework.PaginationPanel){
				this._cwrapperdata = null;
                cp.reset();
            }
           constraintModel = constraintModel.intersection(cp['getConstraintModel']());
        }    
        return constraintModel;		
	},
    onConstraintPanelChanged : function(constraintPanel){
        var resetPagers = !(constraintPanel instanceof Framework.PaginationPanel);
        if(resetPagers){
        	this._cwrapperdata = null;
        }
        var constraintModel = this._getConstaintModelFromPanels(resetPagers);
        this.setContstraints(constraintModel,constraintPanel);
    },

    clearCache : function(){
    	this.cache = {};
    },
    

    // setting constraint will make getAll doPost with payload = to constraintModel
    setContstraints : function(constraintModel, constraintPanel)
    {
        this.setConstraintModel(constraintModel);
        this.trigger('source:constraintChange', constraintPanel);
    },

    setConstraintModel : function(constraintModel){
        this.constraintModel = constraintModel;
        if(this['ConstraintModelPrototype'].prototype.type == "POST"){
        	//TODO, there is no getBody yet
            this.payload = JSON.stringify(constraintModel.getBody());
        }else {
            this.constraintUrl = this.constraintModel['getUrl']();
        }    	
    },

    getCount : function(){
    	return this.count;
    },

    
    getAll : function(path,callback, errorcallback){
        var constraintUrl = "";
		this.constraintModel = this._getConstaintModelFromPanels();
        if(this.constraintModel && this['ConstraintModelPrototype'].prototype.type == "GET"){
            constraintUrl = "?" + this.constraintModel['getUrl']();
        }

        var url = this.url + constraintUrl;
        if(this.countcache[url]){
        	this.count = this.countcache[url];
        }
        if(this.cache[url] == null || (this._lastPayload && this._lastPayload != this.payload)){
            if(this._loading[url]){
                if(!this.callbackQueues[url]){
                   this.callbackQueues[url] = []; 
                }
                this.callbackQueues[url].push(callback);
                return;
            }
            this._loading[url] = true;
            this.callbackQueues[url] = []; // override or create new queue
            this.callbackQueues[url].push(callback); // add this callback to the queue
        	if(this._xhr){
        		if(this._xhr.url){
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
                    processData : false,
                    url: url ,	
			        dataType: this.dataType,
			        data:  this.payload,		
                    success: function(data) {
						if(!this.noCache){
							this.preParseCache[url] = data;
						}
                    	if(this.setCount){
                    		this.setCount(data);
                    	}
                        if(this['parse__' + this.url]){
                        	this['parse__' + this.url](data);
                        }else
                        if(this.parse){
                            data = this.parse(data);
                        }
                        var postParse = function(data){
                        	this._loading[url] = false;
                        	if(this._contineous){
                        		if(!this._cwrapperdata){
                        			this._cwrapperdata = [];
                        		}
                        		this._cwrapperdata  = this._cwrapperdata.concat(data);
                        		data = this._cwrapperdata;
                        	}

                            this._lastPayload = this.payload;

                            if(!this.noCache){
								this.cache[url] = data;
								this.countcache[url] = this.count;
							}
							
                            for(var i = 0, l =  this.callbackQueues[url].length; i < l; i++){
                                 this.callbackQueues[url][i](data);
                            }
                            this.callbackQueues[url] = [];
                            
                        }.bind(this);
                        if(this['parseAsync__' + this.url]){
                        	this['parse__' + this.url](data);
                        }else if(this['parseAsync']){
                            this['parseAsync'](data, function(result){
                                postParse(result);
                            }.bind(this));
                        }else {
                            postParse(data);
                        }
                        
                    }.bind(this),
                    error : function(error){
                    	this._loading[url] = false;
                        if(error.statusText != "abort"){
							 if(errorcallback){
								errorcallback(error);
							}else {
								console.log('error:');
								console.log(error);
							}                      	
                        }

                    }.bind(this)
            });
            this._xhr.url = url;

        }else {
            callback(this.cache[url]);
        }

    },
    destroy : function(){
    	console.log('destroying source');
    },
    refresh : function(){
        this.cache = {};
        this.trigger('source:refresh');
    }

});
/** @export */
Framework.RestSource.prototype.getConstraintModel = function(){
	return this.constraintModel;
};


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
Framework.RestSource.prototype.get = function(callback, errorcallback){
	this.getAll(null,callback, errorcallback);
};
/** @export */
Framework.RestSource.prototype.setCount = function(count){
	this.count = count;
};
/** @export */
Framework.RestSource.prototype.getCount = function(){
	return this.count;
};
