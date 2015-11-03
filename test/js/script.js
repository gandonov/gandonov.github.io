InnerView = Framework.BaseView.extend({
    render: function() {
        this.$el.html(":-)");
    },
    preloadDataAsync : function(callback, error){
        this.getJSON('www.google.com', callback);        
    }
});


MyConstraintModel = Framework.AbstractConstraintModel.extend({
    getUrl : function(){
        return "a=" + this.getField('a');
    }
});

MySource = Framework.RestSource.extend({
    ConstraintModelPrototype : MyConstraintModel,
    url : '/search'
});

MyConstraintPanel = Framework.AbstractConstraintPanel.extend({
    getConstraintModel : function(){
        var constraintModel = Framework.AbstractConstraintPanel.prototype.getConstraintModel.call(this);
        constraintModel.setField('a', 'okay');
        return constraintModel;
    }
});

ClosureTest = Framework.BaseView.extend({
    events: {
        'click #destroyInner': 'onDestroyInner'
    },
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        this.innerView = this.instantiateView('innerView', InnerView, {});
    },
    render: function() {
        this.$el.html('here is my inner view: ' + '<div id="innerView"></div><button id="destroyInner">kill it</button>');
        this.innerView.setElement(this.$('#innerView')).renderView();
    }
});

/* events */
ClosureTest.prototype['onDestroyInner'] = function() {
    this.innerView.destroy();
};

$(document).ready(function() {
    console.log('hehehehe');
    closureTest = new ClosureTest();
    closureTest.setElement($('#test')).renderView();
    mySource = new MySource();
    var myConstraintPanel = new MyConstraintPanel({ source : mySource});
    myConstraintPanel.setElement($('#cp')).renderView();
    mySource.get(function(data){
        console.log('data');
    }, function(data){
        console.log('error occured');
    })
});
