Framework={templateCache:{},CACHE_TEMPLATES:!1,loadCompressed:function(a){for(var b=a.indexOf("fudgepacker1911begin"),c=a.indexOf("fudgepacker1911end"),b=a.substring(b+21,c-1).split(" "),d=c=0;d<b.length;d+=2)this.templateCache[b[d+1]]=a.substring(c,b[d]),c=b[d];console.log(this.templateCache)}};Framework.BaseView=Backbone.View.extend({template:null,isRendered:!1,snippets:{},doNotKillDiv:!0,setOverlay:function(){this.__$temp=null;if(this.loadingTemplate&&Framework.templateCache[this.loadingTemplate])this.__$temp=$(Framework.templateCache[this.loadingTemplate]);else{if(this.overlayClass){this.$("."+this.overlayClass).remove();this.$el.append('<div class="'+this.overlayClass+'"></div>');return}this.__$temp=$("<div>Validate Async In Progress (this.loadingTemplate == null)</div>")}this.__$children=
this.$el.children();this.__$children.detach();this.$el.append(this.__$temp)},removeOverlay:function(){this.overlayClass?this.$("."+this.overlayClass).remove():(this.$el.append(this.__$children),this.__$temp.remove(),this.__$temp=null)},validateView:function(a,b){this.setOverlay();this.validateAsync(function(b){this.removeOverlay();a(b)}.bind(this),function(a){this.removeOverlay();b(a)}.bind(this))},validateAsync:function(a,b){console.log("validateAsync is empty, override me");a({})},_killChildren:function(){for(var a in this.viewsSack)this.viewsSack[a].destroy()},
_terminateAllActiveXHRs:function(){if(this._xhrs){for(var a=0,b=this._xhrs.length;a<b;a++)this._xhrs[a].abort();this._xhrs=null}},_getParameters:function(a){a=a.split("?");a=1<a.length?a[1]:a[0];a=a.split("#");a=1<a.length?a[1]:a[0];a=a.split("&");for(var b={},c=0,d=a.length;c<d;c++){var e=a[c].split("=");b[e[0]]=e[1]}return b},_diff:function(a,b){var c={},d;for(d in b)if(!a[d]||a[d]!=b[d])try{c[d]=decodeURI(b[d])}catch(e){c[d]=b[d]}for(d in a)b[d]||(c[d]=null);return c},initialize:function(a){this.viewsSack=
{};a||(a={});this._options=a;this._parent=a._parent;if(this.onHashChange)$(window).on("hashchange."+this.cid,function(a){var b=a.originalEvent;a=b.oldURL;b=this._getParameters(b.newURL);a=this._getParameters(a);a=this._diff(a,b);this.onHashChange(a)}.bind(this));if(this.parameterSchema)for(var b in this.parameterSchema)this[this.parameterSchema[b]]=this.getParameter(b);_.bindAll(this,"render","destroy");var c=this;this.render=_.wrap(this.render,function(a,b){c._beforeRender();a(b);c.afterRender();
return c});this.destroy=_.wrap(this.destroy,function(a,b,g,f){c._beforeDestroy();a(b,g,f);return c})},_renderView:function(a,b){this._terminateAllActiveXHRs();var c=function(c,d){b=b?b:{};b._this=this;b._options=this._options;this._preloadData=d;b._preloadData=d;this.$el.html(_.template(c)(b));this.render();a&&a()}.bind(this);if(null!=this.template)if(Framework.templateCache[this.template])this.preloadDataAsync(function(a){c(Framework.templateCache[this.template],a)}.bind(this),function(){c(this.errorTemplate&&
Framework.templateCache[this.errorTemplate]?Framework.templateCache[this.errorTemplate]:"ERROR in preloadDataAsync",b)}.bind(this));else{var d=function(a){Framework.CACHE_TEMPLATES&&(Framework.templateCache[this.template]=a);this.preloadDataAsync(function(b){c(a,b)}.bind(this),function(){c(this.errorTemplate&&Framework.templateCache[this.errorTemplate]?Framework.templateCache[this.errorTemplate]:"ERROR in preloadDataAsync",b)}.bind(this))}.bind(this);$.ajax({url:this.template,method:"GET",success:d,
error:function(a){this.$el.html("template ["+this.template+"] failed to load.")}.bind(this)})}else this.preloadDataAsync(function(a){this.render()}.bind(this),function(){this.$el.html("ERROR in preloadDataAsync")}.bind(this)),a&&a()},render:function(){return this},afterRender:function(){this.isRendered=!0},_beforeRender:function(){},_beforeDestroy:function(){}});
Framework.BaseView.prototype.getJSON=function(a,b,c,d,e){this._xhrs||(this._xhrs=[]);a={headers:{Accept:"application/json, text/javascript, */*; q=0.01"},cache:!1,contentType:"application/json",type:e?e:"GET",processData:!1,url:a,success:b,error:c};d&&(a.type=e?e:"POST",a.data=JSON.stringify(d),a.dataType="json",delete a.processData);d=$.ajax(a);this._xhrs.push(d)};Framework.BaseView.prototype.postJSON=function(a,b,c,d,e){this.getJSON(a,b,c,d,e)};Framework.BaseView.prototype.errorTemplate=null;
Framework.BaseView.prototype.loadingTemplate=null;Framework.BaseView.prototype.getParameter=function(a){var b=location.hash;if(0==b.length)return null;for(var b=b.substr(1).split("&"),c=0,d=b.length;c<d;c++){var e=b[c].split("=");if(e[0]==a)try{return decodeURI(e[1])}catch(g){return e[1]}}return null};Framework.BaseView.prototype.setParameter=function(a,b){location.hash=this._getNewHash(location.hash,a,b)};
Framework.BaseView.prototype.setParameters=function(a,b){var c=location.hash,d;for(d in a)c=this._getNewHash(c,d,a[d]);b?history.replaceState(null,null,c):location.hash=c};Framework.BaseView.prototype._getNewHash=function(a,b,c){c&&(c=encodeURI(c));0==a.length&&(a="#");a=a.substr(1).split("&");""==a[0]&&(a=[]);for(var d=!1,e=0,g=a.length;e<g;e++)if(a[e].split("=")[0]==b){a[e]=c?b+"="+c:"";d=!0;break}!d&&c&&a.push(b+"="+c);b=[];e=0;for(g=a.length;e<g;e++)a[e]&&b.push(a[e]);return"#"+b.join("&")};
Framework.BaseView.prototype.destroy=function(){this._terminateAllActiveXHRs();this._killChildren();this.onHashChange&&$(window).off("hashchange."+this.cid);this.undelegateEvents();this._parent&&this._parent.viewsSack[this.cid]&&delete this._parent.viewsSack[this.cid];this.$el.removeData().unbind();this.doNotKillDiv?(this.$el.empty(),this.stopListening()):this.remove();this.trigger("destroy",this)};
Framework.BaseView.prototype.renderView=function(a,b){this._loadSnippets(function(){this.loadingMessage?(this.$el.html(this.loadingMessage),this._renderView(a,b)):this.overlayClass?(this.$("."+this.overlayClass).remove(),this.$el.append('<div class="'+this.overlayClass+'"></div>'),this._renderView(a,b)):this.loadingTemplate?Framework.templateCache[this.loadingTemplate]?(this.$el.html(Framework.templateCache[this.loadingTemplate]),this._renderView(a,b)):(this.$el.html(""),$.ajax({url:this.loadingTemplate,
method:"GET",cache:Framework.CACHE_TEMPLATES,success:function(c){Framework.templateCache[this.loadingTemplate]=c;this._renderView(a,b)}.bind(this),error:function(c){Framework.templateCache[this.loadingTemplate]="Loading Template ["+this.loadingTemplate+"] failed to load.";this._renderView(a,b)}.bind(this)})):this._renderView(a,b)}.bind(this))};
Framework.BaseView.prototype.snippet=function(a,b){var c=this.snippets[a];if(c)return _.template(Framework.templateCache[c])(b);throw"error: snippet "+a+" is not declared in the prototype.";};
Framework.BaseView.prototype._loadSnippets=function(a){this.errorTemplate&&(this.snippets.__errorTemplate=this.errorTemplate);var b=_.keys(this.snippets).length;if(0==b)a();else{var c=function(){b--;0>=b&&a()},d;for(d in this.snippets){var e=this.snippets[d];Framework.templateCache[e]?c():$.ajax({url:e,method:"GET",cache:Framework.CACHE_TEMPLATES,success:function(a,b,d,e){Framework.templateCache[d.dirtyClosureHack]=a;c()}.bind(this),error:function(a,b,d,e){Framework.templateCache[d.dirtyClosureHack]=
"Loading Template ["+d.dirtyClosureHack+"] failed to load.";c()}.bind(this)}).dirtyClosureHack=e}}};Framework.BaseView.prototype.instantiate=function(a,b){b=b?b:{};b._parent=this;var c=new a(b);return this.viewsSack[c.cid]=c};Framework.BaseView.prototype.getParent=function(){return this._parent};Framework.BaseView.prototype.getChildren=function(){return this.viewsSack};Framework.BaseView.prototype.preloadDataAsync=function(a,b){a({})};Framework.AbstractConstraintModel=Backbone.View.extend({type:"GET",initialize:function(){this.constraints={}},getJSONString:function(){return JSON.stringify(this.constraints)},setFromJSONString:function(a){this.constraints=JSON.parse(a)},mergeConstraints:function(a,b){for(var c in b){var d=b[c];a[c]="number"===typeof d||"string"===typeof d||"boolean"===typeof d?d:d instanceof Array?a[c]?a[c].concat(d):d:a[c]?_.extend(a[c],d):d}return a}});Framework.PostConstraintModel=Framework.AbstractConstraintModel.extend({type:"POST"});
Framework.PostConstraintModel.prototype.getBody=function(){throw"must override getBody";};Framework.AbstractConstraintModel.prototype.union=function(a){var b=new this.constructor;b.constraints=this.mergeConstraints(b.constraints,this.constraints);b.constraints=this.mergeConstraints(b.constraints,a.constraints);return b};Framework.AbstractConstraintModel.prototype.setField=function(a,b){this.constraints[a]=b;null===b&&delete this.constraints[a]};
Framework.AbstractConstraintModel.prototype.getField=function(a){return this.constraints[a]};Framework.AbstractConstraintModel.prototype.getUrl=function(){return"override me, refer to API for more help"};Framework.AbstractConstraintModel.prototype.defaultPageNumber=0;Framework.AbstractConstraintModel.prototype.defaultPageSize=10;Framework.AbstractConstraintModel.prototype.getPageNumber=function(){var a=this.getField("pageNumber");return void 0===a?this.defaultPageNumber:a};
Framework.AbstractConstraintModel.prototype.getPageSize=function(){var a=this.getField("pageSize");return void 0===a?this.defaultPageSize:a};Framework.AbstractConstraintModel.prototype.setPageNumber=function(a){this.setField("pageNumber",a)};Framework.AbstractConstraintModel.prototype.setPageSize=function(a){this.setField("pageSize",a)};Framework.AbstractConstraintPanel=Framework.BaseView.extend({initialize:function(a){Framework.BaseView.prototype.initialize.call(this,a);this.setSource(a.source)},setSource:function(a){a&&this.source!=a&&(this.source&&(this.source.unsubscribe(this),this.stopListening(this.source,"source:change",this.renderView)),this.source=a,this.source.subscribe(this),this.listenTo(this.source,"source:change",this.renderView))},destroy:function(){this.source.unsubscribe(this);Framework.BaseView.prototype.destroy.call(this)}});
Framework.AbstractConstraintPanel.prototype.preloadDataAsync=function(a){var b=this.source.getConstraintModel();a(b)};Framework.AbstractConstraintPanel.prototype.getConstraintModel=function(){return new this.source.ConstraintModelPrototype};Framework.AbstractConstraintPanel.prototype.getSource=function(){return this.source};Framework.AbstractConstraintPanel.prototype.onConstraintChange=function(){this.trigger("constraintPanel:changed",this)};Framework.AbstractModal=Framework.BaseView.extend({initialize:function(a){a=a?a:{};if(!a.ContentView)throw'must pass constructor. Missing parameter "options.ContentView"';if(!this.template)throw"you must specify this.template (refer to API for proper HTML markup)";Framework.BaseView.prototype.initialize.call(this,a);this.contentView=this.instantiate(a.ContentView,a.contentOptions)},render:function(a){this.contentView.setElement($(this.$(".fw-modal-content")[0])).renderView(a)}});Framework.PaginationPanel=Framework.AbstractConstraintPanel.extend({middleEntries:4,edgeEntries:2,events:{"click .fw-pagination-btn":"onPaginationBtn"},initialize:function(a){Framework.AbstractConstraintPanel.prototype.initialize.call(this,a)},getInterval:function(a,b){var c=Math.ceil(this.middleEntries/2),d=b-this.middleEntries;return[a>c?Math.max(Math.min(a-c,d),0):0,a>c?Math.min(a+c,b):Math.min(this.middleEntries,b)]},onPaginationBtn:function(a){a=$(a.currentTarget).data("page");var b=new this.source.ConstraintModelPrototype;
b.setPageNumber(a);this.pageSize&&b.setPageSize(this.pageSize);this._options.pageSize&&b.setPageSize(this._options.pageSize);this.trigger("constraint:append",b)},reset:function(){}});
Framework.PaginationPanel.prototype.preloadDataAsync=function(a){this.source.get(function(){var b=this.source.getConstraintModel(),c={};c.pageSize=b.getPageSize();c.pageNumber=b.getPageNumber();c.count=this.source.count;c.totalPages=Math.ceil(c.count/c.pageSize);var b=this.getInterval(c.pageNumber,c.totalPages),d=!1,e=[],g=this.edgeEntries;this.edgeEntries>=b[0]&&(d=!0,g=b[1]);for(var f=0,h=g;f<h;f++)e.push(f);g=[];h=f=c.totalPages-this.edgeEntries;f<=b[1]&&(d=!0,h=b[0]);f=h;for(h=c.totalPages;f<
h;f++)g.push(f);var k=[];if(e[e.length-1]>=g[0])for(e=[],g=[],f=0,h=c.totalPages;f<h;f++)k.push(f);else if(!d)for(f=b[0],h=b[1];f<h;f++)k.push(f);c.left=e;c.right=g;c.middle=k;c.hasNext=c.pageNumber<c.totalPages-1;c.next=c.pageNumber+1;c.hasPrevious=0<c.pageNumber;c.hasNext||c.hasPrevious||(c.left=c.right=c.middle=[]);c.previous=c.pageNumber-1;c.beginStr=c.pageNumber*c.pageSize+1;c.endStr=c.beginStr+c.pageSize-1;c.endStr=c.endStr>c.count?c.count:c.endStr;a(c)}.bind(this))};
Framework.ScrollPaginationPanel=Framework.PaginationPanel.extend({});Framework.RestSource=Framework.BaseView.extend({dataType:"json",url:null,initialize:function(a){a=a?a:{};Framework.BaseView.prototype.initialize.call(this,a);a.persistBy&&(this.persistBy=a.persistBy);a.url&&(this.url=a.url);a.ConstraintModelPrototype&&(this.ConstraintModelPrototype=a.ConstraintModelPrototype);a.parseAsync&&(this.parseAsync=a.parseAsync);this.constraintModel=new this.ConstraintModelPrototype;this.constraintPanels={};this.callbackQueues={};this.cache={};this.countcache={};this._loading=
{};this.noCache=!1;if(!this.url)throw"this.url must be defined";a.initialConstraintModel&&this.setConstraintModel(a.initialConstraintModel)},subscribe:function(a){this.constraintPanels[a.cid]=a;a instanceof Framework.ScrollPaginationPanel&&(this._contineous=!0);this.listenTo(a,"constraint:append",function(b){this.onConstraintAppend(b,a,!1)}.bind(this));this.listenTo(a,"constraint:replace",function(b){this.onConstraintAppend(b,a,!0)}.bind(this))},onConstraintAppend:function(a,b,c){var d=null;c?d=a:
(d=this.getConstraintModel(),d=d.union(a));b instanceof Framework.PaginationPanel||(d.setPageNumber(null),this._cwrapperdata=null);this.setConstraintModel(d)},unsubscribe:function(a){delete this.constraintPanels[a.cid]},clearCache:function(){this.cache={}},_triggerChange:function(){this.getConstraintModel().getPageNumber()||(this._cwrapperdata=null);this.trigger("source:change")},onHashChange:function(a){this.persistBy&&a.hasOwnProperty(this.persistBy)&&this._triggerChange()},setConstraintModel:function(a){this.persistBy?
this.setParameter(this.persistBy,a.getJSONString()):(this.cmStr=a.getJSONString(),this._triggerChange())},getCount:function(){return this.count},getAll:function(a,b,c){a="";(this.constraintModel=this.getConstraintModel())&&"GET"==this.ConstraintModelPrototype.prototype.type&&(a="?"+this.constraintModel.getUrl());var d=this.url+a;this.countcache.hasOwnProperty(d)&&(this.count=this.countcache[d]);null==this.cache[d]||this._lastPayload&&this._lastPayload!=this.payload?this._loading[d]?(this.callbackQueues[d]||
(this.callbackQueues[d]=[]),this.callbackQueues[d].push(b)):(this._loading[d]=!0,this.callbackQueues[d]=[],this.callbackQueues[d].push(b),this._xhr&&(this._xhr.url!=d&&(this.callbackQueues[d]=this.callbackQueues[this._xhr.url].concat(this.callbackQueues[d]),delete this.callbackQueues[this._xhr.url]),this._xhr.abort()),this._xhr=$.ajax({headers:{Accept:"application/json"},cache:!1,contentType:"application/json",type:this.constraintType,processData:!1,url:d,dataType:this.dataType,data:this.payload,
success:function(a){var b=function(a){this._loading[d]=!1;this._contineous&&(this._cwrapperdata||(this._cwrapperdata=[]),a=this._cwrapperdata=this._cwrapperdata.concat(a));this._lastPayload=this.payload;this.noCache||(this.cache[d]=a,this.countcache[d]=this.count);for(var b=0,c=this.callbackQueues[d].length;b<c;b++)this.callbackQueues[d][b](a);this.callbackQueues[d]=[]}.bind(this);this.parseAsync(a,function(a){b(a)}.bind(this))}.bind(this),error:function(a){this._loading[d]=!1;"abort"!=a.statusText&&
c&&c(a)}.bind(this)}),this._xhr.url=d):(this._xhr.abort(),b(this.cache[d]))},refresh:function(){this.cache={};this.trigger("source:change")}});Framework.RestSource.prototype.getConstraintModel=function(){var a=null;if(a=this.persistBy?this.getParameter(this.persistBy):this.cmStr){var b=new this.ConstraintModelPrototype;b.setFromJSONString(a);return b}return new this.ConstraintModelPrototype};Framework.RestSource.prototype.ConstraintModelPrototype=Framework.AbstractConstraintModel;
Framework.RestSource.prototype.get=function(a,b){this.getAll(null,a,b)};Framework.RestSource.prototype.setCount=function(a){this.count=a};Framework.RestSource.prototype.getCount=function(){return this.count};Framework.RestSource.prototype.parseAsync=function(a,b){b(a)};Framework.TabView=Framework.BaseView.extend({initialize:function(a){Framework.BaseView.prototype.initialize.call(this,a);this._tabMap={}},events:function(){var a={};a['click .fw-tab-toggle[data-cid="'+this.cid+'"]']=this._tabChange;return a},onHashChange:function(a){this.persistBy&&a.hasOwnProperty(this.persistBy)&&(this._change(a[this.persistBy]),this.trigger("tab",a[this.persistBy]))},_tabChange:function(a){a=$(a.currentTarget)[0].id;this.persistBy&&this.setParameter(this.persistBy,a);this._change(a);
this.trigger("tab",a)},_change:function(a){if(null==a){var b=this.$('.fw-tab-toggle[data-cid="'+this.cid+'"]');if(0==b.length)throw"malformed markup, no .fw-tab-toggle found. Please refer to API";a=b[0].id;for(var c=0,d=b.length;c<d;c++)$(b[c]).hasClass("fw-tab-default")&&(a=b[c].id)}var d=this.$('.fw-tab-toggle[data-cid="'+this.cid+'"]#'+a),b=d.data("viewconstructor"),c=this.$('.fw-tab-content[data-cid="'+this.cid+'"][data-id="'+a+'"]'),e=this.$('.fw-tab-content[data-cid="'+this.cid+'"][data-for="'+
a+'"]');if(0==c.length)throw"corresponding div does not exist for id "+a;this.$('.fw-tab-toggle[data-cid="'+this.cid+'"]').removeClass("active");d.addClass("active");this.$('.fw-tab-content[data-cid="'+this.cid+'"]').hide();c.show();e.show();if(!this._tabMap[a]){this._tabMap[a]=!0;d=null;if(b&&window[b])d=window[b];else throw"constructor "+b+" does not exist";this["content_"+a]=this.instantiate(d,{});this["content_"+a].setElement(c).renderView()}},render:function(){this.$(".fw-tab-content").attr("data-cid",
this.cid);this.$(".fw-tab-toggle").attr("data-cid",this.cid);this.$('.fw-tab-content[data-cid="'+this.cid+'"]').hide();this.persistBy&&this.getParameter(this.persistBy)?this.setTabById(this.getParameter(this.persistBy)):this._change(null)}});Framework.TabView.prototype.setTabByIndex=function(a){this.$(this.$(".fw-tab-toggle")[a]).click()};Framework.TabView.prototype.setTabById=function(a){this.$(".fw-tab-toggle#"+a).click()};Framework.Viewer=Framework.AbstractConstraintPanel.extend({events:{keyup:"onKeyup",dragover:"onDragover",dragenter:"onDragenter",drop:"onDrop",mousedown:"onMousedown",mouseup:"onMouseup","mouseover .fw-record":"onMouseover","mouseleave .fw-record":"onMouseleave","mousedown .fw-record":"onClick","change .fw-checkbox":"toggleCheckbox",mousemove:"onMousemove",mouseleave:"onMouseup","change .fw-checkbox-select-all":"onSelectAllToggle"},onSelectAllToggle:function(a){if($(a.currentTarget).prop("checked")){var b=
this.$(".fw-checkbox");a=0;for(c=b.length;a<c;a++)d=$(b[a]).data("id"),this.markedRecordsMap[d]=!0;b.prop("checked",!0);this.$(".fw-record").addClass("fw-row-selected")}else{b=this.$(".fw-checkbox:checked");a=0;for(var c=b.length;a<c;a++){var d=$(b[a]).data("id");delete this.markedRecordsMap[d]}b.prop("checked",!1);this.$(".fw-record").removeClass("fw-row-selected")}this.trigger("change")},id:"id",initialize:function(a){Framework.AbstractConstraintPanel.prototype.initialize.call(this,a);this.markedRecordsMap=
{}},getRecord:function(a){return!0},toggleCheckbox:function(a){a.originalEvent.preventDefault();a.preventDefault();a=$(a.currentTarget).data("id");a=this.$('.fw-record[data-id="'+a+'"]');this._$select(a,!0);return!1},clearSelection:function(){this.$(".fw-checkbox").prop("checked",!1);this.$(".fw-record").removeClass("fw-row-selected");this.markedRecordsMap={}},_setSelectAll:function(){var a=this.$(".fw-checkbox:checked"),b=this.$(".fw-checkbox:not(:checked)");0<a.length&&0<b.length?this.$(".fw-checkbox-select-all").prop("indeterminate",
!0):0<a.length?(this.$(".fw-checkbox-select-all").prop("indeterminate",!1),this.$(".fw-checkbox-select-all").prop("checked",!0)):(this.$(".fw-checkbox-select-all").prop("indeterminate",!1),this.$(".fw-checkbox-select-all").prop("checked",!1))},_$select:function(a,b){this._options.noCtrl&&(b=!1);var c=a.data("id"),d=a.find(".fw-checkbox");b?a.hasClass("fw-row-selected")?(d.prop("checked",!1),a.removeClass("fw-row-selected"),delete this.markedRecordsMap[c]):(d.prop("checked",!0),a.addClass("fw-row-selected"),
this.markedRecordsMap[c]=this.getRecord(c)):(this.clearSelection(),d.prop("checked",!0),a.addClass("fw-row-selected"),this.markedRecordsMap[c]=this.getRecord(c));this._setSelectAll();this.trigger("change",this.markedRecordsMap)},getSelection:function(){var a=[],b;for(b in this.markedRecordsMap)a.push(b);return a},onClick:function(a){var b=$(a.currentTarget),c=$(a.target);if(c.hasClass("fw-checkbox-specific")||c.hasClass("k6-action"))return!0;var c=b.data("id"),d={test:"test"},e=Date.now();this._lc?
this._lc.id==c&&400>e-this._lc.time?(this.trigger("dblclick",c),this._lc=null):(this._$select(b,a.ctrlKey),this.trigger("click",c),this._lc={id:c,record:d,time:e}):(this._lc={id:c,record:d,time:e},this._$select(b,a.ctrlKey),this.trigger("click",c))},preloadDataAsync:function(a){this.source.get(a)},switchView:function(a){if(this.bundle.length<=a)throw"index is out of range";this._currentBundleSelection=a;this.renderView()},render:function(){this._setSelectAll()},renderView:function(a){if(this.bundle){this._currentBundleSelection||
(this._currentBundleSelection=0);var b=this.bundle[this._currentBundleSelection];b.template&&(this.template=b.template);b.snippets&&(this.snippets=b.snippets)}Framework.AbstractConstraintPanel.prototype.renderView.call(this,a)}});
Framework.ViewerSwitcher=Framework.BaseView.extend({events:{"click .fw-switcher-toggle":"switch"},initialize:function(a){Framework.BaseView.prototype.initialize.call(this,a);this.viewer=a.viewer;if(!this.viewer)throw"viewer must be defined.";},"switch":function(a){a=$(a.currentTarget).data("index");this.viewer.switchView(a)}});
Framework.ViewerActionPanel=Framework.BaseView.extend({initialize:function(a){Framework.BaseView.prototype.initialize.call(this,a);this.viewer=a.viewer;this.listenTo(this.viewer,"change",function(){this.renderView()}.bind(this))},preloadDataAsync:function(a){var b=this.viewer.getSelection(),c={};c.ids=b;a(c)}});
