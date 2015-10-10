var sampleSchema = [
    {
        "type": "input",
        "key": "input1",
        "enabled": "true",
        "attributes": {
            "type": "text",
            "id": "id",
            "title": "My Input Box"
        }
    },
    {
        "type": "input",
        "key": "input2",
        "enabled": "true",
        "attributes": {
            "type": "Checkbox",
            "id": "id",
            "title": "My Input Box"
        }
    },
    {
        "type": "input",
        "key": "radio",
        "enabled": "true",
        "attributes": {
            "type": "radio",
            "name": "cat",
            "title": "My Input Box",
            "value": "lol"
        }
    },
    {
        "type": "input",
        "key": "radio2",
        "enabled": "true",
        "attributes": {
            "type": "radio",
            "name": "cat",
            "title": "My Input Box",
            "value": "rofl"
        }
    },
    {
    	"type": "select",
    	"key" : "select1",
    	"attributes": {

    	},
    	"options":[
			{
				"name": "Option 1",
				"attributes" : {
					"value": "Value 1"
				}
			},
			{
				"name": "Option 2",
				"attributes" : {
					"value": "Value 2"
				}
			},
			{
				"name": "Option 3",
				"attributes":{
					"value": "Value 3"
				}
			}
		]
    },
    {
    	"type": "textarea",
    	"key" : "textarea1",
    	"enabled": "true"
    }
];
var AbstractComponent = function(componentSchema, componentId)
{
	//Abstract component initializer relies on "type" to be a valid html component eg input of select.
	this.id = componentId;
	this.$element = $('<'  + componentSchema.type + ' id="' + this.id + '" >');
	
	this.target = componentSchema.target;

	this.cloneable = componentSchema.cloneable;

	if(componentSchema.attributes)
	{
		this.attributes = componentSchema.attributes
		this.attributeTypes = Object.keys(this.attributes);
		
	    /**
	     * Set the proper attributes from the componentSchema
	     */
		for(var i = 0, l = this.attributeTypes.length; i < l; i++)
		{
			var attributeKey = this.attributeTypes[i];
			var attributeValue = this.attributes[attributeKey];
			this.$element.attr(attributeKey, attributeValue);
		}
	}

	/**
	Handling for selection components which have sub-elements
	**/
	if(componentSchema.type === "select" && componentSchema.options)
	{
		this.options = componentSchema.options;
		this.optionElements = [];
		for(var i = 0, l = this.options.length; i < l; i++)
		{
			var $optionElement = $('<option>' + this.options[i].name + '</option>');
			var optionKeys = Object.keys(this.options[i].attributes);
			for(var j = 0, k = optionKeys.length; j < k; j++)
			{
				$optionElement.attr(optionKeys[j], this.options[i].attributes[optionKeys[j]]);
			}

		this.$element.append($optionElement);
		}
	}
	this.$inputElement = this.$element;
	/**
	 * Handle cloning
	 */
	if(this.cloneable)
	{
		//mdi-content-remove
		this.$inputElement = this.$element;
		this.$element = $('<div id="cloneWrapper">').append(this.$element).append($('<span id="removeClone_' + this.id + '">').append(''));
		//$cloneRemover = $('<span id="removeClone_' + this.id + '">').append('<i class="mdi-content-remove"></i>');
		//this.$element.append()
		//.append($('<div style="display: inline-block" id="clone_' + this.id + '"><i class="small mdi-content-add"></i>')).append(this.$element).append($('<div id="removeClone_' + this.id + '">'));
		//this.$element = $('<div id="cloneWrapper">').append($('<div style="display: inline-block" id="clone_' + this.id + '"><i class="small mdi-content-add"></i>')).append(this.$element).append($('<div id="removeClone_' + this.id + '">'));
	}
};

AbstractComponent.prototype = {

	/**
	 * Retrieve the component element;
	 */
	$ : function()
	{
		return this.$element;	
	},

	/**
	 * Render our component
	 */
	render : function(element)
	{
		if(this.target)
		{
			$(this.target).append(this.$element);
		} else {
			$(element).append(this.$element);
		}
	},

	/**
	 * Returns the value of the form component;
	 */
	getValue : function()
	{
		if(this.attributes && this.attributes.type && this.attributes.type.toLowerCase() === "checkbox")
		{
			return this.$inputElement.prop('checked');
		} else {
			return this.$inputElement.val();
		}
	},

	/**
	 * Destroys form components;
	 */
	 destroy : function()
	 {
	 	this.$element.remove();
	 	delete this.$element;	
	 }
};

