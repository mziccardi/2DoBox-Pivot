const Task = require('./task')
const $ = require('jquery');

var TaskArray = {

 allTasks: [],

  pushToArray: function(newTask) {
    this.allTasks.push(newTask);
  },

  store : function (){
    localStorage.setItem('allTasks', JSON.stringify(this.allTasks));
  },
  retrieve : function (){
    return JSON.parse(localStorage.getItem("allTasks"));
  },
   renderTasksToHtml : function (task){
     $('.task-list').prepend(`
       <article id="`+ task.id +`" class="a-task">
         <h2 class="task-title" contenteditable="true">` + task.title + `</h2>
         <button class="remove-task"></button>
         <p class="task-body" contenteditable="true">` + task.body + `</p>
         <button class="upvote"></button>
         <button class="downvote"></button>
         <p class= "task-importance ` + task.importance +`"><span>Importance:</span> <span class="displayed-importance">` + task.importance + `</span> </p>
       </article>`);
   },

  populateArray: function() {
    var tasks = this.retrieve();
    for (var i = 0; i < tasks.length; i++) {
      var object = tasks[i];
      var task = new Task(object.title, object.body, object.id, object.importance);
      this.pushToArray(task);
  }
},

  renderArray : function(){
    var tasks = this.allTasks;
    if (tasks.length < 10) {
      for (var i = 0; i < tasks.length; i++) {
        this.renderTasksToHtml(tasks[i]);
      }
    }
  },

  upVote: function(task) {
      var importance = task.importance;
      var increaseImportance = {
        'None': 'Low',
        'Low': 'Normal',
        'Normal': 'High',
        'High': 'Critical',
        'Critical' : 'Critical'
      };

      task.importance = increaseImportance[importance];

      TaskArray.store();
      TaskArray.clearListContainer();
      TaskArray.renderArray();
  },

  downVote: function(task) {
      var importance = task.importance;
      var decreaseImportance = {
        'Critical': 'High',
        'High': 'Normal',
        'Normal': 'Low',
        'Low': 'None',
        'None': 'None'
      };

      task.importance = decreaseImportance[importance];

      TaskArray.store();
      TaskArray.clearListContainer();
      TaskArray.renderArray();
  },

  updateTitle: function(title) {
    var taskTitle = task.title;
      
  },

  removeTask: function(id) {
    this.allTasks = this.allTasks.filter(function(i){
      return i.id !== id;
    });
    this.store();
    this.clearListContainer();
    this.renderArray();
  },

    clearListContainer: function() {
    $('.a-task').remove();
  },

  findTaskById: function(id) {
    return this.allTasks.find(function(i){
      return i.id === id;
    });
  },

  allOtherArrays: function(task) {
    return task.id !== id;
  }
};



// empty array for 2Dos
// add new idea to array
// set array to local storage
// render ten most recent, event listener will tell funciton to show 10 more
// get local storage
// find task by ID
// clear the DOM
// search function
// show completed tasks
// sort method which filters through array, consider map or filter function
module.exports = TaskArray;
