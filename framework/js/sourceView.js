AWFramework.SourceView = AWFramework.BaseView.extend({
	el : '#sourceView',
	//viewSelectionPanelEl : '#viewSelectionPanelEl',
	recordSelectionPanelEl : null,
	viewers : [AWFramework.AbstractViewer],
	recordSelectionPanelPrototype : AWFramework.AbstractRecordSelectionPanel,
	viewSelectionPanelPrototype : AWFramework.ViewSelectionPanel,
	id : 'uuid',
	initialView : 'undefined',
	checkboxSelection : true,
	checkedRecords : {},
	columns : null,
	initialize : function(options) {
		var options = options ? options : {};
		this.markedRecordsMap = {};
		AWFramework.BaseView.prototype.initialize.call(this, options);
		if(options.initialView){
			this.initialView = options.initialView;
		}	
		this.columns = options.columns;
	    this.source = options.source;
	    this.clearOnConstraintChange = options.clearOnConstraintChange;
	    this.recordSelectionPanel = new this.recordSelectionPanelPrototype({	
			parent : this,
		});
	    this.viewSelectionPanel = new this.viewSelectionPanelPrototype({ viewers : this.viewers, initialView : this.initialView});

	    if(this.source){
			this.listenTo(this.source, 'source:constraintChange', this.onConstraintChange);
			this.listenTo(this.source, 'source:refresh', this.onConstraintChange);	    	
	    }

	    this.listenTo(this.viewSelectionPanel, 'viewSelectionPanel:change', this.handleChangeView);

		for(var i = this.viewers.length-1; i >=0; i--){
			this.instantiateView(this.viewers[i].prototype.name, this.viewers[i], 
				{	
					markedRecordsMap : this.markedRecordsMap,
					columns : this.columns,
					parent : this,
					source : this.source
				}
			);
			this.listenTo(this[this.viewers[i].prototype.name], 'dblclick', this.handleDblclick);
			this.listenTo(this[this.viewers[i].prototype.name], 'click', this.handleClick);
			this.listenTo(this[this.viewers[i].prototype.name], 'mouseover', this.handleMouseover);
			this.listenTo(this[this.viewers[i].prototype.name], 'mouseleave', this.handleMouseleave);

			this.listenTo(this[this.viewers[i].prototype.name], 'viewer:change', this.handleViewerChange);
			this.listenTo(this[this.viewers[i].prototype.name], 'viewer:setRecord', this.handleViewerSetRecord);
		}
		if(!this[this.initialView] && this.viewers.length > 0){
			if(!this.initialView){
				var example = "window.YourView = SourceView.extend({ initialView : 'grid' }) // where 'grid' resolves to GridViewer.prototype.name";
				throw "initial view must be either passed in the viewer or defined in the extended view i.e: " + example;				
			}else {
				throw "unresolved initialView: " + this.initialView;
			}

		}

	},
	handleMouseover : function(record){
		this.trigger('mouseover', record);
	},
	handleMouseleave : function(record){
		this.trigger('mouseleave', record);
	},
	handleDblclick : function(record){
		this.trigger('dblclick', record);
	},
	handleClick : function(record){
		this.trigger('click', record);	
	},
	handleViewerSetRecord : function(id){
		this.currentId = id;
		this.trigger('viewer:setRecord', id);
	},

	currentId : null,
	
	setColumns : function(columns){
		this.columns = columns;
		this.onConstraintChange();
	},
	
	selectAll : function(){
		this.source.getAll(null, function(data){
			for(var i = data.length-1; i>= 0; i--){
				this.markedRecordsMap[data[i][this.id]] = data[i];
			}
			this.handleViewerChange();
			if(this.viewer){
				this.viewer.show(data);				
			}
			this.trigger('selectionChanged');
	    }.bind(this));
	},

	clearSelection : function(){
		for(var i in this.markedRecordsMap){
			delete this.markedRecordsMap[i];
		}
		this.trigger('selectionCleared');
		this._refresh();
	},

	_refresh : function(){
		this.handleViewerChange();
		if(this.source){
			this.source.getAll(null, function(data){
				if(this.viewer){
					this.viewer.show(data);					
				}

			}.bind(this));			
		}
	},

	clearPageSelection : function(){
		this.source.getAll(null, function(data){
			for(var i = data.length-1; i>= 0; i--){
				delete this.markedRecordsMap[data[i][this.id]];
			}
			this.handleViewerChange();
			this.viewer.show(data);
	    }.bind(this));		
	},

	onConstraintChange : function(){  
		if(this._disabled){
			return;
		}
		if(this.clearOnConstraintChange){
			this.clearSelection();		
		}
		if(this.viewer){
			this.viewer.onLoading();
			this.$('#viewerProgressBar').show();
			this.source.getAll(null, function(data){
				this.$('#viewerProgressBar').hide();
				this.recordSelectionPanel.update();
				this.viewer.show(data);
				this.setDirtyForAllButCurrent();
			}.bind(this));			
		}

	},
	render : function() {

		var $holder = $('<div id="viewer_holder" style="position: relative; height: 100%;width:100%;overflow-x: hidden;overflow-y: hidden; display: block;">');
		this.$el.empty();

		    
		this.$el.append('<div id="viewerProgressBar" class="progress" style="display:none;margin-bottom: -6px;margin-top: 2px;"><div class="indeterminate"></div></div>')
		this.$el.append($holder);
		for(var i = this.viewers.length-1; i >=0; i--){
			var $viewerDiv = $('<div id="'+this.viewers[i].prototype.name+'" class="record_viewer"></div>');
			$holder.append($viewerDiv);
			this[this.viewers[i].prototype.name].setElement($viewerDiv).renderView();			
		}
	    
	    var $el = this.viewSelectionPanelEl;
		if(this.viewers.length > 1){
			if(!$el){
				$el = $('<div id="viewSelectionPanelEl">');
				this.$el.prepend($el);			
			}

			this.viewSelectionPanel.setElement($el).render();			
		}


		$el = this.recordSelectionPanelEl;
		if(!$el){
			$el = $('<div id="viewerRecordSelectionPanelEl">');
			this.$el.prepend($el);			
		}
		this.recordSelectionPanel.setElement($el).renderView();
		this.handleChangeView(this.initialView);

		this.pressed={};
		$(document).on( "keydown", function(e){
			 e = e || window.event;
			 this.pressed[e.keyCode] = true;
		}.bind(this));

		$(document).on( "keyup", function(e){
			 e = e || window.event;
			 delete this.pressed[e.keyCode];
		}.bind(this));

	},
	handleViewerChange : function() {
		this.recordSelectionPanel.update();
		this.setDirtyForAllButCurrent();	
	},
	handleChangeView : function(viewer) {
		this.setViewer(viewer);
		if(this.viewer){
			this.viewer.focus();
		}
	},

	setDirtyForAllButCurrent : function(){
		for(var i = this.viewers.length-1; i >=0; i--){
			if(this.viewer == this[this.viewers[i].prototype.name]){
				continue;
			}
			this[this.viewers[i].prototype.name].dirty = true;			
		}
	},
	setViewer : function(viewer) {
		this.viewer = this[viewer];
		for(var i = this.viewers.length-1; i >=0; i--){
			this.$('#' + this.viewers[i].prototype.name).hide();
		};		
		this.$('div#' + viewer).show();
		if(this.viewer && this.viewer.dirty){
			this.source.getAll(null, function(data){
				this.viewer.show(data);
			}.bind(this));			
		}
	}
});