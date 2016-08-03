 /**
 * Helper class that creates tabbed container. Refer to proper markup to leverage this
 * @example 

Template:

<div><p>Here are your toggles</p></div>

<ul class="nav nav-tabs">
  <li id='a' class="fw-tab-toggle fw-tab-default" data-viewconstructor='sampleClassA'><a>Home</a></li>
  <li id='b' class="fw-tab-toggle" data-viewconstructor='sampleClassB'><a>Profile</a></li>
  <li id='c' class="fw-tab-toggle" data-viewconstructor='sampleClassC'><a>Messages</a></li>
</ul>

<div><p>Here is the corresponding content</p></div>
<div class="tab-content">
<div class='fw-tab-content tab-panel' id='a' data-id='a'></div>
<div class='fw-tab-content tab-panel' data-id='b'></div>
<div class='fw-tab-content tab-panel' data-id='c'></div>
</div>

Js:

 MyTabView = Framework.TabView.extend({
     template : 'MyTabView.html' 
 });

 myTabView = new MyTabView();
 myTabView.setElement($('#tabView')).renderView
 * @constructor
 * @export
 */

 // markup: .fw-tab-default -- add this for the tab to be open on default if no other indicators are present  
 // .fw-tab-toggle attr[data-viewconstructor] #id clickable button that will take you to the tab
 // .fw-tab-content attr[data-id] containter where you would like the corresponding tab to be rendered.
 // .fw-tab-content[data-for] container where you would like to put supplemental views (i.e. action panel, external menu, etc...)
Framework.TabView = Framework.BaseView.extend({
	
	noHistoryTrail : false,
	
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        this._tabMap = {};
    },
    // destroys tabViews, resets tabMap, and renderView
    refresh : function(){
        this._killChildren();
        this._tabMap = {};
        this.renderView();
    },

    events: function(){
        var _events = {};
        _events['click .fw-tab-toggle[data-cid="' + this.cid + '"]'] = this._tabChange;
        return _events;
    },    
    onHashChange: function(diff) {
        if (this.persistBy && diff.hasOwnProperty(this.persistBy)) {
            this._change(diff[this.persistBy]);
            this.trigger('tab', diff[this.persistBy]);
        }
    
    },
    _tabChange: function(e) {
        var $el = $(e.currentTarget);
        var id = $el[0].id;
        if (this.persistBy) {
            this.setParameter(this.persistBy, id, this.noHistoryTrail);
        }
        this._change(id);
        this.trigger('tab',id, leaveHistoryTrail);
    },
    _change: function(id) {
        if(id == null){
            var $group = this.$('.fw-tab-toggle[data-cid="' + this.cid + '"]');
            if($group.length == 0){
                throw "malformed markup, no .fw-tab-toggle found. Please refer to API";
            }else {
                id = $group[0].id;
                for(var i = 0, l = $group.length; i < l;i++){
                    if($($group[i]).hasClass('fw-tab-default')){
                        id = $group[i].id;
                    }
                }
            }
        }



        var $el = this.$('.fw-tab-toggle[data-cid="' + this.cid + '"]#' + id);
        var constructor = $el.data('viewconstructor');
        var $div = this.$('.fw-tab-content[data-cid="' + this.cid + '"][data-id="' + id + '"]');
        var $for = this.$('.fw-tab-content[data-cid="' + this.cid + '"][data-for="' + id + '"]');
        if ($div.length == 0) {
            throw "corresponding div does not exist for id " + id;
        }
        this.$('.fw-tab-toggle[data-cid="' + this.cid + '"]').removeClass('active');
        $el.addClass('active');
        this.$('.fw-tab-content[data-cid="' + this.cid + '"]').hide();
        $div.show();
        $for.show();
        if (!this._tabMap[id]) {
            if(this.destroyViewsOnExit){
                this._killChildren();
                this._tabMap = {};
            }
            this._tabMap[id] = true;
            var Constructor = null;
            if (constructor && window[constructor]) {
                Constructor = window[constructor];
            } else {
                throw "constructor " + constructor + " does not exist";
            }
            this['content_' + id] = this.instantiate(Constructor, {});
            this['content_' + id].setElement($div).renderView();
        }
    },
    
    render: function() {
        this.$('.fw-tab-content').attr('data-cid', this.cid);
        this.$('.fw-tab-toggle').attr('data-cid', this.cid);      
        this.$('.fw-tab-content[data-cid="' + this.cid + '"]').hide();
        
        if (this.persistBy && this.getParameter(this.persistBy)) {
            this.setTabById(this.getParameter(this.persistBy));
        } else {

            this._change(null);
           
        }
    
    }
});

/** @export {} */
Framework.TabView.prototype.setTabByIndex = function(index) {
    this.$(this.$('.fw-tab-toggle')[index]).click();
};

/** @export {} */
Framework.TabView.prototype.setTabById = function(id) {
    this.$('.fw-tab-toggle#' + id).click();
};