define(function(require, exports, module) {

  var HEADERPANEL_CONT_BG_COLOR = '#808080';
  var HEADERPANEL_CONT_FG_COLOR = '#e9e9e9';


  var Modifier = require('famous/core/Modifier');
  var Surface = require('famous/core/Surface');
  var Transform = require("famous/core/Transform");

  function HeaderPanel(pWidth,pHeight){

    this.width  = pWidth;
    this.height = pHeight;

    this.modifier = null;
    this.surface  = null;

  }

  HeaderPanel.prototype = Object.create(null);
  HeaderPanel.prototype.constructor = HeaderPanel;

  HeaderPanel.prototype.setupPanel = function setupPanel(headerHeight){

    this.modifier = new Modifier({
        transform: Transform.translate(10, 10)
    });

    this.surface = new Surface(
      {
        size : [this.width - 20,headerHeight],
        //content: $('#header').html(),
        content: '<h1>Famo.us ToDo App</h1>',
        properties : {

          backgroundColor : HEADERPANEL_CONT_BG_COLOR,
          color : HEADERPANEL_CONT_FG_COLOR,
          textAlign : 'center',
          lineHeight : 0.25
        }

      }
    );

  }

  HeaderPanel.prototype.addTo = function addTo(ctx){

    ctx.add(this.modifier).add(this.surface);

  }

  module.exports = HeaderPanel;

});
