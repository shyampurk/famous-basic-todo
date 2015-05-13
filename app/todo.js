define(function(require, exports, module) {

    //Dimentions
    var width = 300;
    var height = 400;
    var depth = 50;


    var headerHeight = height / 8;


    var taskLocalSeq  = 1;
    var taskContainer = [];
    var currTaskModId = null;
    var currTaskModStatus = null;

    /****FAMO.US OBJECTS****/
    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require("famous/core/Transform");

    /**ToDo App Objects**/
    var HeaderPanel = require('panels/HeaderPanel');
    var PagePanel = require('panels/PagePanel');
    var FloatingPanel = require('panels/FloatingPanel');

    var StatCounter = require('utils/Stats');

    function Todo(){

      this.pubnub = PUBNUB.init({
         publish_key   : 'demo',
         subscribe_key : 'demo'
      })

      this.context = Engine.createContext(document.getElementById('AppFrame'));
      this.context.setPerspective(1000);
      this.page = new PagePanel(width - 20,(height - height / 8) - 30);

      this.contentView = new View();
      this.contentModifier = new Modifier({
        transform: Transform.translate(10, (height / 8) + 20, 0)
      });


      this.header = new HeaderPanel(width,headerHeight);
      this.page = new PagePanel(width,height);
      this.float = new FloatingPanel(width,height,headerHeight);

    }

    Todo.prototype = Object.create(null);
    Todo.prototype.constructor = Todo;

    Todo.prototype.init = function init(){

      //Call setupPanel() for all Famo.us containers
      this.header.setupPanel(headerHeight);
      this.page.setupPanel();
      this.float.setupPanel();

      //Add all panel to the container view
      this.header.addTo(this.context);
      this.page.addTo(this.contentView);
      this.float.addTo(this.contentView);

      //Add contanier view to the Famo.us context
      this.context.add(this.contentModifier).add(this.contentView);

      //Initialize all DOM events
      _initEvents(this);

    }


    function _initEvents(appObj){

      //PubNub Event Handling
      appObj.pubnub.subscribe({

         channel : "famo.us-app",

         message : function(message){

           if(message['req'] == 'add') {



             taskContainer.push(message['body']);

             appObj.page.addTask(message['body']);


             if(message['body']['status']) {
               StatCounter.setCompletedTasks(StatCounter.getCompletedTasks() + 1);
             }

             StatCounter.setTotalTasks(taskContainer.length);

             StatCounter.setLastUpdate(message['body']['date']);

             appObj.page.updateTaskHeader();
             appObj.page.updateIntroContent();


           } else if(message['req'] == 'modify') {

              if(message['body']['status'] == 1) {
                 StatCounter.setCompletedTasks(StatCounter.getCompletedTasks() + 1);
                 message['body']['status'] = true;
              }

              if(message['body']['status'] == 2) {
                 StatCounter.setCompletedTasks(StatCounter.getCompletedTasks() - 1);
                 message['body']['status'] = false;
              }


              StatCounter.setLastUpdate(message['body']['date']);

              appObj.page.updateTaskHeader();
              appObj.page.updateIntroContent();
              appObj.page.modifyTask(message['body']);

           }

         }

       });

      //Famo.us widget event handling
      appObj.float.connectModifyEvent(appObj.page.getModifyEvent());

      //JQuery Event Handling
      $('body').on("click",'#loginButton',function(){

        console.log("Login Button Clicked");

          if('Select Name' == $('select').val()){
            $('label').pulse({opacity: 0.5}, {duration : 200, pulses : 3});
          } else {
            loginUser = $('select').val();
            StatCounter.setUsername(loginUser);

            appObj.page.switchoffLoginPanel();
            appObj.page.updateTaskHeader();
          }

      });

      $('body').on("click",'#taskButton',function(){
        appObj.page.displayTaskPanel();
      });


      $('body').on("click",'#taskAddButton',function(){

        appObj.float.displayAddTaskPanel()

      });

      $('body').on("click",'#backButton',function(){
        appObj.page.displayFrontPanel();
      });

      $('body').on("click",'#taskBackButton',function(){
        appObj.float.hidePanel()
      });

      $('body').on("click",'#taskAdd',function(){

        var taskDescr = $('#taskDescription').val();
        var taskOwner = $('#taskAddOwner').val()

        if((0 != taskDescr.length) && ("Select Name" != taskOwner)){

          var taskDate = new Date().toUTCString();
          taskDate = taskDate.substr(0 , taskDate.length - 4);

          var taskStatus = $('#taskAddCheck').prop( "checked" );

          var taskObj = {
            "taskid" : loginUser + '-' + taskLocalSeq,
            "descr"  : taskDescr,
            "owner"  : taskOwner,
            "date"   : taskDate,
            "status" : taskStatus
          }


          $('#taskDescription').val('');
          $('#taskAddCheck').prop( "checked" , false );
          $('#taskAddOwner').val("Select Name");
          taskLocalSeq++;


          appObj.pubnub.publish({
             channel : "famo.us-app",
             message : {"req" : "add" , "body" : taskObj },
           });

           appObj.float.hidePanel();

        } else {

          if($('#taskAddOwner').val() == "Select Name"){

            $('#taskAddOwner').pulse({opacity: 0.5}, {duration : 200, pulses : 3});

          }

        }


      });

      $('body').on("click",'#taskMod',function(){

        var taskDescr = $('#taskModDescription').val();
        var taskOwner = $('#taskModOwner').val()



        if((0 != taskDescr.length) && ("Select Name" != taskOwner)){

          var taskDate = new Date().toUTCString();
          taskDate = taskDate.substr(0 , taskDate.length - 4);

          var taskStatus = $('#taskModCheck').prop( "checked" );

          var taskObj = null;

          for(var cnt = 0;cnt < taskContainer.length;cnt++){

            if(taskContainer[cnt].taskid == StatCounter.getCurrTaskModifyId()){
              taskObj = taskContainer[cnt];
              break;
            }

          }

          taskObj.descr   = $('#taskModDescription').val();
          taskObj.owner   = $('#taskModOwner').val();
          taskObj.date    = taskDate;
          taskObj.status  = $('#taskModCheck').prop("checked");

          var modPublishStatus = 0; //No Change

          if((StatCounter.getCurrTaskModifyStatus() != taskObj.status) && (true == taskObj.status) ) {
            modPublishStatus = 1; //Increment Completed tasks
          }
          if((StatCounter.getCurrTaskModifyStatus() != taskObj.status) && (false == taskObj.status) ) {
            modPublishStatus = 2; //Decrement Completed tasks
          }

          //Update status with the special meaning for publishing modify data
          taskObj.status = modPublishStatus;


          appObj.pubnub.publish({
             channel : "famo.us-app",
             message : {"req" : "modify" , "body" : taskObj },
           });

           appObj.float.clearModifyPanel();
           appObj.float.hidePanel();
           StatCounter.clearCurrTaskModifyId();

        } else {

          if($('#taskModOwner').val() == "Select Name"){

            $('#taskModOwner').pulse({opacity: 0.5}, {duration : 200, pulses : 3});

          }

        }

      });

      $('body').on("click",'#taskModBackButton',function(){

        appObj.float.clearModifyPanel();
        appObj.float.hidePanel();

      });

    }

    module.exports = Todo;

});
