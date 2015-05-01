define(function(require, exports, module) {

  //MainPanel Constants
  var FLOATINGPANEL_CONT_BG_COLOR = '#e9e9e9';
  var FLOATINGPANEL_CONT_FG_COLOR = '#ffffff';
  var FLOATINGPANEL_CONT_Z_STACK  = 20;

  var FLOATINGPANEL_ADD_BG_COLOR = '#fa5c4f';
  var FLOATINGPANEL_ADD_FG_COLOR = '#ffffff';
  var FLOATINGPANEL_ADD_HDR_LINEHGT = '40px';
  var FLOATINGPANEL_ADD_BODY_LINEHGT = '10px';

  var FLOATINGPANEL_MOD_BG_COLOR = '#fa5c4f';
  var FLOATINGPANEL_MOD_FG_COLOR = '#ffffff';
  var FLOATINGPANEL_MOD_HDR_LINEHGT = '40px';
  var FLOATINGPANEL_MOD_BODY_LINEHGT = '10px';

  var FLOATINGPANEL_TASK_ADD_HEADER_CONTENT = '<div> \
              <div style="float:left;padding-left:10px;overflow:hidden;width: 30%; \
                  white-space: nowrap;"> \
                    <span>New Task</span> \
              </div> \
              <div style="float:right;"> \
                <div id="taskBackButton" class="navbutton" style="float:right;"> \
                  <span> < </span> \
                </div>\
              </div> \
           </div>';

  var FLOATINGPANEL_TASK_ADD_BODY_CONTENT = '<div> \
                                       <div>  \
                                         <div style="float:left;padding:5px;width: 60%; \
               white-space: nowrap;text-align:left;"> \
                                           <span>Description</span> \
                                         </div> \
                                         <div style="float:right;padding:5px;width: 30%; text-align:center;\
               white-space: nowrap;"> \
                                           <span><input id="taskAddCheck" style="vertical-align:middle" type="checkbox" value="Done">Done</input></span> \
                                         </div> \
                                       </div> \
                                       <div style="padding:5px"> \
                                         <textarea id="taskDescription" rows="5" style="width:90%"></textarea> \
                                       </div>\
                                       <div> \
                                         <div style="float:left;padding-left:10px;width: 60%; \
               white-space: nowrap;text-align:left;"> \
                                           <span>Owner</span> \
                                           <label> \
                                             <select id="taskAddOwner"> \
                                               <option selected> Select Name </option> \
                                               <option>Peter</option> \
                                               <option>Eric</option> \
                                               <option>Sam</option> \
                                             </select> \
                                           </label> \
                                         </div> \
                                         <div style="float:right;padding-right:10px;width: 30%; text-align:right;\
               white-space: nowrap;"> \
                                           <span><input id="taskAdd" type="button" value="ADD"></input></span> \
                                         </div> \
                                       </div> \
                                     </div>';

    var FLOATINGPANEL_TASK_MODIFY_HEADER_CONTENT = '<div> \
                                                       <div style="float:left;padding-left:10px;overflow:hidden;width: 30%; \
                                                           white-space: nowrap;"> \
                                                         <span>Modify Task</span> \
                                                       </div> \
                                                       <div style="float:right;"> \
                                                         <div id="taskModBackButton" class="navbutton" style="float:right;"> \
                                                           <span> < </span> \
                                                         </div>\
                                                       </div> \
                                                    </div>';

    var FLOATINGPANEL_TASK_MODIFY_BODY_CONTENT = '<div> \
                                                    <div>  \
                                                       <div style="float:left;padding:5px;width: 60%; \
                                                                white-space: nowrap;text-align:left;"> \
                                                          <span>Description</span> \
                                                       </div> \
                                                       <div style="float:right;padding:5px;width: 30%; text-align:center;\
                                                                white-space: nowrap;"> \
                                                          <span><input id="taskModCheck" style="vertical-align:middle" type="checkbox" value="Done">Done</input></span> \
                                                       </div> \
                                                    </div> \
                                                    <div style="padding:5px"> \
                                                      <textarea id="taskModDescription" rows="5" style="width:90%"></textarea> \
                                                    </div>\
                                                    <div> \
                                                      <div style="float:left;padding-left:10px;width: 60%; \
                                                                white-space: nowrap;text-align:left;"> \
                                                          <span>Owner</span> \
                                                          <label> \
                                                            <select id="taskModOwner"> \
                                                              <option selected> Select Name </option> \
                                                              <option>Peter</option> \
                                                              <option>Eric</option> \
                                                              <option>Sam</option> \
                                                            </select> \
                                                          </label> \
                                                        </div> \
                                                        <div style="float:right;padding-right:10px;width: 30%; text-align:right;\
                                                                  white-space: nowrap;"> \
                                                            <span><input id="taskMod" type="button" value="Modify"></input></span> \
                                                        </div> \
                                                      </div> \
                                                    </div>';

  //Famo.us Imports
  var Modifier = require('famous/core/Modifier');
  var Surface = require('famous/core/Surface');
  var ContainerSurface = require('famous/surfaces/ContainerSurface');
  var Transform = require("famous/core/Transform");
  var TransitionableTransform = require('famous/transitions/TransitionableTransform');
  var Easing = require('famous/transitions/Easing');
  var EventHandler = require("famous/core/EventHandler");

  //App Imports
  var StatCounter = require('utils/Stats');

  function FloatingPanel(pWidth,pHeight,pHeaderHeight){

    this.width = pWidth;
    this.height = pHeight;
    this.headerHeight = pHeaderHeight;

    this.addContainer = null;
    this.addModifiers = {};
    this.addScreens = {};
    this.addTrans = {};

    this.modifyContainer = null;
    this.modifyModifiers = {};
    this.modifyScreens = {};
    this.modifyTrans = {};

    this.currentTrans = null;

    this.modifyEvent = null


  }

  FloatingPanel.prototype = Object.create(null);
  FloatingPanel.prototype.constructor = FloatingPanel;

  FloatingPanel.prototype.setupPanel = function setupPanel(){

    _setupAddPanel.call(this, this.headerHeight);

    _setupModifyPanel.call(this, this.headerHeight);

  }

  FloatingPanel.prototype.addTo = function addTo(ctx){

    ctx.add(this.addModifiers.taskAddSurfaceModifier).add(this.addContainer);

    ctx.add(this.modifyModifiers.taskModSurfaceModifier).add(this.modifyContainer);

  }

  FloatingPanel.prototype.displayAddTaskPanel = function displayAddTaskPanel(){

    if(!this.currentTrans){

      this.addTrans.taskAddSurfaceTrans.setTranslate([0, 0, 0] , {duration : 250, curve : Easing.outCubic});

      this.currentTrans = this.addTrans.taskAddSurfaceTrans;

    }

  }

  FloatingPanel.prototype.displayModifyTaskPanel = function displayModifyTaskPanel(){

    if(!this.currentTrans){

      this.modifyTrans.taskModSurfaceTrans.setTranslate([0, 0, 0] , {duration : 250, curve : Easing.outCubic});

      this.currentTrans = this.modifyTrans.taskModSurfaceTrans;
    }

  }

  FloatingPanel.prototype.hidePanel = function hidePanel(){

    if(this.currentTrans) {

      this.currentTrans.setTranslate([-this.width, 0, 0] , {duration : 250, curve : Easing.outCubic});

      this.currentTrans = null;

    }

  }

  FloatingPanel.prototype.populateModifyPanel = function populateModifyPanel(taskObj){

    $('#taskModDescription').val(taskObj.descr);
    $('#taskModOwner').val(taskObj.owner);
    $('#taskModCheck').prop("checked",taskObj.status);


    if(StatCounter.getUsername() != taskObj.owner){

      $('#taskModDescription').prop('disabled',true);
      $('#taskModOwner').prop('disabled',true);
      $('#taskModCheck').prop('disabled',true);
      $('#taskMod').prop('disabled',true);

    }

  }

  FloatingPanel.prototype.clearModifyPanel = function clearModifyPanel(){

    $('#taskModDescription').val('');
    $('#taskModOwner').val('');
    $('#taskModCheck').prop("checked",false);


    $('#taskModDescription').prop('disabled',false);
    $('#taskModOwner').prop('disabled',false);
    $('#taskModCheck').prop('disabled',false);
    $('#taskMod').prop('disabled',false);

  }

  
  FloatingPanel.prototype.connectModifyEvent = function connectModifyEvent(evObj){


    var that = this;


    EventHandler.setOutputHandler(this.modifyContainer,evObj);

    this.modifyContainer.on("modify",function(data){

      that.populateModifyPanel(data);

      that.displayModifyTaskPanel();

    });


  }


  function _setupAddPanel(pHeaderHeight){

    this.addContainer = new ContainerSurface({
      size : [this.width - 20,this.height - this.headerHeight - 30],
      //size : [this.width, this.height],
      properties : {

        backgroundColor : FLOATINGPANEL_CONT_BG_COLOR,
        color : FLOATINGPANEL_CONT_FG_COLOR,
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex : FLOATINGPANEL_CONT_Z_STACK
      }
    });

    this.addScreens.taskAddHeader = new Surface(
      {
        size : [this.width - 20,40],
        content: FLOATINGPANEL_TASK_ADD_HEADER_CONTENT,
        properties : {

          backgroundColor : FLOATINGPANEL_ADD_BG_COLOR,
          color : FLOATINGPANEL_ADD_FG_COLOR,
          lineHeight : FLOATINGPANEL_ADD_HDR_LINEHGT

        }

    });

    this.addScreens.taskAddBody = new Surface(
      {
        size : [this.width - 20,this.height - this.headerHeight - 80],
        content: FLOATINGPANEL_TASK_ADD_BODY_CONTENT,
        properties : {

          backgroundColor : FLOATINGPANEL_ADD_BG_COLOR,
          color : FLOATINGPANEL_ADD_FG_COLOR,
          lineHeight : FLOATINGPANEL_ADD_BODY_LINEHGT

        }
    });

    this.addModifiers.taskAddModifier = new Modifier({
      transform: Transform.translate(0, 50, 0)
    });

    this.addTrans.taskAddSurfaceTrans = new TransitionableTransform();

    this.addTrans.taskAddSurfaceTrans.setTranslate([-this.width, 0, 0]);

    this.addModifiers.taskAddSurfaceModifier = new Modifier({
      transform : this.addTrans.taskAddSurfaceTrans
    });


    this.addContainer.add(this.addScreens.taskAddHeader);
    this.addContainer.add(this.addModifiers.taskAddModifier).add(this.addScreens.taskAddBody);


  }


  function _setupModifyPanel(pHeaderHeight){

    this.modifyContainer = new ContainerSurface({
      size : [this.width - 20,this.height - this.headerHeight - 30],
      //size : [this.width, this.height],
      properties : {

        backgroundColor : FLOATINGPANEL_CONT_BG_COLOR,
        color : FLOATINGPANEL_CONT_FG_COLOR,
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex : FLOATINGPANEL_CONT_Z_STACK
      }
    });

    this.modifyScreens.taskModifyHeader = new Surface(
      {
        size : [this.width - 20,40],
        content: FLOATINGPANEL_TASK_MODIFY_HEADER_CONTENT,
        properties : {

          backgroundColor : FLOATINGPANEL_MOD_BG_COLOR,
          color : FLOATINGPANEL_MOD_FG_COLOR,
          lineHeight : FLOATINGPANEL_MOD_HDR_LINEHGT

        }

      }
    );

    this.modifyScreens.taskModifyBody = new Surface(
      {
        size : [this.width - 20,this.height - this.headerHeight - 80],
        content: FLOATINGPANEL_TASK_MODIFY_BODY_CONTENT,
        properties : {

          backgroundColor : FLOATINGPANEL_MOD_BG_COLOR,
          color : FLOATINGPANEL_MOD_FG_COLOR,
          lineHeight : FLOATINGPANEL_MOD_BODY_LINEHGT

        }

      }
    );

    this.modifyModifiers.taskModModifier = new Modifier({
      transform: Transform.translate(0, 50, 0)
    });

    this.modifyTrans.taskModSurfaceTrans = new TransitionableTransform();

    this.modifyTrans.taskModSurfaceTrans.setTranslate([-this.width, 0, 0]);

    this.modifyModifiers.taskModSurfaceModifier = new Modifier({
      transform : this.modifyTrans.taskModSurfaceTrans
    });

    this.modifyContainer.add(this.modifyScreens.taskModifyHeader);
    this.modifyContainer.add(this.modifyModifiers.taskModModifier).add(this.modifyScreens.taskModifyBody);


  }

  module.exports = FloatingPanel;

});
