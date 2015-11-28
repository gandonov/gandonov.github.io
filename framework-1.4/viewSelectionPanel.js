 /**
 * Model for ListBox
 *
 * @constructor <-- add this to remove the warning
 */
Framework.ViewSelectionPanel = Framework.BaseView.extend({

	initialize : function(options) {
		Framework.BaseView.prototype.initialize.call(this, options);
		this.sourceView = options.sourceView;
		if(!this.sourceView){
			throw "you must specify sourceView parameter in options."
		}
		this.listenTo(this.sourceView, 'sourceView:change', this.onViewerChange);
	},

	onViewerChange : function(viewer){

	},
	events : {
		"click .view-toggle" : 'onViewToggle'
	},
	onViewToggle : function(e){
		var $el = $(e.currentTarget);
		var viewer = $el.data('viewer');
		this.sourceView.setViewer(viewer);
	},

	render : function() {

	}

});