var AWForm = function(formSchema){
	if(typeof formSchema === 'string')
	{
		this.formObject = JSON.parse(formSchema);
	} else {
		this.formObject = formSchema;
	}
	this.componentCount = this.formObject.length;
	this.components = {};

	this.unRenderedComponents = []; //components that have not been rendered yet.

	//Create Our Form Components
	for(var i = 0; i < this.componentCount; i++)
	{
		this.createComponent(this.formObject[i].key, this.formObject[i]);
	}

};

AWForm.prototype = {

	/**
	 * Returns a component element from the component key.
	 */
	 $ : function(key, value)
	 {
	 	if(key)
	 	{
	 		if(value && value < this.components[key].length)
	 		{
	 			return this.components[key][value].$();
	 		} else {
	 			var elementArray = [];
	 			for(var i = 0; i < this.components[key].length; i++)
	 			{
	 				var element = this.components[key][i].$()[0];
					elementArray.push(element);
	 			}
	 			return elementArray;
	 		}
	 	} else {
	 		return this.$element;
	 	}
	 },

	/*
	 * Returns an array of all of the component jQuery objects.
	 */
	$all : function()
	{
		var keys = Object.keys(this.components);
		var elements = [];
		for(var i = 0, l = keys.length; i < l; i++)
		{
			var componentArray = this.components[keys[i]];
			for(var j = 0, k = componentArray.length; j < k; j++)
			{
				elements.push(componentArray[j].$());
			}
		}

		return elements;
	},

	/**
	 * To do, update component function to append clone elements correctly to form.
	 *  Best used for dynamic forms where user can add additional input fields.
	 */
	clone : function(componentKey)
	{
		for(var i = 0; i < this.componentCount; i++)
		{
			if(this.formObject[i].key == componentKey)
			{
				this.createComponent(this.formObject[i].key, this.formObject[i]);
				//if this component has a cloneLink create all linked components too.
				if(this.formObject[i].cloneLink)
				{
					for(var j = 0; j < this.formObject[i].cloneLink.length; j++)
					{
						this.clone(this.formObject[i].cloneLink[j]);
					}
				}
			}
		}
	},

	/**
	 *To do, design and implement.
	 */
	destroyComponent : function(componentId)
	{
		var componentKeys = Object.keys(this.components);
		for(var i = 0; i < componentKeys.length; i++)
		{
			var key = componentKeys[i];
			var componentArray = this.components[key];
			for(var j = 0, k = componentArray.length; j < k; j++)
			{
				if(componentArray[j].id == componentId){
					componentArray[j].destroy();
					delete this.components[key][i];
					this.components[key].splice(i, 1);
				}
			}
		}
	},

	/**
	 * Sets the form's parent element to the provided element.
	 */
	 setElement : function(element)
	 {
	 	this.$element = element;
	 },

	/**
	 * Generates a unique ID for each form element
	 */
	 generateUID : function(prefix){
	 	var S4 = function() {
    		return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
		};
	 	if(prefix)
	 	{
	 		return prefix + S4() + S4();
	 	} else {
	 		return S4() + S4();
	 	}
	 },

	/**
	 * Get form component by a specified key.
	 * Params:
	 * 	Key - key to retrieve component, specified in JSON schema.
	 */
	 getComponent : function(key, value)
	 {
	 	if(value){
	 		return this.components[key][value];
	 	} else {
	 		return this.components[key][0];
	 	}
	 },
	
	 /**
	  * Returns an array of all component objects
	  */
	 getComponentObjects : function()
	 {
	 	var returnArray = [];
	 	var componentKeys = Object.keys(this.components);
	 	for(var i = 0, l = componentKeys.length; i < l; i++)
	 	{
	 		for(var j = 0, k = this.components[componentKeys[i]].length; j < k; j++)
	 		{
	 			returnArray.push(this.components[componentKeys[i]][j]);
	 		}
	 	}

	 	return returnArray;
	 },
	 
	 /**
	  * Create a component from the specified schema.
	  */
	 createComponent : function(key, componentSchema)
	 {
	 	if(componentSchema.enabled && componentSchema.enabled.toLowerCase() != "false")
	 	{
		 	var component = new AbstractComponent(componentSchema, this.generateUID());
		 	if(this.components[key])
		 	{
		 		this.components[key].push(component);
		 	} else {
		 		this.components[key] = [component];
		 	}

			this.unRenderedComponents.push(component);
		}
	 },
	
	/**
	 * This method will only render components that have not been rendered yet.
	 */
	render : function()
	{
		if(this.$element)
		{
			for(var i = 0, l = this.unRenderedComponents.length; i < l; i++)
			{
				this.unRenderedComponents[i].render(this.$element);
			}

			this.unRenderedComponents = [];
		} else {
			throw "No element set for form.";
		}
	},
	
	/**
	 * Unlike the render method, this will render ALL components.
	 */
	renderFull : function()
	{
		if(this.$element)
		{
			var componentKeys = Object.keys(this.components);
			for(var i = 0; i < componentKeys.length; i++)
			{
				var key = componentKeys[i];
				var componentArray = this.components[key];
				for(var j = 0, k = componentArray.length; j < k; j++)
				{
					componentArray[j].render(this.$element);
				}
			}
		} else {
			throw "No element set for form.";
		}
	},

	/**
	 * Returns an object of all of the form component values. If a specifed schema is provided it is used, otherwise, the provided
	 * keys are integers based on the component's position
	 */
	getFormResult : function(schema)
	{
		var resultObject = {}
		if(schema)
		{
			resultObject = JSON.parse(JSON.stringify(schema)); //create new object from schema so we don't operate on the reference.
			var schemaKeys = Object.keys(resultObject);
			var componentList = this.getComponentObjects();
			for(var i = 0, l = schemaKeys.length; i < l; i++)
			{
				if(i == componentList.length)
				{
					break;
				} else {
					if(componentList[i].attributes && componentList[i].attributes.type &&
						componentList[i].attributes.type.toLowerCase() === "radio")
					{
						if(componentList[i].$().prop('checked') == true)
						{
							resultObject[schemaKeys[i]] = componentList[i].getValue();
						}
					} else {
						resultObject[schemaKeys[i]] = componentList[i].getValue();
					}
				}
			}
		} else {
			var componentKeys = Object.keys(this.components);
			for(var i = 0, l = componentKeys.length; i < l; i++)
			{
				var componentArray = this.components[componentKeys[i]];
				//If we have multiple components with the same key, we will return as an array. Otherwise single value.
				if(this.components[componentKeys[i]].length > 1)
				{
					resultObject[componentKeys[i]] = [];
					for(var j = 0, k = componentArray.length; j < k; j++)
					{
						if(componentArray[j].attributes && componentArray[j].attributes.type &&
							componentArray[j].attributes.type.toLowerCase() === "radio")
						{
							if(componentArray[j].$().prop('checked') == true)
							{
								resultObject[componentKeys[i]].push(componentArray[j].getValue());
							}
						} else {
							resultObject[componentKeys[i]].push(componentArray[j].getValue());
						}
					}
				} else {
					if(this.components[componentKeys[i]][0].attributes && this.components[componentKeys[i]][0].attributes.type &&
						this.components[componentKeys[i]][0].attributes.type.toLowerCase() === "radio")
					{
						if(this.components[componentKeys[i]][0].$().prop('checked') == true)
						{
							resultObject[componentKeys[i]] = this.components[componentKeys[i]][0].getValue();
						}
					} else {
						resultObject[componentKeys[i]] = this.components[componentKeys[i]][0].getValue();
					}
				}
			}
		}

		return resultObject;
	}
};

FormView = Framework.BaseView.extend({

	events : {
		'change input' : 'onInputChange',
		'change select' : 'onInputChange',
		'keyup input' : 'onInputChange',			
	},
	onInputChange : function(e){
		this.trigger('form:inputChange');	
	},
    template : TemplatePaths.common + 'templates/FormView.html',

    initialize : function(options){
        Framework.BaseView.prototype.initialize.call(this,options);
    },
    errorField : function(name, msg){
        var $input = this.$('#' + name);
        $input.focus();
        if(msg){
            $input.next().attr('data-error', msg);
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