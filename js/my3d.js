function space(canvas_id) {

  var origin = [0, 0, 0];
  var objects = [];

  var camera = [0, 0, -3];
  // var camera = [0, 3, 0];
  var upv = [0, 1, 0];

  var fov = 60;
  var aspect = 1;
  var near = 0.5;
  var far = 50;

  var canvas = document.getElementById(canvas_id);
  var w = canvas.width;
  var h = canvas.height;
  var ctx = canvas.getContext('2d');

  function draw() {
    ctx.clearRect(0 , 0 , w, h);
    ctx.save();
    ctx.translate(w/2, h/2);``

    for(var k in objects){
      var object = objects[k];

      for(var i = 0; i < object.faces.length; i++) {

        ctx.beginPath();

        for(var j = 0; j < object.faces[i].length; j++) {
          var faces = object.faces;

          var vertex = object.onscreen[faces[i][j] - 1];
          var next;

          if(j == faces[i].length-1)
            next = object.onscreen[faces[i][0] - 1];
          else
            next = object.onscreen[faces[i][j+1] - 1];

          ctx.moveTo(vertex[0]/vertex[3] * 100, vertex[1]/vertex[3] * 100 *-1 );
          ctx.lineTo(next[0]/next[3]* 100, next[1]/next[3] * 100 *-1 );

        }

        if(object.color != null)
          ctx.strokeStyle = object.color;
        else
          ctx.strokeStyle = '#E8E8E8';

        ctx.closePath();
        ctx.stroke();

      }
    }


    ctx.restore();
  }

  function modeling() {

  }

  function viewing() {
    var Tp = viewMatrix(origin);

    for(var i in objects){
      var object = objects[i];
      for(var i=0; i<object.vertices.length; i++) {
        var vertex = vertexMatrix(object.vertices[i]);
        var r = math.multiply(Tp, vertex)
        object.eyeCoor[i] = r.valueOf();
      }
    }

    projection();
  }

  function viewMatrix(target) {
    var cam = vertexMatrix(camera);
    var tar = vertexMatrix(target);
    var forward = math.subtract(cam, tar).valueOf().slice(0, 3);

    forward = matrixNorm(forward);

    var right = math.cross(forward, upv);

    right = matrixNorm(right);

    var up = math.cross(right, forward)
    up = matrixNorm(up);

    var r = right;
    r.push(0);

    var u = up;
    u.push(0);

    var f = math.multiply(forward, -1);
    f.push(0);

    var Tp = [r, u, f, [0, 0, 0, 1]];
    Tp = math.multiply(Tp, [[1,0,0,-1*camera[0]], [0,1,0,-1*camera[1]], [0,0,1,-1*camera[2]], [0,0,0,1]])

    return(Tp)
  }

  function matrixNorm(matrix) {
    var len = math.norm(matrix)
    matrix = math.divide(matrix, len);
    return matrix;
  }

  function vertexMatrix(vertex) {
    return math.matrix([vertex[0], vertex[1], vertex[2], 1]);
  }

  function projection() {
    var frustumDepth = far - near;
    var oneOverDepth = 1 / frustumDepth;
    var uh = 1/Math.tan(Math.PI*fov/180/2);
    var uw = uh/aspect;

    var Tp = math.matrix([[uw, 0, 0, 0], [0, uh, 0, 0], [0, 0, far*oneOverDepth, 1], [0, 0, -1*far*oneOverDepth*near, 0]]);

    for(var i in objects){
      var object = objects[i];
      object.onscreen = [];
      for(var k=0; k<object.eyeCoor.length; k++){
        var vertex = vertexMatrix(object.eyeCoor[k]);
        var r = math.multiply(Tp, vertex);
        object.onscreen.push(r.valueOf());
        // console.log(r.valueOf());
      }
    }

    draw();
  }

  this.importObject = function(vertices, faces, name, color) {
    var object = {};

    name = typeof name !== 'undefined' ? name : 'object'+objects.length;
    color = typeof color !== 'undefined' ? color : null;

    for(var i=0; i<vertices.length; i++)
      for(var j=0; j<vertices[i].length; j++)
        vertices[i][j] = parseFloat(vertices[i][j]);

    for(var i=0; i<faces.length; i++)
      for(var j=0; j<faces[i].length; j++)
        faces[i][j] = parseInt(faces[i][j]);

    object.vertices = vertices;
    object.faces = faces;

    object.eyeCoor = [];
    object.onscreen = [];
    object.color = color;
    object.name = name;

    objects.push(object);
    // projection();
    viewing();
  }

  this.moveCam = function(xd, yd) {
    var vm = viewMatrix(origin);
    var iv = math.inv(vm);

    var r = math.norm(camera);
    var o = [0, 0, r*-1, 1];

    xd = Math.PI * -xd*3/180;
    yd = Math.PI * -yd*3/180;

    var yTp = [[Math.cos(xd), 0, Math.sin(xd), 0], [0, 1, 0, 0], [-1*Math.sin(xd), 0, Math.cos(xd), 0], [0, 0, 0, 1]];
    var xTp = [[1,0,0,0],[Math.cos(yd), 0, -1*Math.sin(yd), 0], [Math.sin(yd), 0, Math.cos(yd), 0], [0,0,0,1]];

    var after = math.multiply(xTp, o);
    after = math.multiply(yTp, after);

    // console.log(after.valueOf());
    after = math.multiply([[1,0,0,0], [0,1,0,0], [0,0,1,r], [0,0,0,1]], after);
    // console.log(after.valueOf());

    after = math.multiply(iv, after);
    // console.log(after.valueOf().slice(0, 3));
    camera = after.valueOf().slice(0, 3);

    if(Math.abs(camera[2])<0.03)
      upv = math.multiply(-1, upv);

    viewing();
  }


  var axisXV = [[0,0,0], [1,0,0]];
  var axisYV = [[0,0,0], [0,1,0]];
  var axisZV = [[0,0,0], [0,0,1]];

  var axisXF = [[1,2]];
  var axisYF = [[1,2]];
  var axisZF = [[1,2]];

  this.importObject(axisXV, axisXF, 'x-axis', '#DC3912');
  this.importObject(axisYV, axisYF, 'y-axis', '#90C140');
  this.importObject(axisZV, axisZF, 'z-axis', '#164C91');

}