ModalView = Framework.BaseView.extend({
    
    title : 'ModalView',
    dismissible: true,
    in_duration : 200,
    out_duration : 200,
    returnOnComplete : function(){
        // modal is about to close,
        // you can collect all your feedback here.
        return { status : this._ok, something : 'test'};
    },
    beforeComplete : function(){
      // noop  
    },
    initialize : function(options){
        options = options ? options : {};
        Framework.BaseView.prototype.initialize.call(this, options);
        if(options.onComplete){
            this.onComplete = options.onComplete;
        }
        if(options.title){
            this.title = options.title;
        }
        if(options.beforeComplete)
        {
            this.beforeComplete = options.beforeComplete;
        }
        this._ok = false;

    },
    fixedFooter : false,
    
    onComplete : function(data){
        console.log('override this client side.');
        console.log(data);
    },
    validate : function(){
        return true;
    },
	_beforeDestroy : function(){
	    if(this.$trigger){
	       this.$trigger.remove();
	    }
	    this.setElement(this.$modalHolder);
	},

    onOkay : function(e){
        this._ok = true;
        try{
            var callback = function(){
                if(!this._canceled){


                    this.onComplete(this.returnOnComplete());                        
                }else {
                    console.log('modal canceled, discarding callback');
                }
                this.beforeComplete();
                $("#" + this.id).closeModal();
                this.destroy();                    
            }.bind(this);
            if(this.validateAsync){
                this.$asyncProgress.show();
                this.validateAsync(callback.bind(this), function(e){
                    this.$asyncProgress.hide();
                    Materialize.toast(e, 2000);
                }.bind(this));
            }else if(this.validate()){
                callback();
            }
        }catch(e){
            this.$asyncProgress.hide();
            Materialize.toast(e, 2000);
        }
        return false;
    },

    buttons : '<a id="OKButton" class="waves-effect waves-green btn-flat">ok</a><a id="CancelButton" class=" modal-action modal-close waves-effect waves-green btn-flat">cancel</a>',

    _fullScreen : function(){
        return false;
    },
    smallButtons : '<ul class="left"><li><a id="CancelButton" class="modal-action modal-close"><i class="mdi-navigation-close"></i></a></li></ul>' + 
    '<ul class="right"><li><a id="OKButton" class="">OK</a></li></ul>',
    renderContent : function(callback, data){
        this.setElement(this.$content);
        Framework.BaseView.prototype.renderView.call(this, callback, data);
    },

    renderView : function(callback, data){
        var isSmall = this._fullScreen();

        var id = 'modal_' + Date.now();
        this.id= id;
        var modalHtml = "";
        if(!isSmall){

            modalHtml += '<div id="'+id+'" class="modal'+ (this.fixedFooter ? " modal-fixed-footer" : "") + (this.large ? " modal-large" : "") + '" >' +
            '<div class="modal-content">'+
              '<div id="asyncProgress" class="progress" style="display:none;"><div id="asyncProgressBar" class="indeterminate"></div></div>' +
             ' <div id="content"><div class="progress"><div class="indeterminate"></div></div></div>'+
            '</div>'+
            '<div class="modal-footer">';
            modalHtml += this.buttons;   
            modalHtml += '</div></div>'; 

        }else {
            this.in_duration = 0;
            this.out_duration = 0;
            modalHtml += '<div id="'+id+'" class="modal modal-small" >';
            
            
            modalHtml += "<div class='navbar-fixed'><nav class='fw-nopad col m12 s12 amber darken-3'><div class='nav-wrapper'>";    
            modalHtml += this.smallButtons;
            modalHtml += "</div></nav></div>";

            modalHtml += '<div class="modal-content">';
            modalHtml += '<div id="asyncProgress" class="progress" style="display:none;"><div id="asyncProgressBar" class="indeterminate"></div></div>';
            modalHtml += '<div id="content"><div class="progress"><div class="indeterminate"></div></div></div>';
            modalHtml += '</div>';

            modalHtml += '</div>';
        }

		var that = this;
        this.$trigger = $('<a class="modal-trigger hide" href="#'+id+'">Modal</a>');
        this.$modalHolder = $(modalHtml);
        
        //set the z-index to the id so the modals stack.
        this.$modalHolder.css("z-index", this.id.split('modal_')[1]);

        this.$content = this.$modalHolder.find('#content');

        $('body').prepend(this.$trigger);
        $('body').prepend(this.$modalHolder);
        var $okButton = this.$modalHolder.find('#OKButton');
        var $cancelButton = this.$modalHolder.find('#CancelButton');
        $cancelButton.on('click', function(e){
            this._canceled = true;
        }.bind(this));
        this.$asyncProgress = this.$modalHolder.find('#asyncProgress');
        this.$asyncProgressBar = this.$modalHolder.find('#asyncProgressBar');
        $okButton.on('click', this.onOkay.bind(this));

        this.$trigger.leanModal({
              dismissible: this.dismissible, // Modal can be dismissed by clicking outside of the modal
              opacity: .5, // Opacity of modal background
              in_duration: this.in_duration, // Transition in duration
              out_duration: this.out_duration, // Transition out duration
              ready: function() {               
                this.renderContent(callback, data);

              }.bind(this), // Callback for Modal open
              complete: function(e) {
                  $("body").removeClass("fw-modal-open");                  
                 this.$trigger.remove();
                 this.$modalHolder.remove();
                 if(this.beforeComplete){
                     this.beforeComplete();
                 }
                 this.destroy();                 
              }.bind(this) // Callback for Modal close
            }
        );
        $("body").addClass("fw-modal-open");
        this.$trigger.click();
    }

});

