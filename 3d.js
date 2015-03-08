function object(vertices, faces) {

  this.vertices = vertices;
  this.faces = faces;

  // Rotate shape around the z-axis
  this.rotateZ3D = function(theta) {
    theta = Math.PI * theta/180;

    var sin_t = Math.sin(theta);
    var cos_t = Math.cos(theta);

    for (var n=0; n<vertices.length; n++) {
        var vertex = vertices[n];
        var x = vertex[0];
        var y = vertex[1];
        vertex[0] = x * cos_t - y * sin_t;
        vertex[1] = y * cos_t + x * sin_t;
    }
  };

  this.rotateY3D = function(theta) {
    theta = Math.PI * theta/180;

    var sin_t = Math.sin(theta);
    var cos_t = Math.cos(theta);

    for (var n=0; n<vertices.length; n++) {
        var vertex = vertices[n];
        var x = vertex[0];
        var z = vertex[2];
        vertex[0] = x * cos_t - z * sin_t;
        vertex[2] = z * cos_t + x * sin_t;
    }
  };

  this.rotateX3D = function(theta) {
    theta = Math.PI * theta/180;

    var sin_t = Math.sin(theta);
    var cos_t = Math.cos(theta);

    for (var n=0; n<vertices.length; n++) {
        var vertex = vertices[n];
        var y = vertex[1];
        var z = vertex[2];
        vertex[1] = y * cos_t - z * sin_t;
        vertex[2] = z * cos_t + y * sin_t;
    }
  };

  this.rotateZ3D(30);
  this.rotateY3D(30);
  this.rotateX3D(30);

  this.draw = function (scale) {
    var canvas = document.getElementById('canvas');
    var w = canvas.width;
    var h = canvas.height;

    var ctx = canvas.getContext('2d');

    ctx.save();

    ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );

    ctx.translate(w/2, h/2);


    for(var i = 0; i < faces.length; i++) {

      ctx.beginPath();

      for(var j = 0; j < faces[i].length; j++) {
        var vertex = vertices[parseInt(faces[i][j]) - 1];
        var next;

        if(j == faces[i].length-1)
          next = vertices[parseInt(faces[i][0]) - 1];
        else
          next = vertices[parseInt(faces[i][j+1]) - 1];

        ctx.moveTo(vertex[0] * scale, vertex[1] * scale);
        ctx.lineTo(next[0] * scale, next[1] * scale);

      }

      ctx.closePath();
      ctx.stroke();

    }

    ctx.restore();

  }

  this.draw(100);


}
