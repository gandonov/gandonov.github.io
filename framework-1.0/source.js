Framework.RestSource = Backbone.View.extend({
    dataType : "json",
    constraintType : "POST",
    url : null,

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
    	if(this.url == null){
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

    get : function(callback, errorcallback){
    	this.getAll(callback, errorcallback);
    },
    
    getAll : function(callback, errorcallback){
        var constraintUrl = "";
		this.constraintModel = this._getConstaintModelFromPanels();
        if(this.constraintModel && this.constraintType == "GET"){
            constraintUrl = "?" + this.constraintModel.getUrl();
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
            callback(this.cache[url]);
        }

    },
    destroy : function(){
    	console.log('destroying source');
    },
    refresh : function(){
        this.cache = {};
        this.trigger('source:refresh');
    }, 

});
