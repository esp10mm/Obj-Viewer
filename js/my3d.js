function space(canvas_id) {

  var origin = [0, 0, 0];
  var objects = [];
  var objCount = -3;

  var camera = [3, 3, 3];
  // var camera = [0, 3, 0];
  var upv = [0, -1, 0];

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

  function viewing() {
    var Tp = viewMatrix(camera, origin);

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

  function viewMatrix(camera, target) {
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

    name = typeof name !== 'undefined' ? name : 'object'+(objCount);
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
    objCount += 1;
    // projection();
    viewing();
  }

  this.rotateCam = function(xd, yd) {
    var vm = viewMatrix(camera, origin);
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


    if(Math.abs(matrixNorm(camera)[2])<0.01)
      upv = math.multiply(-1, upv);

    viewing();
  }

  this.moveCam = function(dir) {
    dir = dir * -1;
    var u = matrixNorm(camera);
    var backup = camera;

    u = math.multiply(u, Math.abs(dir));
    if(dir>0)
      camera = math.add(u, camera);
    else
      camera = math.subtract(camera, u);

    if(!math.deepEqual(matrixNorm(camera), matrixNorm(backup)))
      camera = backup;
    viewing();
  }

  this.getObjects = function() {
    return objects.slice(3,objects.length);
  }

  this.removeObject = function(index) {
    index = parseInt(index) + 3;
    objects.splice(index, 1);
    viewing();
    return objects.slice(3,objects.length);
  }

  this.objectTranslation = function(tar, x, y, z){
    tar = parseInt(tar) + 3;

    var object = objects[tar];
    var Tp = math.matrix([[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]]);

    for(var k in object.vertices){
      var vertex = vertexMatrix(object.vertices[k]);
      vertex = math.multiply(Tp, vertex);
      vertex = vertex.valueOf().slice(0, 3);
      object.vertices[k] = vertex;
    }

    viewing();
  }

  this.objectRotatePoint = function(tar, ax, az, ay, px, py, pz){
    tar = parseInt(tar) + 3;

    var refer = [px, py, pz];
    var object = objects[tar];

    ax = Math.PI*ax/180;
    ay = Math.PI*ay/180;
    az = Math.PI*az/180;

    var transM = [[1,0,0,-1*refer[0]], [0,1,0,-1*refer[1]], [0,0,1,-1*refer[2]], [0,0,0,1]];
    var transX = [[1,0,0,0],[0, Math.cos(ax), Math.sin(ax), 0], [0, -1*Math.sin(ax), Math.cos(ax), 0], [0,0,0,1]];
    var transY = [[Math.cos(ay), 0, -Math.sin(ay),0],[0, 1, 0, 0], [Math.sin(ay), 0, Math.cos(ay), 0], [0,0,0,1]];
    var transZ = [[Math.cos(az), Math.sin(az), 0 ,0],[-Math.sin(az), Math.cos(az), 0 ,0], [0, 0, 1, 0], [0,0,0,1]];
    var transMI = math.inv(transM);

    for(var k in object.vertices){
      var vertex = vertexMatrix(object.vertices[k]);
      vertex = math.multiply(transM, vertex);
      vertex = math.multiply(transX, vertex);
      vertex = math.multiply(transY, vertex);
      vertex = math.multiply(transZ, vertex);
      vertex = math.multiply(transMI, vertex);

      object.vertices[k] = vertex.valueOf().slice(0, 3);
    }

    viewing();
  }

  this.objectScale = function(tar, sx, sy, sz){
    tar = parseInt(tar) + 3;

    var object = objects[tar];

    var Tp = [[sx,0,0,0], [0,sy,0,0], [0,0,sz,0], [0,0,0,1]];

    for(var k in object.vertices){
      var vertex = math.multiply(Tp, vertexMatrix(object.vertices[k]));
      object.vertices[k] = vertex.valueOf().slice(0,3);
    }

    viewing();
  }

  this.objectShear = function(tar, sxy, sxz, syx, syz, szx, szy){
    tar = parseInt(tar) + 3;

    var object = objects[tar];

    sxy = 1/Math.tan(Math.PI*sxy/180);
    syx = 1/Math.tan(Math.PI*syx/180);
    sxz = 1/Math.tan(Math.PI*sxz/180);
    szx = 1/Math.tan(Math.PI*szx/180);
    syz = 1/Math.tan(Math.PI*syz/180);
    szy = 1/Math.tan(Math.PI*szy/180);

    var Tp = [[1,sxy,sxz,0],[syx,1,syz,0],[szx,szy,1,0],[0,0,0,1]];

    for(var k in object.vertices){
      var vertex = math.multiply(Tp, vertexMatrix(object.vertices[k]));
      object.vertices[k] = vertex.valueOf().slice(0,3);
    }
    
    viewing();

  }

  var axisXV = [[0,0,0], [1,0,0]];
  var axisYV = [[0,0,0], [0,1,0]];
  var axisZV = [[0,0,0], [0,0,1]];

  var axisXF = [[1,2]];
  var axisYF = [[1,2]];
  var axisZF = [[1,2]];

  this.importObject(axisXV, axisXF, 'x-axis', '#DC3912');
  this.importObject(axisYV, axisYF, 'y-axis', '#164C91');
  this.importObject(axisZV, axisZF, 'z-axis', '#90C140');

}
