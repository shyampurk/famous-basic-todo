define(function(require, exports, module) {

  var RenderNode = require('famous/core/RenderNode');
  var Modifier = require('famous/core/Modifier');
  var Quaternion = require('famous/math/Quaternion');
  var Easing     = require('famous/transitions/Easing');
  var Transform = require("famous/core/Transform");
  var Transitionable = require('famous/transitions/Transitionable');
  var TransitionableTransform = require('famous/transitions/TransitionableTransform');

  var MainPanel = require('panels/MainPanel');
  var TaskPanel = require('panels/TaskPanel');
  var StatCounter = require('utils/Stats');


  function PagePanel(pWidth,pHeight){

    this.transitionableTransform = new TransitionableTransform();

    this.rotationModifier = new Modifier({
      transform: this.transitionableTransform
    });

    this.containerPanel = new RenderNode();

    this.quaternion = new Quaternion(1, 0, 0, 0);
    this.moveQuaternion = new Quaternion(185, 0, 0, 0);

    this.frontPanel = new MainPanel(pWidth,pHeight);
    this.taskPanel  = new TaskPanel(pWidth,pHeight);

    this.toggle = true;
    //True represents task summary view

    var that = this;


  }

  PagePanel.prototype = Object.create(null);
  PagePanel.prototype.constructor = PagePanel;

  PagePanel.prototype.setupPanel = function setupPanel(){

    this.frontPanel.setupPanel();

    this.frontPanel.loginPanelAddTo(this.containerPanel);
    this.frontPanel.introPanelAddTo(this.containerPanel);

    this.taskPanel.setupPanel();
    this.taskPanel.addTo(this.containerPanel);

  }

  PagePanel.prototype.addTo = function addTo(ctx){

    ctx.add(this.rotationModifier).add(this.containerPanel);

  }

  PagePanel.prototype.displayFrontPanel = function displayFrontPanel(){

    if(!this.toggle)
      _screenToggle.call(this);

  }

  PagePanel.prototype.displayTaskPanel = function displayTaskPanel(){

    if(this.toggle)
      _screenToggle.call(this);

  }

  PagePanel.prototype.switchoffLoginPanel = function switchoffLoginPanel(){

    this.frontPanel.switchoffLoginPanel();

  }

  PagePanel.prototype.updateTaskHeader = function updateTaskHeader(){

    this.taskPanel.updateContent();

  }

  PagePanel.prototype.updateIntroContent = function updateIntroContent(){

    this.frontPanel.updateIntroContent();

  }


  PagePanel.prototype.addTask = function addTask(taskObj){

    this.taskPanel.addTask(taskObj);

  }

  PagePanel.prototype.modifyTask = function modifyTask(taskObj){

    this.taskPanel.modifyTask(taskObj);

  }

  PagePanel.prototype.getModifyEvent = function getModifyEvent(){

    return this.taskPanel.getModifyEvent();

  }

  function _screenToggle(){

    if(this.toggle){
      this.moveQuaternion = new Quaternion(180, 0, 180, 0);
    } else {
      this.moveQuaternion = new Quaternion(180, 0, -180, 0);
    }

    this.quaternion = this.quaternion.multiply(this.moveQuaternion);
    this.transitionableTransform.set( Transform.multiply(Transform.translate(0, 0, 0), this.quaternion.getTransform()),{duration: 750} );


      if(this.toggle){

        var transitionableVisible = new Transitionable(0);
        transitionableVisible.set(1, { duration: 750 , curve : Easing.outQuad});

        this.taskPanel.getHeaderModifier().opacityFrom(function(){
            return transitionableVisible.get()
        });

        var transitionableInVisible = new Transitionable(1);
        transitionableInVisible.set(0, { duration: 750 , curve : Easing.outQuad });

        this.frontPanel.getIntroPanel().opacityFrom(function(){
            return transitionableInVisible.get()
        });


        this.toggle = false;

      } else {

        var transitionableVisible = new Transitionable(0);
        transitionableVisible.set(1, { duration: 750 , curve : Easing.outQuad});

        var transitionableInVisible = new Transitionable(1);
        transitionableInVisible.set(0, { duration: 750 , curve : Easing.outQuad});

        this.taskPanel.getHeaderModifier().opacityFrom(function(){
            return transitionableInVisible.get()
        });

        this.frontPanel.getIntroPanel().opacityFrom(function(){
            return transitionableVisible.get()
        });


        this.toggle = true;

      }

  }

  module.exports = PagePanel;

});
