define(function(require, exports, module) {

  var Stats = {};

  var lastUpdate = '__';
  var totalTasks = 0;
  var completedTasks = 0;
  var username = '';
  var currTaskModifyId = null;
  var currTaskModifyStatus = false;

  Stats.getLastUpdate = function getLastUpdate(){
    return lastUpdate;
  }

  Stats.setLastUpdate = function setLastUpdate(updateTime){
    lastUpdate = updateTime;
  }

  Stats.getTotalTasks = function getTotalTasks(){
    return totalTasks;
  }

  Stats.setTotalTasks = function setTotalTasks(countTotal){
    totalTasks = countTotal;
  }

  Stats.getCompletedTasks = function getCompletedTasks(){
    return completedTasks;
  }

  Stats.setCompletedTasks = function setCompletedTasks(countCompleted){
    completedTasks = countCompleted;
  }

  Stats.getUsername = function getUsername(){
    return username;
  }

  Stats.setUsername = function setUsername(name){
    username = name;
  }

  Stats.getCurrTaskModifyId = function getCurrTaskModifyId(){
    return currTaskModifyId;
  }

  Stats.setCurrTaskModifyId = function setCurrTaskModifyId(thisId){
    currTaskModifyId = thisId;
  }

  Stats.clearCurrTaskModifyId = function clearCurrTaskModifyId(){
    currTaskModifyId = null;
  }

  Stats.getCurrTaskModifyStatus = function getCurrTaskModifyStatus(){
    return currTaskModifyStatus;
  }

  Stats.setCurrTaskModifyStatus = function setCurrTaskModifyStatus(thisStatus){
    currTaskModifyStatus = thisStatus;
  }



  module.exports = Stats;

});
