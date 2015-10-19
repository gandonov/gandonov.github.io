Framework.BaseView = Backbone.View.extend({ 
	template : null,
	isRendered : false,
	instantiateView : function(variableName, Constructor, options){
		options = options ? options : {};
		this.cacheView = options.cacheView;
		this.cacheView = true;
		this.cachedHtml = null;

		if(!this.viewsSack){
			this.viewsSack = [];
		}
		this[variableName] = new Constructor(options);

		this[variableName]._position = this.viewsSack.length;
		this[variableName]._parent = this;
		this[variableName]._varname = variableName;
		this.listenTo(this[variableName], 'destroy', function(view){
			if(variableName && this[variableName]){
				this.viewsSack.splice(this[variableName]._position, 1);
				delete this[variableName];				
			}
		}.bind(this));
		this.viewsSack.push(this[variableName]);
		return this[variableName];
	},

	getParameter : function(parameter){
		var hash= location.hash;
		if(hash.length == 0){
			return null;
		};
		var params = hash.substr(1).split('&');
		for(var i = 0, l = params.length; i < l;i++){
			var tokens = params[i].split('=');
			if(tokens[0] == parameter){
				return tokens[1];
			}
		}
		return null;
	},
	setParameter : function(parameter, value){
		var hash= location.hash;
		if(hash.length == 0){
			hash = '#';
		};
		var params = hash.substr(1).split('&');
		if(params[0] == ''){
			params = [];
		}
		var replaced = false;
		for(var i = 0, l = params.length; i < l;i++){
			var tokens = params[i].split('=');
			if(tokens[0] == parameter){
				if(!value){
					params[i] = '';
				}else {
					params[i] = parameter + '=' + value;
				}
				replaced = true;
				break;
			}
		}
		if(!replaced && value){
			params.push(parameter + '=' + value);
		}
		var noEmpty = [];
		for(var i = 0, l = params.length; i < l;i++){
			if(params[i]){
				noEmpty.push(params[i]);
			}
		}
		location.hash = '#' + noEmpty.join('&');
	},

	_killChildren : function(){
    	if(this.viewsSack){
			for(var i = this.viewsSack.length-1; i >=0; i--){
				this.viewsSack[i].destroy();
			}    		
    	}
	},
	events : {},
	noOp : function(){
    	console.log('event block in child class');
    },
	initialize: function(options) { 
		options || (options = {});
		this._options = options;

		if(this.parameterSchema){
			for(var i in this.parameterSchema){
				this[this.parameterSchema[i]] = this.getParameter(i);
			}
		}

		_.bindAll(this, 'render', 'destroy'); 

		var _this = this; 
		this.render = _.wrap(this.render, function(render, b) { 
			_this._beforeRender();
			render(b); 
			_this.afterRender();
			return _this; 
		}); 
		this.destroy = _.wrap(this.destroy, function(destroy, b,c,d) { 
			_this._beforeDestroy();
			destroy(b,c,d); 
			return _this; 
		});
	},
    	
	renderView : function(callback, data){
		if(this.loadingMessage){
			this.$el.html(this.loadingMessage);
		}
		var success = function(html, preloadData) {
			if(this.cacheView){
				this.cachedHtml = html;
			}
			data = data ? data : {};
			data._this = this;
			data._options = this._options;
			this._preloadData = preloadData;
			data._preloadData = preloadData;
			this.$el.html(_.template(html)(data));
			this.render();
			if(callback){
				callback();
			}
		}.bind(this);
		if(this.template != null){
			if(this.cachedHtml){

				if(this.preloadDataAsync){
					this.preloadDataAsync(function(data){
						success(this.cachedHtml, data);
					}, function(){
						success("ERROR in preloadDataAsync", {});
					});
				}else{
					success(this.cachedHtml, {});
				}
				
			}else {
				var ajaxSuccess = function(response){
					if(this.preloadDataAsync){
						this.preloadDataAsync(function(data){
							success(response, data);
						}, function(){
							success("ERROR in preloadDataAsync", {});
						});
					}else{
						success(response, {});
					}					
				}.bind(this);
				$.ajax({
					url: this.template,
					method: 'GET',
					success: ajaxSuccess,
					error : function(response){
						this.$el.html('template [' + this.template + '] failed to load.');
					}.bind(this)
				});				
			}
		}else {
			
			this.render();
			if(callback){
				callback();
			}
		}		
	},

	render: function() { 
		return this; 
	},
	
	afterRender: function() { 
		this.isRendered = true;
	},
	_beforeRender : function(){

	},
	_beforeDestroy : function(){
		// do all extra clean up here
	},
    destroy : function()
    {
    	// recursive destruction of all chidlren.
    	this._killChildren();
		this.undelegateEvents();
		this.$el.removeData().unbind(); 
		if(this.doNotKillDiv){
			this.$el.empty();
			this.stopListening();
		}else {
			this.remove();
		}
		this.trigger('destroy');  	

    }
});