define(function(require, exports, module) {

  //MainPanel Constants
  var MAINPANEL_BG_COLOR = '#fa5c4f';
  var MAINPANEL_FG_COLOR = '#e9e9e9';
  var MAINPANEL_Z_STACK  = 10;

  var MAINPANEL_LOGIN_CONTENT = '<div style="padding:10px;"> \
                      <div style="text-align:center;"> \
                        <h2>ToDo Demo</h2> \
                      </div> \
                      <div> \
                        <h4>Select Collaborator Name</h4> \
                      </div> \
                      <div> \
                        <label> \
                          <select> \
                            <option selected> Select Name </option> \
                            <option>Peter</option> \
                            <option>Eric</option> \
                            <option>Sam</option> \
                          </select> \
                        </label> \
                      </div> \
                      <div style="margin-top:75px;text-align:center;"> \
                        <button id="loginButton">Login</button> \
                      </div> \
                    </div>' ;

  var MAINPANEL_INTRO_CONTENT_PRE = '<div> \
                       <table style="width:100%"> \
                         <tr>  \
                           <td>Project </td>  \
                           <td>ToDo Demo</td> \
                         </tr> \
                         <tr>  \
                           <td>Collaborators</td> \
                           <td>Peter, Eric, Sam</td> \
                         </tr> \
                         <tr>  \
                           <td>Last Update</td> \
                           <td id="lastUpdate">';

  var MAINPANEL_INTRO_CONTENT_TIMEPOST = '</td> \
                                         </tr> \
                                      </table> \
                                      <div style="margin-top:50px;text-align:center;"> \
                                         <button id="taskButton">Tasks ';


  var MAINPANEL_INTRO_CONTENT_TASKMETRIC_POST = '</button> \
                                                  </div> \
                                                </div>' ;

  //Famo.us Imports
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require("famous/core/Transform");

  //App Imports
  var StatCounter = require('utils/Stats');

  function MainPanel(pWidth,pHeight){

    this.width = pWidth - 20 ;
    this.height = (pHeight - pHeight / 8) - 30;

    this.loginModifier = null;
    this.loginScreen = null;

    this.introModifier = null;
    this.introScreen = null;


  }

  MainPanel.prototype = Object.create(null);
  MainPanel.prototype.constructor = MainPanel;

  MainPanel.prototype.setupPanel = function setupPanel(){

    this.loginModifier = new Modifier({
        transform: Transform.translate(0, 0, 0)
    });

    this.loginScreen = new Surface({
      size : [this.width,this.height],
      content : MAINPANEL_LOGIN_CONTENT,
      properties : {

        backgroundColor : MAINPANEL_BG_COLOR,
        zIndex : MAINPANEL_Z_STACK,
        color  : MAINPANEL_FG_COLOR

      }

    });

    this.introModifier = new Modifier({
        transform: Transform.translate(0, 0, 0)
    });


    this.introScreen = new Surface(
      {
        size : [this.width,this.height],
        content : _frameIntroContent() ,
        properties : {

          backgroundColor : MAINPANEL_BG_COLOR,
          zIndex : 1,
          color : MAINPANEL_FG_COLOR,

        }

      }
    );


  }

  MainPanel.prototype.loginPanelAddTo = function loginPanelAddTo(context){

    context.add(this.loginModifier).add(this.loginScreen);

  }

  MainPanel.prototype.introPanelAddTo = function introPanelAddTo(context){

    context.add(this.introModifier).add(this.introScreen);

  }


  MainPanel.prototype.getLoginPanel = function getLoginPanel(){

    return this.loginModifier;

  }

  MainPanel.prototype.getIntroPanel = function getIntroPanel(){

    return this.introModifier;

  }

  MainPanel.prototype.switchoffLoginPanel = function switchoffLoginPanel(){

    this.introScreen.setProperties({zIndex : 10});
    this.loginScreen.setProperties({display : 'none'});

  }

  MainPanel.prototype.updateIntroContent = function updateIntroContent(){

    this.introScreen.setContent(_frameIntroContent());

  }

  function _frameIntroContent(){

    var introContent = MAINPANEL_INTRO_CONTENT_PRE;

    introContent+=StatCounter.getLastUpdate();

    introContent+=MAINPANEL_INTRO_CONTENT_TIMEPOST;

    introContent+=StatCounter.getCompletedTasks();
    introContent+='/';
    introContent+=StatCounter.getTotalTasks();


    introContent+=MAINPANEL_INTRO_CONTENT_TASKMETRIC_POST;

    return introContent;

  }

  module.exports = MainPanel;

});