TestModal = ModalView.extend({
    title : 'Test Modal',
    template : 'templates/Test.html'

});

ProcessModal = ModalView.extend({
    buttons : '<a id="OKButton" class="hide waves-effect waves-green btn-flat">ok</a><a id="CancelButton" class=" modal-action modal-close waves-effect waves-green btn-flat">cancel</a>',
    in_duration : 0,
    out_duration : 0,
    beforeComplete : function(){
        // we need to kill this fast....
        $("#" + this.id).closeModal();        
    },
    returnOnComplete : function(){
        return this._programResult;
    },
    dismissible : false,
    indeterminate : true,
    //you can pass progress update event into progressBar
    //if indeterminate == false
    //if XHR is returned in program it will "abort" if task is cancelled (not yet implemented);
    //on success acts like validateAsync worked.
    program : function(success, error, $progresBar){
        setTimeout(function(){
            // override this with some async logic.
            // you can pass the product of this execution in this field, or
            // override dynamically this.returnOnComplete 

            this._programResult = { fetched : [ 0x68, 0x61, 0x78, 0x78, 0x6F, 0x72 ] };
            success();
        }.bind(this), 2000);      
    },
    //if override this for this type of modal, it will lose it's purpose
    validateAsync : function(callback, error){
        this.program(callback, error,this.$asyncProgressBar);
    },

    initialize : function(options){
        options = options ? options : {};
        if(options.program){
            this.program = options.program;
        }
        ModalView.prototype.initialize.call(this, options);
    },
    render : function(){
        if(!this.indeterminate){
            this.$asyncProgressBar.removeClass('indeterminate');
            this.$asyncProgressBar.addClass('determinate');
            this.$asyncProgressBar.width('0%');
        }
        this.$content.html('Processing...');
        var $okButton = this.$modalHolder.find('#OKButton');
        $okButton.click();
    }

});

AWLoginView =  ModalView.extend({
    title : 'Sign In',
    template : 'templates/LoginModal.html',
    dismissible: false,
    initialize : function(options){
        ModalView.prototype.initialize.call(this, options);
    },

    validateAsync : function(callback, error){
        var username = this.$('#username').val();
        var password = this.$('#password').val();
       
        
        $.ajax({
            url: "/fw-server/rest/user/details",
            type:"GET",
            contentType: "application/json",
            processData : false,
            dataType: "json",
            beforeSend: function(xhr) {
              xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
            },
            success:function(response, textStatus, jqXHR){
                callback("good");
                return false;
            }.bind(this),
            error:function(result){
                if(result.status != 200){
                    error("bad...");
                }else {
                    callback("good");
                }
                
                return false;
            }.bind(this)
        });

                
        return true;        
    },

    returnOnComplete : function(){
        location.reload();
        return { status : 'no'};
    },

    beforeComplete : function()
    {

    },

    render : function(){
        $("#CancelButton").hide();
        var audio = new Audio("resources/droneWare.mp3");
        audio.play();

      //  userPropertiesSource.clearCache(); // clear cache
        this.$modalHolder.find('#OKButton').html('Login');
        //this.$modalHolder.find('#OKButton').hide();
        this.$('#password,#username').keyup(function(event) {
            if(event.keyCode == 13){
                this.$modalHolder.find('#OKButton').click();
            }
        }.bind(this));
    }

});


RenamePrompt = ModalView.extend({
    title : 'Rename',
    initialize : function(options){
        options = options ? options : {};
        ModalView.prototype.initialize.call(this, options);
        if(options.title){
            this.title = options.title;
        }
        this.name = options.name;
    },
    render : function(){
        var html = '<p><div class="row">';
        html+='<div class="input-field col s12">';
        html+='<input id="filterValue" type="text" class="validate">';
        html+='<label for="filterValue"></label>';
        html+='</div></p>';
        this.$el.html(html);
        this.$('#filterValue').keyup(function(event) {
            if(event.keyCode == 13){

                this.$modalHolder.find('#OKButton').click();
            }
        }.bind(this));
        if(this.name){
            this.$('#filterValue').val(this.name);
        }
        this.$('#filterValue').focus();
        this.returnOnComplete = function(){
            // modal is about to close,
            // you can collect all your feedback here.
            return { status : 'ok', value : this.$('#filterValue').val()};
        }.bind(this)       
    }
})

