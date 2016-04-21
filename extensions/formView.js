Framework.Ext.FormView = Framework.BaseView.extend({

	events : {
		'change input' : 'onInputChange',
		'change select' : 'onInputChange',
		'keyup input' : 'onInputChange',			
	},
	onInputChange : function(e){
		this.trigger('form:inputChange');	
	},

    initialize : function(options){
        Framework.BaseView.prototype.initialize.call(this,options);
    },
    errorField : function(name, msg, noTrigger){
        var $input = this.$('#' + name);
        if(!noTrigger){
        	$input.focus();
        }
        if(msg){
            $input.next().attr('data-error', msg);
            // makes the message small and fit
            $input.next().addClass('active');
        }
        $input.addClass('invalid');
    },
    clearErrors : function(){
        this.$('input').removeClass('invalid');
    },

    getForm : function(){
        var form = {};
        var $array = this.$('input, select');

        for(var i =0, l = $array.length; i < l ; i++){
            var $el = $($array[i]);
            if($el.is(':checkbox')){
            	form[$array[i].id] = "" + $($array[i]).prop('checked');
            }else {
            	form[$array[i].id] = $($array[i]).val();
            }
            
        }
        return form;
    }
});