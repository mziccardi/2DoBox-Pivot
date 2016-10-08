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

   renderTasksToHtml: function (task){
     $('.task-list').prepend(`
       <article id="`+ task.id +`" class="a-task ` + task.completed + `">
         <h2 class="task-title" contenteditable="true">` + task.title + `</h2>
         <button class="remove-task" aria-label='Remove task' value="remove-button"></button>
         <h5 class="task-body" contenteditable="true">` + task.body + `</h5>
         <button class="upvote" aria-label='Increase task importance' value="upvote-button" alt="Button with arrow pointing upwards to tell user to increase importance"></button>
         <button class="downvote" aria-label='Decrease task importance' value="downvote-button"></button>
         <h6 class= "task-importance ` + task.importance +`" tabindex="0"><span>Importance:</span> <span class="displayed-importance" tabindex="0">` + task.importance + `</span> </h6>
         <button class="completed-button" aria-label='Mark task completed' value="completed-button">Task Completed</button>
       </article>`);
   },

   renderTasksToHtmlAppend: function (task){
     $('.task-list').append(`
       <article id="`+ task.id +`" class="a-task ` + task.completed + `">
         <h2 class="task-title" contenteditable="true">` + task.title + `</h2>
         <button class="remove-task" aria-label='Remove task' value="remove-button"></button>
         <h5 class="task-body" contenteditable="true">` + task.body + `</h5>
         <button class="upvote" aria-label='Increase task importance' value="upvote-button" alt="Button with arrow pointing upwards to tell user to increase importance"></button>
         <button class="downvote" aria-label='Decrease task importance' value="downvote-button"></button>
         <h6 class= "task-importance ` + task.importance +`" tabindex="0"><span>Importance:</span> <span class="displayed-importance" tabindex="0">` + task.importance + `</span> </h6>
         <button class="completed-button" aria-label='Mark task completed' value="completed-button">Task Completed</button>
       </article>`);
   },

  populateArray: function() {
    var tasks = this.retrieve();
    if(tasks) {
      for (var i = 0; i < tasks.length; i++) {
        var object = tasks[i];
        var task = new Task(object.title, object.body, object.id, object.importance, object.completed);
        this.pushToArray(task);
      }
    }
},

  renderCompletedTasks: function(){
    var tasks = this.allTasks;
    var completedTasks = tasks.filter(function(i) {
        return i.completed === true;
    });
        completedTasks.forEach(this.renderTasksToHtml);
  },


  renderUncompletedTasks: function(start, end){
    var tasks = this.sliceArray(start, end);
    var uncompletedTasks = tasks.filter(function(i) {
        return i.completed === false;
    });
        uncompletedTasks.forEach(this.renderTasksToHtml);
        if (tasks.length >= 10) {
          $('.show-more-button').addClass('show');
        }
  },

  renderUncompletedTasksAppend: function(start, end){
    var tasks = this.sliceArray(start, end);
    var uncompletedTasks = tasks.reverse().filter(function(i) {
        return i.completed === false;
    });
        uncompletedTasks.forEach(this.renderTasksToHtmlAppend);
        if (tasks.length >= 10) {
          $('.show-more-button').addClass('show');
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
  },

  updateTitle: function(task, self) {
    var taskTitle = task.title;
    task.title = $(self).text();
    TaskArray.store();
  },

  updateBody: function(task, self) {
    var taskBody = task.body;
    task.body = $(self).text();
    TaskArray.store();
  },

  removeTask: function(id) {
    this.allTasks = this.allTasks.filter(function(i){
      return i.id !== id;
    });
    this.store();
  },

  markCompleted: function(task) {
    var currentState = task.completed;
    var changeImportance = {
      true : false,
      false : true
    };

    task.completed = changeImportance[currentState];
    this.store();
  },

  sortTasksByCompleted: function() {
    var sortedArray = this.allTasks.sort(function(a, b) {
      var truthy = a.completed;
      var falsey = b.completed;
      if (truthy > falsey) {
        return 1;
      }
      if (truthy < falsey) {
        return -1;
      }
        return 0;
    });
    return sortedArray;
  },

  sliceArray: function(start, end) {
    if(this.allTasks) {
      return this.allTasks.slice(this.allTasks.length - start, this.allTasks.length - end);
    }
  },

  clearListContainer: function() {
    $('.a-task').remove();
  },

  clearUncompleteList: function() {
    $('.false').remove();
  },

  findTaskById: function(id) {
    return this.allTasks.find(function(i){
      return i.id === id;
    });
  },

  allOtherArrays: function(task) {
    return task.id !== id;
  },

  search: function(searchInput) {
    if (searchInput !== "") {
      $('.task-list').find('article:not(:contains('+ searchInput + '))').slideUp();
      $('.task-list').find('article:contains(' + searchInput + ')').slideDown();
    } else {
      $('.task-list').find('article').slideDown();
    }
  },

  filterByImportance: function(specificButton) {
    $('.task-list').find('article:not(:contains('+ specificButton + '))').slideUp();
    $('.task-list').find('article:contains(' + specificButton + ')').slideDown();
  },

  filterAll: function() {
    $('.task-list').find('article').slideDown();
  },

  clearInputs: function() {
    $('.title-input').val('');
    $('.body-input').val('');
  },

  toggleButton: function() {
    if ($(".title-input").val().length > 0  && $(".body-input").val().length > 0) {
      $('.save').attr("disabled", false);
    } else {
      $('.save').attr('disabled', true);
    }
  },

  inputCounter : function(){
    var len = $('.title-input').val().length;
      $('.input-counter').html(len);
  },

  bodyCounter : function(){
    var len =$('.body-input').val().length;
    $('.body-counter').html(len);
  },
};


module.exports = TaskArray;
