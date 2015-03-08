function myCanvas(id) {
  var canvas = document.getElementById(id);
  var ctx = canvas.getContext('2d');
  var rect = {};
  var drag = false;

  this.mouseX = 0;
  this.mouseY = 0;
  this.pmouseX = 0;
  this.pmouseY = 0;

  function mouseDown(e) {
    drag = true;
    console.log('mouseDown');
  }

  function mouseUp() {
    drag = false;
  }

  function mouseMove(e) {
    if (drag) {
      this.pmouseX = this.mouseX;
      this.pmouseY = this.mouseY;
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
    }
  }

  this.init = function() {
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
  }

  this.init();

}
