var h=this;function n(a,b){var c=a.split("."),d=h;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d[e]?d=d[e]:d=d[e]={}:d[e]=b};Framework={K:{},$a:!1};Framework.a=Backbone.View.extend({template:null,Db:!1,hb:function(){for(var a in this.L)this.L[a].destroy()},initialize:function(a){this.L={};a||(a={});this.ma=a;if(this.Sa)for(var b in this.Sa)this[this.Sa[b]]=this.getParameter(b);_.bindAll(this,"render","destroy");var c=this;this.render=_.wrap(this.render,function(a,b){a(b);c.nb();return c});this.destroy=_.wrap(this.destroy,function(a,b,f,g){a(b,f,g);return c})},na:function(a,b){var c=function(c,d){b=b?b:{};b._this=this;b._options=this.ma;this._preloadData=
d;b._preloadData=d;this.$el.html(_.template(c)(b));this.render();a&&a()}.bind(this);if(null!=this.template)if(Framework.K[this.template])this.preloadDataAsync(function(a){c(Framework.K[this.template],a)},function(){c("ERROR in preloadDataAsync",{})});else{var d=function(a){Framework.$a&&(Framework.K[this.template]=a);this.preloadDataAsync(function(b){c(a,b)},function(){c("ERROR in preloadDataAsync",{})})}.bind(this);$.ajax({url:this.template,method:"GET",success:d,error:function(){this.$el.html("template ["+
this.template+"] failed to load.")}.bind(this)})}else this.preloadDataAsync(function(){this.render()}.bind(this),function(){this.$el.html("ERROR in preloadDataAsync")}.bind(this)),a&&a()},render:function(){return this},nb:function(){this.Db=!0},$b:function(){},Zb:function(){}});n("Framework.BaseView",Framework.a);
Framework.a.prototype.A=function(a,b,c){this.Ja||(this.Ja=[]);a=$.ajax({headers:{Za:"application/json"},cache:!1,contentType:"application/json",type:"GET",processData:!1,url:a,success:b,error:c});this.Ja.push(a)};Framework.a.prototype.getJSON=Framework.a.prototype.A;Framework.a.prototype.tb=null;Framework.a.prototype.loadingTemplate=Framework.a.prototype.tb;
Framework.a.prototype.getParameter=function(a){var b=location.hash;if(0==b.length)return null;for(var b=b.substr(1).split("&"),c=0,d=b.length;c<d;c++){var e=b[c].split("=");if(e[0]==a)return e[1]}return null};Framework.a.prototype.getParameter=Framework.a.prototype.getParameter;
Framework.a.prototype.setParameter=function(a,b){var c=location.hash;0==c.length&&(c="#");c=c.substr(1).split("&");""==c[0]&&(c=[]);for(var d=!1,e=0,f=c.length;e<f;e++)if(c[e].split("=")[0]==a){c[e]=b?a+"="+b:"";d=!0;break}!d&&b&&c.push(a+"="+b);d=[];e=0;for(f=c.length;e<f;e++)c[e]&&d.push(c[e]);location.hash="#"+d.join("&")};Framework.a.prototype.setParameter=Framework.a.prototype.setParameter;
Framework.a.prototype.destroy=function(){this.hb();this.undelegateEvents();this.b&&this.b.L[this.cid]&&delete this.b.L[this.cid];this.$el.removeData().unbind();this.hc?(this.$el.empty(),this.stopListening()):this.remove();this.trigger("destroy",this)};Framework.a.prototype.destroy=Framework.a.prototype.destroy;
Framework.a.prototype.C=function(a,b){this.Fb?(this.$el.html(this.Fb),this.na(a,b)):this.loadingTemplate?Framework.K[this.loadingTemplate]?(this.$el.html(Framework.K[this.loadingTemplate]),this.na(a,b)):(this.$el.html(""),$.ajax({url:this.loadingTemplate,method:"GET",success:function(c){Framework.K[this.loadingTemplate]=c;this.C(a,b)}.bind(this),error:function(){Framework.K[this.loadingTemplate]="Loading Template ["+this.loadingTemplate+"] failed to load.";this.C(a,b)}.bind(this)})):this.na(a,b)};
Framework.a.prototype.renderView=Framework.a.prototype.C;Framework.a.prototype.ea=function(a,b,c){c=c?c:{};this[a]=new b(c);this.L[this[a].cid]=this[a];this[a].b=this;this[a].cc=a;return this[a]};Framework.a.prototype.instantiateView=Framework.a.prototype.ea;Framework.a.prototype.sb=function(a,b){b=b?b:{};var c=new a(b);this.L[c.cid]=c;c.b=this;return c};Framework.a.prototype.instantiate=Framework.a.prototype.sb;Framework.a.prototype.qa=function(){return this.b};Framework.a.prototype.getParent=Framework.a.prototype.qa;
Framework.a.prototype.pb=function(){return this.L};Framework.a.prototype.getChildren=Framework.a.prototype.pb;Framework.a.prototype.preloadDataAsync=function(a){a({})};Framework.j=Backbone.View.extend({type:"GET",initialize:function(){this.F={}},ya:function(a,b){this.sort||(this.sort={});this.sort.name=a;this.sort.Ra=b},ic:function(){return this.sort},ja:function(a){this.Nb=a+1},P:function(a){this.Ob=a}});n("Framework.AbstractConstraintModel",Framework.j);Framework.V=Framework.j.extend({type:"POST"});n("Framework.PostConstraintModel",Framework.V);Framework.V.prototype.Na=function(){throw"must override getBody";};Framework.V.prototype.getBody=Framework.V.prototype.Na;
Framework.j.prototype.intersection=function(a){var b=new this.constructor;this.sort&&b.ya(this.sort.name,this.sort.Ra);a.sort&&b.ya(a.sort.name,a.sort.Ra);this.kb&&b.P(this.getPageSize());this.jb&&b.ja(this.getPageNumber());a.kb&&b.P(a.getPageSize());a.jb&&b.ja(a.getPageNumber());a.sort&&b.ya(a.sort);for(var c in this.F)b.F[c]=this.F[c];for(c in a.F)b.F[c]=a.F[c];return b};Framework.j.prototype.intersection=Framework.j.prototype.intersection;Framework.j.prototype.qa=function(a,b){this.F[a]=b};
Framework.j.prototype.setField=Framework.j.prototype.qa;Framework.j.prototype.A=function(a){return this.F[a]};Framework.j.prototype.getField=Framework.j.prototype.A;Framework.j.prototype.getUrl=function(){return"override me"};Framework.j.prototype.getPageNumber=function(){return this.Nb};Framework.j.prototype.getPageSize=function(){return this.Ob};Framework.o=Framework.a.extend({initialize:function(a){Framework.a.prototype.initialize.call(this,a);this.source=a.source;this.source.subscribe(this)},destroy:function(){this.source.unsubscribe(this);Framework.a.prototype.destroy.call(this)}});n("Framework.AbstractConstraintPanel",Framework.o);Framework.o.prototype.getConstraintModel=function(){return new this.source.ConstraintModelPrototype};Framework.o.prototype.A=function(){return this.source};Framework.o.prototype.getSource=Framework.o.prototype.A;
Framework.o.prototype.v=function(){this.trigger("constraintPanel:changed",this)};Framework.o.prototype.onConstraintChange=Framework.o.prototype.v;Framework.Aa=Framework.a.extend({events:{"click #clear":"onClear","click #selectAll":"onSelectAll","click #indicator":"onIndicator","click #clearOnPage":"onClearOnPage","click #clearOnPageAll":"onClearOnPage"},pc:function(){console.log("on indicator")},Hb:function(){this.b.La()},kc:function(){this.b.qb()},yc:function(){this.b.Ub()},fa:[],Vb:"selected",update:function(){this.b.source.getAll(null,function(a){var b=Object.keys(this.b.g).length;this.$("#indicator, #selectAll, #clear, #clearOnPage, #clearOnPageAll, .fw-rsp-at-least-one").hide();
0<b&&(this.$("#indicator, .fw-rsp-at-least-one").show(),this.$("#indicator").html(b+" "+this.Vb),this.$("#clear").show());for(var c=!0,d=!0,e=a.length-1;0<=e&&(d||c);e--)this.b.g[a[e][this.b.id]]?d=!1:c=!1;0<a.length&&(d?this.$("#selectAll").show():d||c||this.$("#clearOnPage").show(),c&&this.$("#clearOnPageAll").show());this.ob&&this.ob(this.b.g,b)}.bind(this))},initialize:function(a){this.options=a?a:{};this.b=this.options.parent},render:function(){this.callbacks={};this.ua={};this.$("#indicator, #clear, #clearOnPage, #clearOnPageAll, .fw-rsp-at-least-one").hide();
for(var a=0,b=this.fa.length;a<b;a++){var c=this.fa[a].id;this.callbacks[c]=this.fa[a].aa;this.ua[c]=this.fa[a].ua;this.$(c).on("click",function(a){a="#"+$(a.currentTarget)[0].id;this.callbacks[a](this.b.g,this);this.ua[a]||this.Hb()}.bind(this))}}});n("Framework.AbstractRecordSelectionPanel",Framework.Aa);Framework.T=Framework.o.extend({name:"abstractViewer",Bc:"uuid",events:{keyup:"onKeyup",dragover:"onDragover",dragenter:"onDragenter",drop:"onDrop",mousedown:"onMousedown",mouseup:"onMouseup","mouseover .fw-record":"onMouseover","mouseleave .fw-record":"onMouseleave","mousedown .fw-record":"onClick","change .fw-checkbox":"toggleCheckbox",mousemove:"onMousemove",mouseleave:"onMouseup"},nc:function(a){a.preventDefault();a.stopPropagation()},mc:function(a){a.preventDefault();a.stopPropagation()},oc:function(a){a.originalEvent.dataTransfer&&
a.originalEvent.dataTransfer.files.length&&(a.preventDefault(),a.stopPropagation(),this.trigger("files",a.originalEvent.dataTransfer.files))},qc:function(){},Da:function(a,b,c){this.$(".fw-record").removeClass("fw-row-selected");c?this.trigger("unselected"):(a.addClass("fw-row-selected"),this.trigger("selected",b))},lc:function(a){var b=$(a.currentTarget),c=$(a.target);if(c.hasClass("fw-checkbox-specific")||c.hasClass("k6-action"))return!0;var c=b.data("id"),d=this.X(c),e=Date.now();this.R?this.R.id==
c&&400>e-this.R.time?(this.trigger("dblclick",d),this.R=null):(this.b.ia&&this.Da(b,d,a.ctrlKey),this.trigger("click",d),this.R={id:c,Rb:d,time:e}):(this.R={id:c,Rb:d,time:e},this.b.ia&&this.Da(b,d,a.ctrlKey),this.trigger("click",d))},Jb:function(a){if(this.f){this.f.la.css({width:Math.max(a.clientX,this.f.x)-Math.min(a.clientX,this.f.x),height:Math.max(a.clientY,this.f.y)-Math.min(a.clientY,this.f.y),left:a.clientX<this.f.x?a.clientX:this.f.x,top:a.clientY<this.f.y?a.clientY:this.f.y});a=this.$(".fw-record");
this.f.ctrlKey||(a.removeClass("fw-selected"),this.parent.g={});for(var b=this.f.la[0].getBoundingClientRect(),c=0,d=a.length;c<d;c++){var e=a[c],f=e.getBoundingClientRect();if(!(f.right<b.left||f.left>b.right||f.bottom<b.top||f.top>b.bottom)){var e=$(e),f=e.data("id"),g={};g[this.parent.id]=f;g=_.findWhere(this.Z,g);this.parent.g[f]=g;e.addClass("fw-selected")}}this.trigger("viewer:change");this.parent.trigger("selectionChanged")}},rc:function(a){if(this.b&&"drag"==this.b.J){var b=$("<div>");this.f=
{x:a.clientX,y:a.clientY,la:b,ctrlKey:a.ctrlKey};b.css({position:"fixed",left:this.f.x+"px",top:this.f.y+"px",width:"1px",height:"1px",border:"2px solid yellow"});this.$el.append(b);a=b[0].getBoundingClientRect();for(var c=this.$(".fw-selected"),d=0,e=c.length;d<e;d++){var f=c[d],g=f.getBoundingClientRect();g.right<a.left||g.left>a.right||g.bottom<a.top||g.top>a.bottom||(f=$(f),g=f.data("id"),this.f.ctrlKey&&(f.removeClass("fw-selected"),delete this.parent.g[g],this.f=null,b.remove(),this.trigger("viewer:change"),
this.parent.trigger("selectionChanged")))}}},uc:function(a){this.Jb(a);this.f&&this.f.la.remove();this.f=null},tc:function(a){a=$(a.currentTarget).data("id");this.trigger("mouseover",this.X(a))},sc:function(a){a=$(a.currentTarget).data("id");this.trigger("mouseleave",this.X(a))},focus:function(){console.log("focus not implemented")},dc:function(){},X:function(a){for(var b=0,c=this.Z.length;b<c;b++)if(this.Z[b][this.parent.id]==a)return this.Z[b];return null},Dc:function(a){a.originalEvent.preventDefault();
a=$(a.currentTarget);var b=a.data("id");a.prop("checked")?this.parent.g[b]=this.X(b):delete this.parent.g[b];this.trigger("viewer:change");this.parent.trigger("selectionChanged");return!1},Mb:function(){this.$(".abstract-viewer-overlay").remove();this.$el.append('<div class="abstract-viewer-overlay"></div>')},Ac:function(){this.$(".abstract-viewer-overlay").remove()},Qa:function(){this.Mb()},render:function(){"drag"==this.b.J&&this.$el.css({"-webkit-touch-callout":"none","-webkit-user-select":"none",
"-khtml-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none"})},initialize:function(a){a=a?a:{};Framework.o.prototype.initialize.call(this,a);this.B=a.B;this.parent=a.parent},eb:function(){"checkbox"!=this.parent.J&&this.$(".fw-checkbox-specific").remove();if(this.b.pa)for(var a=this.$(".fw-record"),b=0,c=a.length;b<c;b++){var d=$(a[b]),e=d.data("id");this.b.pa==e&&d.addClass("fw-row-selected")}if("drag"==this.parent.J)for(a=this.$(".fw-record"),b=0,c=a.length;b<
c;b++)d=$(a[b]),e=d.data("id"),this.parent.g[e]&&d.addClass("fw-selected");else if("checkbox"==this.parent.J)for(a=this.$(".fw-checkbox"),b=0,c=a.length;b<c;b++)d=$(a[b]),e=d.data("id"),this.parent.g[e]&&(d.addClass("fw-selected"),d.attr("checked","true"));this.Ma=!1},show:function(a){this.Z=records;this.C(this.eb.bind(this),{g:this.parent.g,data:a,id:this.parent.id,B:this.parent.B,selected:this.parent.bc,ia:this.b.ia,J:this.parent.J})}});n("Framework.AbstractViewer",Framework.T);
Framework.Ca=Framework.T.extend({initialize:function(a){Framework.T.prototype.initialize.call(this,a);this.listenTo(this.source,"source:constraintChange",this.v);this.listenTo(this.source,"source:refresh",this.v)},v:function(){this.C()}});n("Framework.Viewer",Framework.Ca);Framework.Ca.prototype.preloadDataAsync=function(a){this.Qa();this.source.get(a)};$.fn.va=function(a,b){b=$.extend({h:10,ga:10,w:0,I:0,Eb:"#",xa:"Prev",ta:"Next",ca:"...",Qb:!1,Gb:!1,aa:function(){return!1}},b||{});this.each(function(){function c(){var c=Math.ceil(b.ga/2),d=Math.ceil(a/b.h),e=d-b.ga;return[f>c?Math.max(Math.min(f-c,e),0):0,f>c?Math.min(f+c,d):Math.min(b.ga,d)]}function d(a,c){f=a;e();var d=b.aa(a,g);d||(c.stopPropagation?c.stopPropagation():c.cancelBubble=!0);return d}function e(){function e(a,c){a=0>a?0:a<m?a:m-1;c=$.extend({text:a+1,ba:""},c||{});var d=a==f?
$("<li class='active'><a href='#'>"+c.text+"</a></li>"):$("<li><a>"+c.text+"</a></li>").bind("click",p(a)).attr("href",b.Eb.replace(/__id__/,a));c.ba&&d.addClass(c.ba);g.append(d)}function p(a){return function(b){return d(a,b)}}g.empty();var l=c(),m=Math.ceil(a/b.h);b.xa&&(0<f||b.Qb)&&e(f-1,{text:b.xa,ba:"prev"});if(0<l[0]&&0<b.I){for(var q=Math.min(b.I,l[0]),k=0;k<q;k++)e(k);b.I<l[0]&&b.ca&&$("<li class='disabled'><a href='#'>"+b.ca+"</a></li>").appendTo(g)}for(k=l[0];k<l[1];k++)e(k);if(l[1]<m&&
0<b.I)for(m-b.I>l[1]&&b.ca&&$("<li class='disabled'><a href='#'>"+b.ca+"</a></li>").appendTo(g),k=Math.max(m-b.I,l[1]);k<m;k++)e(k);b.ta&&(f<m-1||b.Gb)&&e(f+1,{text:b.ta,ba:"next"})}var f=b.w;a=!a||0>a?1:a;b.h=!b.h||0>b.h?1:b.h;var g=$(this);this.nextPage=function(){return f<Math.ceil(a/b.h)-1?(d(f+1),!0):!1};e();b.aa(f,this)})};Framework.U=Framework.o.extend({bb:[10,20,30,50,100,1E3],ab:10,Wa:null,events:{"click [id^='pageSize_']":"onPageSize","click #nextPage":"onNextPage","click #previousPage":"onPreviousPage"},wc:function(a){this.P(a.currentTarget.id.split("_")[1]);this.v()},P:function(a){this.$("#itemsPerPage").html(a);this.s.w=0;this.s.h=Number(a);this.$("#paginationPanel").va(this.source.G(),this.s)},reset:function(){this.s.w=0;this.$("#paginationPanel").va(this.source.G(),this.s)},sa:function(a){this.s.w!=a&&(this.s.w=
a,this.v())},Oa:function(){this.i=new this.source.ConstraintModelPrototype;this.i.P(this.s.h);this.i.ja(this.s.w);return this.i},initialize:function(a){Framework.o.prototype.initialize.call(this,a);this.options=a?a:{};this.h=a.h;this.S=a.S;this.S||(this.S=this.bb);this.h||(this.h=this.ab);this.s={aa:this.sa.bind(this),w:0,xa:"",ta:"",h:this.h,ga:4,I:1};this.listenTo(this.source,"source:constraintChange",this.update);this.listenTo(this.source,"source:refresh",this.update)},jc:function(){var a=this.$("#itemsPerPageMenu");
a.empty();for(var b=0,c=this.S.length;b<c;b++){var d=this.S[b],d=$('<li><a id="pageSize_'+d+'" role="menuitem">'+d+"</a></li>");a.append(d)}this.$("#itemsPerPage").html(this.h)},vc:function(){this.sa(this.s.w+1)},xc:function(){this.sa(this.s.w-1)},update:function(){this.source.getAll(null,function(){this.$("#previousPage,#nextPage").css("visibility","visible");var a=this.s.w;0==a&&this.$("#previousPage").css("visibility","hidden");var b=Number(this.s.h),c=this.source.G(),d=(a+1)*b,d=d>c?c:d,a=1+a*
b,a=a>c?c:a;d==c&&this.$("#nextPage").css("visibility","hidden");d=a+"-"+d+" OF "+c;this.Wa&&(d+=" IN "+this.Wa);this.$("#paginationPanel").va(this.source.G(),this.s);this.$("#paginationCount").html(d);0==c?this.$("#paginationCount").css("visibility","hidden"):this.$("#paginationCount").css("visibility","visible")}.bind(this))},C:function(a,b){var c=function(){this.$el.html("unable to get count for paginationPanel")}.bind(this);this.source.getAll(null,function(){Framework.o.prototype.C.call(this,
function(){this.update();a&&a()}.bind(this),b)}.bind(this),c)}});n("Framework.PaginationPanel",Framework.U);
Framework.W=Framework.U.extend({events:{"click #more":"onMore"},fb:function(a){var b=$(window).height(),c=$(window).scrollTop(),d=$(a).offset().top;a=$(a).height();return d<1.2*(b+c)&&d>c-a},initialize:function(a){Framework.o.prototype.initialize.call(this,a);setInterval(this.ib.bind(this),500)},Ua:function(){},Ia:function(){this.source.getAll(null,function(){this.source.G()<=(this.nextPage+1)*this.Ba?this.$el.hide():this.oa=!1}.bind(this))},Ga:function(){this.nextPage++;this.v();this.Ia()},ib:function(){0<
this.$("#more").length||!this.fb(this.el)||this.oa||(this.oa=!0,this.Ga())},update:function(){},reset:function(){this.oa=!1;this.nextPage=0;this.$el.show()},render:function(){this.Ia()},Ba:8,nextPage:0});n("Framework.ScrollPaginationPanel",Framework.W);Framework.W.prototype.getConstraintModel=function(){this.i=new this.source.ConstraintModelPrototype;this.i.P(this.Ba);this.i.ja(this.nextPage);return this.i};Framework.W.prototype.onMore=function(){this.Ga()};Framework.l=Backbone.View.extend({dataType:"json",url:null,initialize:function(){this.i=new this.ConstraintModelPrototype;this.O={};this.u={};this.cache={};this.ra={};this.Pb={};this.Y={};this.Pa=!1;if(!this.url)throw"this.url must be defined";},subscribe:function(a){this.O[a.cid]=a;a instanceof Framework.W&&(this.gb=!0);this.listenTo(a,"constraintPanel:changed",this.Ib)},unsubscribe:function(a){delete this.O[a.cid]},Ua:function(a){this.i=a;for(var b in this.O)this.O[b].Ua(this.i)},Ea:function(a){var b=
new this.ConstraintModelPrototype,c;for(c in this.O){var d=this.O[c];a&&d instanceof Framework.U&&(this.M=null,d.reset());b=b.intersection(d.getConstraintModel())}return b},Ib:function(a){var b=!(a instanceof Framework.U);b&&(this.M=null);b=this.Ea(b);this.Xb(b,a)},fc:function(){this.cache={}},Xb:function(a,b){this.Wb(a);this.trigger("source:constraintChange",b)},Wb:function(a){this.i=a;"POST"==this.ConstraintModelPrototype.prototype.type?this.wa=JSON.stringify(a.Na()):this.i.getUrl()},G:function(){return this.count},
getAll:function(a,b,c){a="";(this.i=this.Ea())&&"GET"==this.ConstraintModelPrototype.prototype.type&&(a="?"+this.i.getUrl());var d=this.url+a;this.ra[d]&&(this.count=this.ra[d]);null==this.cache[d]||this.Fa&&this.Fa!=this.wa?this.Y[d]?(this.u[d]||(this.u[d]=[]),this.u[d].push(b)):(this.Y[d]=!0,this.u[d]=[],this.u[d].push(b),this.N&&(this.N.url&&(this.u[d]=this.u[this.N.url].concat(this.u[d]),delete this.u[this.N.url]),this.N.abort()),this.N=$.ajax({headers:{Za:"application/json"},cache:!1,contentType:"application/json",
type:this.gc,processData:!1,url:d,dataType:this.dataType,data:this.wa,success:function(a){this.Pa||(this.Pb[d]=a);var b=function(a){this.Y[d]=!1;this.gb&&(this.M||(this.M=[]),a=this.M=this.M.concat(a));this.Fa=this.wa;this.Pa||(this.cache[d]=a,this.ra[d]=this.count);for(var b=0,c=this.u[d].length;b<c;b++)this.u[d][b](a);this.u[d]=[]}.bind(this);this.parseAsync(a,function(a){b(a)}.bind(this))}.bind(this),error:function(a){this.Y[d]=!1;"abort"!=a.statusText&&(c?c(a):(console.log("error:"),console.log(a)))}.bind(this)}),
this.N.url=d):b(this.cache[d])},destroy:function(){console.log("destroying source")},refresh:function(){this.cache={};this.trigger("source:refresh")}});n("Framework.RestSource",Framework.l);Framework.l.prototype.Oa=function(){return this.i};Framework.l.prototype.getConstraintModel=Framework.l.prototype.Oa;Framework.l.prototype.ConstraintModelPrototype=Framework.j;Framework.l.prototype.get=function(a,b){this.getAll(null,a,b)};Framework.l.prototype.get=Framework.l.prototype.get;
Framework.l.prototype.A=function(a){this.count=a};Framework.l.prototype.setCount=Framework.l.prototype.A;Framework.l.prototype.G=function(){return this.count};Framework.l.prototype.getCount=Framework.l.prototype.G;Framework.l.prototype.parseAsync=function(a,b){b(a)};Framework.cb=Framework.a.extend({el:"#sourceView",Sb:null,c:[Framework.T],Tb:Framework.Aa,id:"uuid",H:"undefined",J:"checkbox",ec:{},ia:!1,B:null,initialize:function(a){a=a?a:{};this.g={};Framework.a.prototype.initialize.call(this,a);a.H&&(this.H=a.H);this.B=a.B;this.source=a.source;this.Ka=a.Ka;this.ea("recordSelectionPanel",this.Tb);this.source&&(this.listenTo(this.source,"source:constraintChange",this.v),this.listenTo(this.source,"source:refresh",function(){this.v(!0)}.bind(this)));for(a=this.c.length-
1;0<=a;a--)this.ea(this.c[a].prototype.name,this.c[a],{g:this.g,B:this.B,parent:this,source:this.source}),this.listenTo(this[this.c[a].prototype.name],"dblclick",this.wb),this.listenTo(this[this.c[a].prototype.name],"click",this.vb),this.listenTo(this[this.c[a].prototype.name],"selected",this.Ab),this.listenTo(this[this.c[a].prototype.name],"unselected",this.Bb),this.listenTo(this[this.c[a].prototype.name],"files",this.xb),this.listenTo(this[this.c[a].prototype.name],"mouseover",this.zb),this.listenTo(this[this.c[a].prototype.name],
"mouseleave",this.yb),this.listenTo(this[this.c[a].prototype.name],"viewer:change",this.da),this.listenTo(this[this.c[a].prototype.name],"viewer:setRecord",this.Cb);if(!this[this.H]&&0<this.c.length){if(this.H)throw"unresolved initialView: "+this.H;throw"initial view must be either passed in the viewer or defined in the extended view i.e: window.YourView = SourceView.extend({ initialView : 'grid' }) // where 'grid' resolves to GridViewer.prototype.name";}},zb:function(a){this.trigger("mouseover",
a)},yb:function(a){this.trigger("mouseleave",a)},wb:function(a){this.trigger("dblclick",a)},vb:function(a){this.trigger("click",a)},xb:function(a){this.trigger("files",a)},Ab:function(a){this.pa=a[this.id];this.$("#viewer_holder").focusin();this.trigger("selected",a)},Bb:function(){this.pa=null;this.trigger("unselected")},Cb:function(a){this.rb=a;this.trigger("viewer:setRecord",a)},rb:null,Cc:function(a){this.B=a;this.v()},Ub:function(){this.source.getAll(null,function(a){for(var b=a.length-1;0<=
b;b--)this.g[a[b][this.id]]=a[b];this.da();this.m&&this.m.show(a);this.trigger("selectionChanged")}.bind(this))},La:function(){for(var a in this.g)delete this.g[a];this.trigger("selectionCleared");this.lb()},lb:function(){this.da();this.source&&this.source.getAll(null,function(a){this.m&&this.m.show(a)}.bind(this))},qb:function(){this.source.getAll(null,function(a){for(var b=a.length-1;0<=b;b--)delete this.g[a[b][this.id]];this.da();this.m.show(a)}.bind(this))},v:function(a){this.ac||(this.Ka&&this.La(),
this.m&&(this.m.Qa(),this.$("#viewerProgressBar").show(),this.source.getAll(null,function(b){this.$("#viewerProgressBar").hide();this.Va.update();this.m.show(b);a&&this.m.$(".fw-row-selected").trigger("mousedown");this.Xa()}.bind(this))))},render:function(){var a=$('<div id="viewer_holder" tabindex="1" style="outline:none;position: relative; height: 100%;width:100%;overflow-x: hidden;overflow-y: hidden; display: block;">');this.$el.empty();this.$el.append('<div id="viewerProgressBar" class="progress" style="display:none;margin-bottom: -6px;margin-top: 2px;"><div class="indeterminate"></div></div>');
this.$el.append(a);for(var b=this.c.length-1;0<=b;b--){var c=$('<div style="height: 100%;" id="'+this.c[b].prototype.name+'" class="record_viewer"></div>');a.append(c);this[this.c[b].prototype.name].setElement(c)}$el=this.Sb;$el||($el=$('<div id="viewerRecordSelectionPanelEl">'),this.$el.prepend($el));this.Va.setElement($el).C();this.ub(this.H);this.Ta={};$(document).on("keydown",function(a){a=a||window.event;this.Ta[a.keyCode]=!0}.bind(this));$(document).on("keyup",function(a){a=a||window.event;
delete this.Ta[a.keyCode]}.bind(this))},da:function(){this.Va.update();this.Xa()},ub:function(a){this.Ya(a);this.m&&this.m.focus()},Xa:function(){for(var a=this.c.length-1;0<=a;a--)this.m!=this[this.c[a].prototype.name]&&(this[this.c[a].prototype.name].Ma=!0)},Ya:function(a){this.m=this[a];for(var b=this.c.length-1;0<=b;b--)this.$("#"+this.c[b].prototype.name).hide();this.$("div#"+a).show();this.m&&this.m.Ma&&this.source.getAll(null,function(a){this.m.show(a)}.bind(this));this.trigger("sourceView:change",
a)}});n("Framework.SourceView",Framework.cb);Framework.D=Framework.a.extend({initialize:function(a){Framework.a.prototype.initialize.call(this,a);this.Ha={}},events:{"click .fw-tab-toggle":"otc"},mb:function(a){var b=$(a.currentTarget);a=b[0].id;this.ha&&this.setParameter(this.ha,a);var c=b.data("viewconstructor"),d=this.$('.fw-tab-content[data-id="'+a+'"]'),e=this.$('.fw-tab-content[data-for="'+a+'"]');if(0==d.length)throw"corresponding div does not exist";this.$(".fw-tab-toggle").removeClass("active");b.addClass("active");this.$(".fw-tab-content").hide();
d.show();e.show();if(!this.Ha[a]){this.Ha[a]=!0;b=null;if(c&&window[c])b=window[c];else throw"constructor "+c+" does not exist";this.ea("content_"+a,b,{});this["content_"+a].setElement(d).C()}this.trigger("tab:"+a)},render:function(){this.$(".fw-tab-content").hide();this.ha&&this.getParameter(this.ha)?this.za(this.getParameter(this.ha)):(this.$(".fw-tab-toggle.active").click(),this.ma.Lb&&this.za(this.ma.Lb))}});n("Framework.TabView",Framework.D);Framework.D.prototype.otc=function(a){this.mb(a)};
Framework.D.prototype.A=function(a){this.$(this.$(".fw-tab-toggle")[a]).click()};Framework.D.prototype.setTabByIndex=Framework.D.prototype.A;Framework.D.prototype.za=function(a){this.$(".fw-tab-toggle#"+a).click()};Framework.D.prototype.setTabById=Framework.D.prototype.za;Framework.Yb=Framework.a.extend({initialize:function(a){Framework.a.prototype.initialize.call(this,a);this.ka=a.ka;if(!this.ka)throw"you must specify sourceView parameter in options.";this.listenTo(this.ka,"sourceView:change",this.Kb)},Kb:function(){},events:{"click .view-toggle":"onViewToggle"},zc:function(a){a=$(a.currentTarget).data("viewer");this.ka.Ya(a)},render:function(){}});