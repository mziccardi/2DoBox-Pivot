var TaskArray = require('./tasksArray');
var Task = require('./task');


var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $saveButton = $('.save');
var $taskList = $('.task-list');
var $searchField = $('.search-field');
// completed tasks button


$(document).ready(function(){
  TaskArray.populateArray();
  TaskArray.renderUncompletedTasks(10, 0);

  if(TaskArray.allTasks.length < 1) {
    $('.show-completed-button').hide();
    $('.hide-completed-button').hide();
    $('.dropbtn').hide();
    $('.dropbtn-hide').hide();
  }
});


$($saveButton).on('click', function() {
  var task = new Task(getTitle(), getBody());
  TaskArray.pushToArray(task);
  TaskArray.store();
  TaskArray.renderTasksToHtml(task);

  if(TaskArray.allTasks.length > 0) {
    $('.show-completed-button').show();
    $('.hide-completed-button').show();
    $('.dropbtn').show();
    $('.dropbtn-hide').show();
  }

  if(TaskArray.allTasks.length > 10) {
    hideLastTask();
    $('.show-more-button').addClass('show');
  }
  TaskArray.clearInputs();
  TaskArray.toggleButton();
});

$($taskList).on('click', '.remove-task', function(e){
  var id = parseInt($(this).parent().attr('id'));
  TaskArray.findTaskById(id);
  TaskArray.removeTask(id);

  var theTask = $(this).parent().remove();

  if (TaskArray.allTasks.length > 10) {
    $('.show-more-button').addClass('show');
  } else {
    $('.show-more-button').removeClass('show');
  }
});

$($taskList).on('click', '.upvote', function(e){
  var id = parseInt($(this).parent().attr('id'));
  var task = TaskArray.findTaskById(id);
  TaskArray.upVote(task);
  var taskArticle = $('#' + id);
  var taskImportance = taskArticle.find('.displayed-importance');
  taskImportance[0].textContent = task.importance;
});

$($taskList).on('click', '.downvote', function(e){
  var id = parseInt($(this).parent().attr('id'));
  var task = TaskArray.findTaskById(id);
  TaskArray.downVote(task);
  var taskArticle = $('#' + id);
  var taskImportance = taskArticle.find('.displayed-importance');
  taskImportance[0].textContent = task.importance;
});

$($taskList).on('keyup', '.task-title', function(){
  var self = this;
  var id = parseInt($(this).parent().attr('id'));
  var task = TaskArray.findTaskById(id);
  TaskArray.updateTitle(task, self);
});

$($taskList).on('keyup', '.task-body', function(){
  var self = this;
  var id = parseInt($(this).parent().attr('id'));
  var task = TaskArray.findTaskById(id);
  TaskArray.updateBody(task, self);
});

$($taskList).on('click', '.completed-button', function(){
  var id = parseInt($(this).parent().attr('id'));
  var task = TaskArray.findTaskById(id);
  TaskArray.markCompleted(task);
});

$($searchField).on('keyup', function(){
  var searchInput = $searchField.val();
  TaskArray.search(searchInput);
});

$(".body-input, .title-input").on('keyup', function(){
  TaskArray.toggleButton();
  TaskArray.inputCounter();
  TaskArray.bodyCounter();
});
$('.title-input').on('keyup', function(){
  TaskArray.inputCounter();
});
$('.body-input').on('keyup', function(){
  TaskArray.bodyCounter();
});

$('.show-completed-button').on('click', function(){
  if(TaskArray.allTasks.length > 0) {
    $(this).fadeOut('fast');
    $('.hide-completed-button').fadeIn('fast');
    TaskArray.clearListContainer();
    TaskArray.sortTasksByCompleted();
    TaskArray.renderUncompletedTasks(10, 0);
    TaskArray.renderCompletedTasks();
  }
});

$('.hide-completed-button').on('click', function(){
  $(this).fadeOut('fast');
  $('.show-completed-button').fadeIn('fast');
  TaskArray.clearListContainer();
  TaskArray.sortTasksByCompleted();
  TaskArray.renderUncompletedTasks(10, 0);
});

$($taskList).on('click', '.completed-button', function(){
  $(this).parent().toggleClass('true');
});

$('.dropbtn').on('click', function(){
  $(this).fadeOut('fast');
  $('.dropbtn-hide').fadeIn('fast');
  showSortOptions();
});

$('.dropbtn-hide').on('click', function(){
  $(this).fadeOut('fast');
  $('.dropbtn').fadeIn('fast');
  showSortOptions();
  TaskArray.filterAll();
});

$('.show-more-button').on('click', function(){
  TaskArray.renderUncompletedTasksAppend(TaskArray.allTasks.length, 10);
  if($('.task-list > article').length === TaskArray.allTasks.length) {
    $('.show-more-button').hide();
  }
});

$(".body-input, .title-input").on('keyup', function(){
  TaskArray.toggleButton();
  TaskArray.tooMuchText();
});

/*filters based on importance level*/
$('.none-button, .low-button, .normal-button, .high-button, .critical-button').on('click', function(){
  var specificButton = $(this).text();
  TaskArray.filterByImportance(specificButton);
});

/*Sort function called on click to show options*/
function showSortOptions() {
  $('#myDropdown').toggleClass('show');
}

/*hides oldest task to keep 10 on page*/
function hideLastTask() {
  $('article:last-child').hide();
}


function getTitle() {
  var taskTitle = $titleInput.val();
  return taskTitle;
}

function getBody() {
  var taskBody = $bodyInput.val();
  return taskBody;
}
