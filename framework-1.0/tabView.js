 /**
 * Helper class that creates tabbed container. Refer to proper markup to leverage this
 * @example 

Template:

<div><p>Here are your toggles</p></div>

<ul class="nav nav-tabs">
  <li id='a' class="fw-tab-toggle active" data-viewconstructor='sampleClassA'><a>Home</a></li>
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
Framework.TabView = Framework.BaseView.extend({
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        this._tabMap = {};
    },
    
    events: {
        'click .fw-tab-toggle': 'otc'
    },
    onHashChange: function(e) {
        if (this.persistBy) {
            var $current = this.$('.fw-tab-toggle.active');
            var currentId = null;
            if ($current && $current.length > 0) {
                
                var hashId = this.getParameter(this.persistBy);
                if (hashId != currentId) {
                    this._change(hashId);
                }
                currentId = $current[0].id;
            }
        }
    
    },
    _tabChange: function(e) {
        var $el = $(e.currentTarget);
        var id = $el[0].id;
        if (this.persistBy) {
            this.setParameter(this.persistBy, id);
        }
        this._change(id);
        this.trigger('tab:' + id);
    },
    _change: function(id) {
        var $el = this.$('.fw-tab-toggle#' + id);
        var constructor = $el.data('viewconstructor');
        var $div = this.$('.fw-tab-content[data-id="' + id + '"]');
        var $for = this.$('.fw-tab-content[data-for="' + id + '"]');
        if ($div.length == 0) {
            throw "corresponding div does not exist";
        }
        this.$('.fw-tab-toggle').removeClass('active');
        $el.addClass('active');
        this.$('.fw-tab-content').hide();
        $div.show();
        $for.show();
        if (!this._tabMap[id]) {
            this._tabMap[id] = true;
            var Constructor = null;
            if (constructor && window[constructor]) {
                Constructor = window[constructor];
            } else {
                throw "constructor " + constructor + " does not exist";
            }
            this.instantiateView('content_' + id, Constructor, {});
            this['content_' + id].setElement($div).renderView();
        }
    },
    
    
    
    render: function() {
        this.$('.fw-tab-content').hide();
        if (this.persistBy && this.getParameter(this.persistBy)) {
            this.setTabById(this.getParameter(this.persistBy));
        } else {
            this.$('.fw-tab-toggle.active').click();
            if (this._options.openTab) {
                this.setTabById(this._options.openTab);
            }
        }
    
    }
});

Framework.TabView.prototype['otc'] = function(e) {
    this._tabChange(e);
};

/** @export {} */
Framework.TabView.prototype.setTabByIndex = function(index) {
    this.$(this.$('.fw-tab-toggle')[index]).click();
};

/** @export {} */
Framework.TabView.prototype.setTabById = function(id) {
    this.$('.fw-tab-toggle#' + id).click();
};
