Framework.RestSource = Backbone.View.extend({
    dataType : "json",
    constraintType : "POST",
    ConstraintModelPrototype : Framework.AbstractConstraintModel,

    initialize : function(){
    	this.constraintModel = new this.ConstraintModelPrototype();
    	this.constraintPanels = {};
    	this.callbackQueues = {};
    	this.cache = {};
    	this.countcache = {};
    	this.preParseCache = {};
    	this._loading = {};
    	this.noCache = false;
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
        var constraintModel = new this.ConstraintModelPrototype();
        for(var i in this.constraintPanels){
            var cp = this.constraintPanels[i];
            if(resetPagers && cp instanceof Framework.PaginationPanel){
				this._cwrapperdata = null;
                cp.reset();
            }
           constraintModel = constraintModel.intersection(cp.getConstraintModel());
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

    getCount : function(){
    	return this.count;
    },

    arrayStructure : {
        "root" : "/array",
        "auxA" : "/array/{%id%}/auxA",
        "auxA->data" : "/array/{%id%}/auxA/data",
    },
    rootStructure : {
        "root" : "/records",
        "auxA" : "/records/{%id%}/auxA",
        "auxB" : "/records/{%id%}/auxB",
        "auxA->data" : "/records/{%id%}/auxA/data",
        "array[arrayStructure]" : "/records/{%id%}/array",        
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
        if(this.constraintType == "POST"){
            this.payload = JSON.stringify(constraintModel.attributes);
        }else {
            this.constraintUrl = this.constraintModel.getUrl();
        }    	
    },
    // usage

    // source.getById('array/auxA->data', callback ,32, 11);
    // this will:
    // 1.) see if rootStructure is fetched, if not fetch it.
    // 2.) see if arrayStructure is fetched for 32, if not fetch it.
    // 3.) see if auxA for 11 is fetched, if not fetch it.
    // 4.) see if data is fetched, if not fetch it.

    // null, or path to root of structure

    getAll : function(path, callback, errorcallback, arg1, arg2, arg3, arg4, arg5, arg6){
        var constraintUrl = "";
       // if(!this.constraintModel){
			this.constraintModel = this._getConstaintModelFromPanels();
      //  }
        if(this.constraintModel && this.constraintType == "GET"){
            constraintUrl = "?" + this.constraintModel.getUrl();
        }

        var url = this._getUrl(path, arg1, arg2, arg3, arg4, arg5, arg6) + constraintUrl;
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
                        if(this['parse__' + path]){
                        	this['parse__' + path](data);
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
                        if(this['parseAsync__' + path]){
                        	this['parse__' + path](data);
                        }else if(this.parseAsync){
                            this.parseAsync(data, function(result){
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
// 			if(this.setCount){
// 				this.setCount(this.preParseCache[url]);
// 			}
			
            callback(this.cache[url]);
        }

    },

    destroy : function(){
    	console.log('destroying source');
    },

    deleteAll : function(path, callback){

    },
    deepDelete : function(path, callback){

    },

    refresh : function(path, arg1, arg2, arg3, arg4, arg5, arg6){
        var url = this._getUrl(path, arg1, arg2, arg3, arg4, arg5, arg6);
        this.cache = {};
        this.trigger('source:refresh');
    }, 
    _getUrl : function(path, arg1, arg2, arg3, arg4, arg5, arg6) {
        var url = "";
        if(!path || path == ""){
            url = this.rootStructure["root"];
            return url;
        }
        if(this.rootStructure[path]){
            var compiled = this.rootStructure[path];
            if(arg1){
                compiled = compiled.replace('{%id%}', arg1);
            }
			if(arg2){
                compiled = compiled.replace('{%id1%}', arg2);
            }
            return compiled;
        }
        return url;
    }

});
