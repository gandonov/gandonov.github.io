InnerView = Framework.BaseView.extend({render: function() {
        this.$el.html(":-)")
    },preloadDataAsync: function(a) {
        this.getJSON("www.google.com", a)
    }});
MyConstraintModel = Framework.AbstractConstraintModel.extend({getUrl: function() {
        return "a=" + this.getField("a")
    }});
MySource = Framework.RestSource.extend({ConstraintModelPrototype: MyConstraintModel,url: "/search"});
MyConstraintPanel = Framework.AbstractConstraintPanel.extend({getConstraintModel: function() {
        var a = Framework.AbstractConstraintPanel.prototype.getConstraintModel.call(this);
        a.setField("a", "okay");
        return a
    }});
ClosureTest = Framework.BaseView.extend({events: {"click #destroyInner": "onDestroyInner"},initialize: function(a) {
        Framework.BaseView.prototype.initialize.call(this, a);
        this.a = this.instantiateView("innerView", InnerView, {})
    },render: function() {
        this.$el.html('here is my inner view: <div id="innerView"></div><button id="destroyInner">kill it</button>');
        this.a.setElement(this.$("#innerView")).renderView()
    }});
ClosureTest.prototype.onDestroyInner = function() {
    this.a.destroy()
};
$(document).ready(function() {
    console.log("hehehehe");
    closureTest = new ClosureTest;
    closureTest.setElement($("#test")).renderView();
    mySource = new MySource;
    (new MyConstraintPanel({source: mySource})).setElement($("#cp")).renderView();
    mySource.get(function() {
        console.log("data")
    }, function() {
        console.log("error occured")
    })
});
