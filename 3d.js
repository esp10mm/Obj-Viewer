function object(vertices, faces) {

  this.vertices = vertices;
  this.faces = faces;

  this.disp = function (scale) {
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


}
