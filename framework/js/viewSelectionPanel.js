AWFramework.ViewSelectionPanel = AWFramework.BaseView.extend({

	initialize : function(options) {
		this.groups = {};
		this.viewers = options.viewers;
		this.initialView = options.initialView;
		this.currentViewer = this.initialView;
	},
	
	events : function(){
	    var _events = [];
	    for(var i = this.viewers.length-1; i >= 0; i--){
	       _events["click #view_" + this.viewers[i].prototype.name] = "triggerChangeView"; 
	    }  
	   return _events;
	},

	setByName : function(name){
		this.$el.find('li').removeClass('active');
		var $current = this.$('#' + this.currentViewer);
		var $next = this.$('#' + name);
		if($current.hasClass('group-a3') && !($next.hasClass('group-a3'))){
			$current.addClass('inactive');
		}
		
		$next.addClass('active');
		this.previousViewer = this.currentViewer;
		this.currentViewer = name;
		this.trigger('viewSelectionPanel:change', name);		
	},

	triggerChangeView : function(event){
		var viewer = $(event.currentTarget).data('view');

		var $current = this.$('#view_' + this.currentViewer);
		var $next = this.$('#view_' + viewer);

		if(viewer == this.currentViewer){
			if($next.data('group') && $current.data('group')){
				if($next.data('group') == $current.data('group')){
					var i = 0;
					var groupArray = this.groups[$next.data('group')];
					for(var i = 0, l = groupArray.length; i < l; i++){
						if(groupArray[i] == viewer){
							var next = (groupArray.length-1 > i) ? groupArray[i+1] : groupArray[0]; 
							this.$('#view_' + next).click();
							return;
						}
					}
				}
			}
		}
		if(viewer == this.currentViewer){ 
			return;
		}
		var $li = this.$el.find('li');
		$li.removeClass('active');
		$current.removeClass('inactive');

		$(event.currentTarget).addClass('active');


		if($current.hasClass('group-a3') && !($next.hasClass('group-a3'))){
			$current.addClass('inactive');
		}

		this.previousViewer = this.currentViewer;
		this.currentViewer = viewer;
		this.trigger('viewSelectionPanel:change', viewer);
	},

	setPrevious : function(){
		this.$('#' + this.previousViewer).click();	
	},

	render : function() {
		
		this.$el.empty();
		var html = '<ul class="aw-view-selection">';

		for(var i = this.viewers.length-1; i >= 0; i--){
			var group = this.viewers[i].prototype.group;
			var name = this.viewers[i].prototype.name;
			var groupClass = '';
			var data = '';
			if(group){
				data = ' data-group="' + group + '" '
				groupClass = 'group-' + group;
				if(!this.groups[group]){
					this.groups[group] = [];
				}
				this.groups[group].push(name);
			} 
			
			var active = (name == this.initialView) ? "active" : "";
			var indicator = "";
			if(this.viewers[i].prototype.icon){
				indicator = '<a><i class="' + this.viewers[i].prototype.icon + '"></i></a>';
			}else if(this.viewers[i].prototype.indicator){
				indicator = this.viewers[i].prototype.indicator;
			}else {
				indicator = name;
			}

			html+= '<li ' + data + ' data-view="'+ name +'" class="'+active+' ' + groupClass + '" id="view_' + name + '">'+ indicator + '</li>'
	    }
	    html+='</ul>';
	    this.$el.html(html);
		if(!this.$('#' + this.initialView).hasClass('group-a3')){
			$(this.$('.group-a3')[0]).addClass('inactive');
		}

	    return this;
	},

});
