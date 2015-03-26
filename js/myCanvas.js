function myCanvas(id) {
  var canvas = document.getElementById(id);
  var ctx = canvas.getContext('2d');
  var drag = false;

  var mouseX = 0;
  var mouseY = 0;


  function mouseDown(e) {
    drag = true;
    mouseX = e.pageX;
    mouseY = e.pageY;
  }

  function mouseUp() {
    drag = false;
  }

  function mouseMove(e) {
    if (drag) {

      dragListener(e.pageX-mouseX, e.pageY-mouseY);

      mouseX = e.pageX;
      mouseY = e.pageY;

    }
  }

  function dragListener(xd, yd) {};

  function wheelListener(dir) {};

  function dottedLineInit(){
    var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
    if (CP && CP.lineTo){
      CP.dashedLine = function(x,y,x2,y2,dashArray){
        if (!dashArray) dashArray=[10,5];
        if (dashLength==0) dashLength = 0.001; // Hack for Safari
        var dashCount = dashArray.length;
        this.moveTo(x, y);
        var dx = (x2-x), dy = (y2-y);
        var slope = dx ? dy/dx : 1e15;
        var distRemaining = Math.sqrt( dx*dx + dy*dy );
        var dashIndex=0, draw=true;
        while (distRemaining>=0.1){
          var dashLength = dashArray[dashIndex++%dashCount];
          if (dashLength > distRemaining) dashLength = distRemaining;
          var xStep = Math.sqrt( dashLength*dashLength / (1 + slope*slope) );
          if (dx<0) xStep = -xStep;
          x += xStep
          y += slope*xStep;
          this[draw ? 'lineTo' : 'moveTo'](x,y);
          distRemaining -= dashLength;
          draw = !draw;
        }
      }
    }
  }

  function mouseWheeling(e) {
    var scrollDirection = e.wheelDelta || -1 * e.detail;
    wheelListener(scrollDirection);
  }

  this.init = function() {
    canvas.setAttribute("width", canvas.offsetWidth);
    canvas.setAttribute("height", canvas.offsetHeight);

    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mouseout', mouseUp, false);

    canvas.addEventListener("mousewheel", mouseWheeling, false);

    dottedLineInit();
  }

  this.setDragListener = function(func) {
    dragListener = func;
  }

  this.setWheelListener = function(func) {
    wheelListener = func;
  }

  this.init();

}
