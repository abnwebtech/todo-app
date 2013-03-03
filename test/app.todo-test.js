var should = chai.should();
// var expect = chai.expect;

describe('Application', function () {
  it('creates a global variable for the namespace', function () {
    should.exist(appTodo)
  });
  it('creates a collection', function () {
    should.exist(appTodo.TodosCollection)
  });
  it('creates an list view', function () {
    should.exist(appTodo.TodoListView)
  });
  it('creates an item model', function () {
    should.exist(appTodo.TodoItemModel)
  });
  it('creates an item view', function () {
    should.exist(appTodo.TodoItemView)
  });
});

describe('Todo Model', function () {
  describe('Init', function () {
  	beforeEach(function () {
  	  this.model = new appTodo.TodoItemModel();
  	});
    it('should default the "title" to an empty string', function(){
      this.model.get('title').should.equal('');
    });
    it('Should default the "status" to "pending"', function () {
      this.model.get('complete').should.be.false;
    });
  });
  describe('Persistence', function () {
    beforeEach(function () {
      this.model = new appTodo.TodoItemModel();
      this.save_stub = sinon.stub(this.model, 'save');
    });
    afterEach(function () {
      this.save_stub.restore();
    });
    it('should update the server when "title" is changed', function () {
      this.model.set('title', 'New Summary');
      this.save_stub.should.have.been.calledOnce;
    });
  });
});

describe('Todo List Item View', function () {
  beforeEach(function () {
    this.model = new appTodo.TodoItemModel({title: "Summary"});
    this.view = new appTodo.TodoItemView({model: this.model});
    this.save_stub = sinon.stub(this.model, 'save');
  });
  afterEach(function () {
    this.save_stub.restore();    
  });
  it('render() should return the view object', function () {
    this.view.render().should.equal(this.view);
  });
  it('render() node should be a list item', function() {
    this.view.render().el.nodeName.should.equal('LI');
  });
  describe('Template', function () {
    beforeEach(function () {
      this.view.render();
    });
    it('should contain the todo title as text', function () {
      this.view.$el.text().should.have.string('Summary')
    });
    it('should include a label for the status', function() {
      this.view.$el.find('label').should.have.length(1);
    });
    it('should include an <input> checkbox', function() {
       this.view.$el.find("label>input[type='checkbox']").should.have.length(1)
    });
    it('should be unchecked by default', function() {
       this.view.$el.find("label>input[type='checkbox']").is(':checked').should.be.false;
    });
    it('should be checked for status="complete" todos', function(){
      this.model.set('complete', true);
      this.view.render();
      this.view.$el.find("label>input[type='checkbox']").is(':checked').should.be.true;
    });
  });
  describe('Model Interaction', function () {
    it('should update model when checkbox clicked', function () {
      $('<div>').attr('id', 'fixture').appendTo('body');
      this.view.render();
      $('#fixture').append(this.view.$el);
      this.view.$el.find('input').click();
      this.model.get('complete').should.be.true;
      $('#fixture').remove();
    });
  });
});

describe('Todo List View', function () {
  beforeEach(function () {
    this.collection = new appTodo.TodosCollection([
      {title: "Todo 1"},
      {title: "Todo 2"}
    ]);
    this.view = new appTodo.TodoListView({collection: this.collection});
  });
  it('render() should return the view object', function () {
    this.view.render().should.equal(this.view);
  });
  it('render() node should be a unordered list item', function() {
    this.view.render().el.nodeName.should.equal('UL');
  });
  it('should include list items for all models in collection', function() {
    this.view.render();
    this.view.$el.find('li').should.have.length(2);
  });
});

describe("Collection's Interaction with REST API", function() {
  it("should load using the API", function() {
    this.ajax_stub = sinon.stub($, "ajax").yieldsTo("success", [
      { id: 1, title: "Mock Summary 1", complete: false },
      { id: 2, title: "Mock Summary 2", complete: true  }
    ]);
    this.todos = new appTodo.TodosCollection();
    this.todos.fetch();
    this.todos.should.have.length(2);
    this.todos.at(0).get('title').should.equal("Mock Summary 1");
    this.todos.at(1).get('title').should.equal("Mock Summary 2");
    this.ajax_stub.restore();
  })
  // it('should call addOne() in the view when fetch() collection', function(){    
  //   // var callback = sinon.spy();
  //   this.ajax_stub = sinon.stub($, "ajax");
  //   this.collection = new appTodo.TodosCollection();
  //   this.view = new appTodo.TodoListView({collection: this.collection});
  //   this.save_stub = sinon.stub(this.view, 'addOne');
  //   this.collection.add({"title": "atsrast"});
  //   // this.view.on('change', callback);
  //   console.log( this.save_stub.called )
  //   this.save_stub.should.have.been.calledOnce;
  //   // expect(callback.called).to.equal(true);
  //   // this.addOne.restore();
  //   this.ajax_stub.restore();
  // });
})