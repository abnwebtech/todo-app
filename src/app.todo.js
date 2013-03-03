var appTodo = {};

// Backbone.sync = function(method, model) {
//   alert(method + ": " + model.url);
// };


appTodo.TodoItemModel = Backbone.Model.extend({
	defaults: {
		title: '',
		complete: false
	},
	initialize: function () {
		this.on('change', function () {
			this.save();
		})
	},
	toggleStatus: function () {
		this.set('complete', !this.get('complete'));
	}
});

appTodo.TodosCollection = Backbone.Collection.extend({
	model: appTodo.TodoItemModel,
	url: 'api/todos.php'
});

appTodo.TodoItemView = Backbone.View.extend({
	tagName: 'li',
	template: _.template(
		"<label>" + 
			"<input type='checkbox' <% if (complete) { print ('checked') } %> >" + 
			"<%= title %>" + 
		"</label>"
	),
	events: {
		"click input" : "statusChanged"
	},
	render: function() {
		this.$el.html(this.template(this.model.attributes))
		return this;
	},
	statusChanged: function () {
		this.model.toggleStatus();
	}
});


appTodo.TodoListView = Backbone.View.extend({
	tagName: 'ul',
	initialize: function () {
    	this.collection.on("add", this.addOne, this);
    	this.collection.on("reset", this.addAll, this);
	},
	render: function () {
		this.addAll();
		return this;
	},
	addAll: function () {
		this.collection.each(this.addOne, this);
	},
	addOne: function (model) {
		var item = new appTodo.TodoItemView({model:model});
		this.$el.append(item.render().el);
	}
});


