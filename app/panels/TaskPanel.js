define(function(require, exports, module) {

  var TASKPANEL_CONT_BG_COLOR = '#e9e9e9';
  var TASKPANEL_CONT_FG_COLOR = '#ffffff';

  var TASKPANEL_HDR_BG_COLOR = '#fa5c4f';
  var TASKPANEL_HDR_FG_COLOR = '#ffffff';
  var TASKPANEL_HDR_LINE_HEIGHT = '40px';

  var TASKPANEL_TASKHDR_CONTENT_PRE = '<div> \
                                        <div style="float:left;padding-left:10px;overflow:hidden;width: 30%; \
                                          white-space: nowrap;"> \
                                            <span>Tasks(';

  var TASKPANEL_TASKHDR_CONTENT_TASKMETRICPOST =  ')</span> \
                                                </div> \
                                                <div style="float:left;text-align:center;width: 25%;overflow:hidden;"> \
                                                  <span><strong>' ;

  var TASKPANEL_TASKHDR_CONTENT_POST = '</strong></span> \
                            </div> \
                            <div style="float:right;"> \
                                <div id="taskAddButton" class="navbutton" style="float:left;"> \
                                    <span> + </span> \
                                </div>\
                                <div id="backButton" class="navbutton" style="float:right;"> \
                                   <span> < </span> \
                                </div>\
                            </div> \
                         </div>';

  var TASKPANEL_TASK_CONTENT_PRE = '<div> \
                                      <div> \
                                        <div style="float:left;padding-left:10px;width: 60%;text-align:left; \
                                        white-space: nowrap;overflow:hidden;"> \
                                          <span>' ;

  var TASKPANEL_TASK_CONTENT_DESCR_POST = '</span> \
                                        </div> \
                                        <div style="float:right;padding-right:10px;width: 30%;text-align:right; \
                                        white-space: nowrap;"> \
                                          <span>';

  var TASKPANEL_TASK_CONTENT_OWNER_POST = '</span> \
                                        </div> \
                                      </div> \
                                      <div> \
                                        <div style="float:left;padding-left:10px;width: 60%; \
                                          white-space: nowrap;font-size:0.5em;text-align:left;"> \
                                          <span>';

  var TASKPANEL_TASK_CONTENT_TIME_POST = '</span> \
                                       </div> \
                                       <div style="float:right;padding-right:10px;width: 30%; text-align:right;\
                                         white-space: nowrap;font-size:0.75em;text-align:right;"> \
                                          <span><input style="vertical-align:middle" type="checkbox" value="Done" disabled ';

  var TASKPANEL_TASK_CONTENT_STATUS_POST = '>Done</input></span> \
                                        </div> \
                                      </div> \
                                    </div>';

  //Famo.us Imports
  var Modifier = require('famous/core/Modifier');
  var Surface = require('famous/core/Surface');
  var ContainerSurface = require('famous/surfaces/ContainerSurface');
  var Transform = require("famous/core/Transform");
  var EventHandler = require("famous/core/EventHandler");
  var Transitionable = require('famous/transitions/Transitionable');
  var TransitionableTransform = require('famous/transitions/TransitionableTransform');
  var Easing = require('famous/transitions/Easing');
  var EventHandler = require("famous/core/EventHandler");

  //App Imports
  var StatCounter = require('utils/Stats');


  function TaskPanel(pWidth,pHeight){

    this.width = pWidth;
    this.height = pHeight;

    this.taskContainerSurface = null;
    this.taskHeaderSurface = null;
    this.taskSurfaces = [];

    this.taskModifiers = {};

    this.modifyEventSignal = new EventHandler();

  }

  TaskPanel.prototype = Object.create(null);
  TaskPanel.prototype.constructor = TaskPanel;

  TaskPanel.prototype.setupPanel = function setupPanel(){

    this.taskModifiers.taskModifier = new Modifier({
        transform: Transform.multiply(Transform.translate(0, 0, 0), Transform.rotateY(Math.PI/2))
    });

    this.taskModifiers.taskListModifier = new Modifier({
        transform: Transform.multiply(Transform.translate(0, 50, 0), Transform.rotateY(Math.PI/2))
    });

    this.taskContainerSurface = new ContainerSurface({
      size : [this.width - 20,270],
      align : [50,50],
      properties : {

        backgroundColor : TASKPANEL_CONT_BG_COLOR,
        color : TASKPANEL_CONT_FG_COLOR,
        overflowY: 'auto',
        overflowX: 'hidden',

      }
    });

    this.taskHeaderSurface = new Surface(
      {
        size : [this.width - 20,40],
        //content: taskHeaderContentPre + loginUser + taskHeaderContentPost,
        properties : {

          backgroundColor : TASKPANEL_HDR_BG_COLOR,
          color : TASKPANEL_HDR_FG_COLOR,
          lineHeight : TASKPANEL_HDR_LINE_HEIGHT

        }

      }
    );

  }

  TaskPanel.prototype.addTo = function addTo(ctx){

    ctx.add(this.taskModifiers.taskModifier).add(this.taskHeaderSurface);
    ctx.add(this.taskModifiers.taskListModifier).add(this.taskContainerSurface);

  }

  TaskPanel.prototype.getHeaderModifier = function getHeaderModifier(){

    return this.taskModifiers.taskModifier

  }

  TaskPanel.prototype.addTask = function addTask(taskObj) {

      var that = this;

      var pos = this.taskSurfaces.length;

      var tempTrans = new TransitionableTransform();
      var sizeTrans = new Transitionable([5, 5]);
      var opacTrans = new Transitionable(0);

      var tempMod = new Modifier(
        {
          size : sizeTrans,
          transform : tempTrans,
          opacity : opacTrans
        }
      )

      tempTrans.setTranslate([140, 20, 0]);

      var tempSurf = new Surface({
         //size: [width - 20, 40],
         content : _frameTaskContent(taskObj),
         properties: {
             backgroundColor: "lightgray",
             lineHeight: "20px",
             textAlign: "center",
             overflow : "hidden",
             border :   "1px solid lightgray",
             borderRadius : '5px'
         }
      });

      this.taskSurfaces.unshift([tempMod,tempSurf,tempTrans]);

      for(var i = 1 ; i < this.taskSurfaces.length ; i++){
        this.taskSurfaces[i][2].setTranslate([10, (50 * i) + 10], { duration: 500 });
      }

      this.taskContainerSurface.add(tempMod).add(tempSurf);

      sizeTrans.set([this.width - 40 , 40],{duration : 500});
      tempTrans.setTranslate([10,10,0],{duration : 500});
      opacTrans.set(1,{duration : 1000 , curve : Easing.outQuart},function(){
        that.taskSurfaces[0][1].setProperties({border :   "1px solid #FA5C4F"})
      });

      tempSurf.taskData = taskObj;

      tempSurf.setAttributes({"id" : taskObj.taskid});

      var that = this;

      tempSurf.on('click', function() {

        StatCounter.setCurrTaskModifyId(this.taskData.taskid);
        StatCounter.setCurrTaskModifyStatus(this.taskData.status);
        that.modifyEventSignal.emit("modify",this.taskData);

      });


  }

  TaskPanel.prototype.modifyTask = function modifyTask(taskObj) {

    for(var cnt = 0 ; cnt < this.taskSurfaces.length ; cnt++){

      if(this.taskSurfaces[cnt][1].taskData.taskid == taskObj.taskid){

        this.taskSurfaces[cnt][1].taskData = taskObj;
        this.taskSurfaces[cnt][1].setContent(_frameTaskContent(taskObj));

        break;

      }

    }

  }

  TaskPanel.prototype.updateContent = function updateContent() {

    this.taskHeaderSurface.setContent(_frameTaskHeader());

  }

  TaskPanel.prototype.getModifyEvent = function getModifyEvent(evObj) {

    return this.modifyEventSignal;

  }


  function _frameTaskHeader(){

    var taskHeaderContent = TASKPANEL_TASKHDR_CONTENT_PRE;

    taskHeaderContent+=StatCounter.getCompletedTasks();
    taskHeaderContent+='/';
    taskHeaderContent+=StatCounter.getTotalTasks();

    taskHeaderContent+=TASKPANEL_TASKHDR_CONTENT_TASKMETRICPOST;

    taskHeaderContent+=StatCounter.getUsername();

    taskHeaderContent+=TASKPANEL_TASKHDR_CONTENT_POST;

    return taskHeaderContent;

  }

  function _frameTaskContent(taskObj){

    var taskContent = TASKPANEL_TASK_CONTENT_PRE;

    taskContent+= taskObj.descr;

    taskContent+= TASKPANEL_TASK_CONTENT_DESCR_POST;

    taskContent+= taskObj.owner;

    taskContent+= TASKPANEL_TASK_CONTENT_OWNER_POST;

    taskContent+= taskObj.date;

    taskContent+= TASKPANEL_TASK_CONTENT_TIME_POST;

    if(taskObj.status){
      taskContent+= 'checked';
    }

    taskContent+= TASKPANEL_TASK_CONTENT_STATUS_POST;

    return taskContent;

  }

  module.exports = TaskPanel;

});
