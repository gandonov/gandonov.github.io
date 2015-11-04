var Framework = {};

Framework.BaseView = function() {};
Framework.BaseView.prototype.getJSON = function(url, success, error, options) {};
Framework.BaseView.prototype.getParameter = function(parameter) {};
Framework.BaseView.prototype.setParameter = function(parameter, value) {};
Framework.BaseView.prototype.destroy = function() {};
Framework.BaseView.prototype.renderView = function(callback, data) {};
Framework.BaseView.prototype.instantiateView = function(variableName, Constructor, options) {};
Framework.BaseView.prototype.instantiate = function(Constructor, options) {};
Framework.BaseView.prototype.getParent = function(){};
Framework.BaseView.prototype.getChildren = function(){};
Framework.BaseView.prototype.preloadDataAsync = function(callback, error) {};

Framework.AbstractConstraintModel = function() {};
Framework.AbstractConstraintModel.prototype.intersection = function(other) {};
Framework.AbstractConstraintModel.prototype.setField = function(name, value) {};
Framework.AbstractConstraintModel.prototype.getField = function(name) {};
Framework.AbstractConstraintModel.prototype.getUrl = function() {};
Framework.AbstractConstraintModel.prototype.getPageNumber = function() {};
Framework.AbstractConstraintModel.prototype.getPageSize = function() {};

Framework.PostConstraintModel = function() {};
Framework.PostConstraintModel.prototype.getBody = function(){};

Framework.AbstractConstraintPanel = function() {};
Framework.AbstractConstraintPanel.prototype.getConstraintModel =  function() {};
Framework.AbstractConstraintPanel.prototype.getSource =  function() {};
Framework.AbstractConstraintPanel.prototype.onConstraintChange =  function() {};

Framework.AbstractViewer = function() {};
Framework.Viewer = function() {};
Framework.Viewer.prototype.preloadDataAsync = function(callback, error) {};

Framework.RestSource = function() {};
Framework.RestSource.prototype.getConstraintModel = function(){};
Framework.RestSource.prototype.ConstraintModelPrototype = Framework.AbstractConstraintModel;
Framework.RestSource.prototype.get = function(callback, errorcallback){};
Framework.RestSource.prototype.setCount = function(count){};
Framework.RestSource.prototype.getCount = function(){};
Framework.RestSource.prototype.parseAsync = function(data,callback){};

Framework.PaginationPanel = function(){};
Framework.ScrollPaginationPanel = function(){};

Framework.TabView = function(){};
Framework.TabView.prototype.setTabByIndex = function(index){};
Framework.TabView.prototype.setTabById = function(id){};