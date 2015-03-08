function myCanvas(id) {
  var canvas = document.getElementById(id);
  var ctx = canvas.getContext('2d');
  var drag = false;

  var mouseX = 0;
  var mouseY = 0;


  function mouseDown(e) {
    drag = true;
    console.log('mouseDown');
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

  this.init = function() {
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mouseout', mouseUp, false);
  }

  this.setDragListener = function(func) {
    dragListener = func;
  }

  this.init();

}