AreYouSurePrompt = ModalView.extend({
    title : 'Are you Sure',
    description : 'Please, think about this for a minute. Do you really want to continue with this?',
    initialize : function(options){
        options = options ? options : {};
        ModalView.prototype.initialize.call(this, options);
        if(options.title){
            this.title = options.title;
        }
        this.description = options.description ? options.description : this.description;
    },
    render : function(){
        var html = '<p>' + this.description + '</p>';
        
        this.$el.html(html);
        this.returnOnComplete = function(){
            // modal is about to close,
            // you can collect all your feedback here.
            return { status : 'ok'};
        }.bind(this)       
    }
})



FilterPrompt = ModalView.extend({
    title : 'Filter',
    template : 'templates/AWFilterPrompt.html',
    initialize : function(options){
        ModalView.prototype.initialize.call(this, options);
        this.column = options.column;
        this.value = options.value ? options.value : null;
        this.sort = options.sort ? options.sort : "none";
        this.title = "Sort/Filter by " + this.column.displayName;

    },

    events : {
    	'click #sort' : 'onSort',
    },
    setSortIcon : function(sort){
    	this.$('#sort').removeClass('mdi-action-swap-vert');
    	this.$('#sort').removeClass('mdi-navigation-arrow-drop-up');
    	this.$('#sort').removeClass('mdi-navigation-arrow-drop-down');
    	if(sort == "asc"){
    		this.$('#sort').addClass('mdi-navigation-arrow-drop-up');
    	}else if(sort == "desc"){
    		this.$('#sort').addClass('mdi-navigation-arrow-drop-down');
    	}else if(sort == "none"){
    		this.$('#sort').addClass('mdi-action-swap-vert');
    	}else {
    		throw "your sort == to " + sort + " ???";
    	}
    },
    onSort : function(){
    	if(this.sort == "none"){
    		this.sort = "asc";
    	}else if(this.sort == "asc"){
    		this.sort = "desc";
    	}else if(this.sort == "desc"){
    		this.sort = "none";
    	}else {
    		throw "your sort == to " + this.sort + " ???";
    	}
    	this.setSortIcon(this.sort);
    },

    render : function(){
        this.setSortIcon(this.sort);
        if(this.column.type == 'DATE'){
           var html = '<p><label for="fromDate">From</label><input id="fromDate" type="date" class="datepicker"></p>';
           html+= '<p><label for="toDate">To</label><input id="toDate" type="date" class="datepicker"></p>';
           
           this.$('#actualFilter').html(html); 

           if(window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
                this.$('#missionDate').attr('type', 'text');     
            }else { 
                this.$('.datepicker').pickadate({
                    selectMonths: true, // Creates a dropdown to control month
                    selectYears: 15 // Creates a dropdown of 15 years to control year
              });
            }

//           this.$('.datepicker').on('open',function(){
//               $('.modal').hide();
//           });
            this.returnOnComplete = function(){
                // modal is about to close,
                // you can collect all your feedback here.
                try {
                        var from = new Date(this.$('#fromDate').val());
                        var to = new Date(this.$('#toDate').val());
                } catch(e){
                    throw "unable to parse mission date format";
                }
                to.setTime(to.getTime() + 86399999);
             var str = from.toLocaleString('en-GB').replace(',','') + '-' + to.toLocaleString('en-GB').replace(',','');
    
                return { 
                status : 'ok', 
                // add displayValue to All
                value : str,
                sort : this.sort
                 };
            }.bind(this)

            
        }else if(this.column.displayType == 'list'){
            var html = "<p><label>Select from list</label>";
            html+= '<select id="listSelect" class="browser-default">';
            for(var i = 0, l = this.column.element.length; i < l; i++){
                var e = this.column.element[i];
                html+='<option value="'+ e.value+'">' + e.name + '</option>';
            }
            html+= '</select></p>';
            this.$('#actualFilter').html(html);
            this.returnOnComplete = function(){
                // modal is about to close,
                // you can collect all your feedback here.
                return { status : 'ok', value : this.$('#listSelect').val(), sort : this.sort};
            }.bind(this)


        }else if(this.column.displayType == null){
            var html = '<p><div class="row">';
            html+='<div class="input-field col s12">';
            html+='<input id="filterValue" type="text" class="validate" value="' + (this.value ? this.value : "")+ '">';
            html+='<label for="filterValue">Filter String</label>';
            html+='</div></p>';
            this.$('#actualFilter').html(html);
            this.$('#filterValue').keyup(function(event) {
                if(event.keyCode == 13){

                    this.$modalHolder.find('#OKButton').click();
                }
            }.bind(this));
            this.$('#filterValue').select();
            this.$('#filterValue').focus();
            this.returnOnComplete = function(){
                // modal is about to close,
                // you can collect all your feedback here.
                return { status : 'ok', value : this.$('#filterValue').val(), sort : this.sort};
            }.bind(this)
        }
        
    }
});