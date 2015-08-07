AWFramework.AbstractViewer = AWFramework.AbstractConstraintPanel.extend({

	name : 'abstractViewer',
	rowIdProperty : 'uuid',
	events : {

		'mousedown' : 'onMousedown',
		'mouseup' : 'onMouseup',
		'mouseover .aw-record' : 'onMouseover',
		'mouseleave .aw-record' : 'onMouseleave',
		'mousedown .aw-record' : 'onClick',
		"change .aw-checkbox" : "toggleCheckbox",
		'mousemove' : 'onMousemove',
		'mouseleave' : 'onMouseup'	
	},


	onClick : function(e){
		var $e = $(e.currentTarget);
		var id = $e.data('id');
		var record = this._getRecordById(id);
		var time = Date.now();
		if(!this._lc){
			this._lc = { id : id, record: record, time : time};
			this.trigger('click', record);
		}else if(this._lc.id == id && (time - this._lc.time) < 400){
			this.trigger('dblclick', record);
			this._lc = null;
		}else {
			this.trigger('click', record);
			this._lc = { id : id, record: record, time : time};
		}	
	},

	onMousemove : function(e){
		if(this._d){
			var minx = Math.min(e.clientX, this._d.x);
			var maxx = Math.max(e.clientX, this._d.x);
			var miny = Math.min(e.clientY, this._d.y);
			var maxy = Math.max(e.clientY, this._d.y);
			
			this._d.$div.css({
				width : maxx - minx,
				height : maxy - miny,
				left : (e.clientX < this._d.x) ? e.clientX : this._d.x,
				top : (e.clientY < this._d.y) ? e.clientY : this._d.y
			});
			var $array = this.$('.aw-record');
			if(!this._d.ctrlKey){
				$array.removeClass('aw-selected');
				this.parent.markedRecordsMap = {};				
			}

			var rect2 = this._d.$div[0].getBoundingClientRect();
			
			for(var i = 0, l = $array.length; i < l; i++){
				var el = $array[i];
				var rect1 = el.getBoundingClientRect();
				var overlap = !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
               	if(overlap){      
               		var $el = $(el);  
               		var id = $el.data('id');
					var searchObject = {};
					searchObject[this.parent.id] = id;

					var record = _.findWhere(this._records, searchObject);
					this.parent.markedRecordsMap[id] = record;
               		$el.addClass('aw-selected');       		
               	}
			}
			this.trigger('viewer:change');
			this.parent.trigger('selectionChanged');
		}
		
	},

	onMousedown : function(e){
		if(!this.parent.checkboxSelection){
			var $div = $('<div>');
			this._d = { x : e.clientX, y : e.clientY, $div : $div, ctrlKey : e.ctrlKey};

			$div.css({
				position: 'fixed',
				left : this._d.x +'px',
				top : this._d.y + 'px',
				width: '1px',
				height: '1px',
				'border' : '2px solid yellow'
			})
			this.$el.append($div);
			var rect2 = $div[0].getBoundingClientRect();
			var $array = this.$('.aw-selected');
			for(var i = 0, l = $array.length; i < l; i++){
				var el = $array[i];
				var rect1 = el.getBoundingClientRect();
				var overlap = !(rect1.right < rect2.left || 
				rect1.left > rect2.right || 
				rect1.bottom < rect2.top || 
				rect1.top > rect2.bottom);
				if(overlap){      
					var $el = $(el);
					var id = $el.data('id');
					if(this._d.ctrlKey){
						$el.removeClass('aw-selected');

						delete this.parent.markedRecordsMap[id];
						this._d = null;
						$div.remove();
						this.trigger('viewer:change');
						this.parent.trigger('selectionChanged');
						//return;					
					}
				}
			};		
		}
		
		//return false;
	},
	onMouseup : function(e){
		this.onMousemove(e);
		if(this._d){
			this._d.$div.remove();
		}
		this._d = null;
	},

	onMouseover : function(e){
		var id = $(e.currentTarget).data(this.parent.id);
		var record = this._getRecordById(id);
		this.trigger('mouseover', record);	
	},
	onMouseleave : function(e){
		var id = $(e.currentTarget).data(this.parent.id);
		var record = this._getRecordById(id);
		this.trigger('mouseleave', record);		
	},
	focus : function(){
		console.log('focus not implemented');
	},
	
	afterRecordSet : function(){

	},
	_getRecordById : function(id){
		var searchObject = {};
		searchObject[this.parent.id] = id;
		return _.findWhere(this._records, searchObject);
	},

	toggleCheckbox : function(event){
		event.originalEvent.preventDefault();

		var $el = $(event.currentTarget);
		var id = $el.data('id');
		var checked = $el.prop('checked');
		if(!checked){
		   delete this.parent.markedRecordsMap[id];
		}else {
			var record = this._getRecordById(id);
		   this.parent.markedRecordsMap[id] = record;
		}
		this.trigger('viewer:change');
		this.parent.trigger('selectionChanged');
		return false;
	},

	overlay : function(){
		this.$('.abstract-viewer-overlay').remove();
		this.$el.append('<div class="abstract-viewer-overlay"></div>');
	},
	removeOverlay : function(){
		this.$('.abstract-viewer-overlay').remove();
	},
	onLoading : function(){
		this.overlay();
	},

	afterShow : function(records) {

	},

	beforeShow : function(records) {
		this._records = records;
	},

	beforeSetRecord : function(record){

	},
	setRecord : function(){

	},
	render : function(){
		// disable text selection
		this.$el.css({
			'-webkit-touch-callout' : 'none',
			'-webkit-user-select' : 'none',
			'-khtml-user-select' : 'none',
			'-moz-user-select' : 'none',
			'-ms-user-select' : 'none',
			'user-select' : 'none'
		})	
	},
	initialize : function(options) {
		options = options ? options : {};
		AWFramework.BaseView.prototype.initialize.call(this, options);
		this.columns = options.columns;
		this.parent = options.parent;

		_.bindAll(this, 'show', 'beforeShow', 'afterShow', 'setRecord', 'beforeSetRecord');
    	var _this = this;
		this.show = _.wrap(this.show, function(e, b) {
			  _this.beforeShow(b);
			  e.call(_this,b);
			  _this.afterShow(b);
			  return _this;
		});

		this.setRecord = _.wrap(this.setRecord, function(e, b) {
			  _this.beforeSetRecord(b);
			  e.call(_this,b);
			  return _this;
		});

		
	},

	afterRender : function() {

	},
	_afterShow : function(){
		if(!this.parent.checkboxSelection){
			this.$('.aw-checkbox-specific').remove();
			var $array = this.$('.aw-record');
			for(var i = 0, l = $array.length; i < l; i++){
				var $el = $($array[i]);
				var id = $el.data('id');
				if(this.parent.markedRecordsMap[id]){
					$el.addClass('aw-selected');
				}
			}
		}else {
			var $array = this.$('.aw-checkbox');
			for(var i = 0, l = $array.length; i < l; i++){
				var $el = $($array[i]);
				var id = $el.data('id');
				if(this.parent.markedRecordsMap[id]){
					$el.addClass('aw-selected');
					$el.attr('checked', 'true');
				}
			}
		}
		this.dirty = false;
	},

	show : function(data){
		this.renderView(this._afterShow.bind(this), {
			markedRecordsMap : this.parent.markedRecordsMap,
			data: data, 
			columns : this.parent.columns,
			selected : this.parent._selected,
			checkboxSelection : this.parent.checkboxSelection
		});    
	},
});
