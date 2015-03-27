function objReader(){
  var reader;
  // var progress = document.querySelector('.percent');

  function objLoadEnd(){};

  function errorHandler(evt) {
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case evt.target.error.ABORT_ERR:
        break; // noop
      default:
        alert('An error occurred reading this file.');
    };
  }

  // function updateProgress(evt) {
  //   // evt is an ProgressEvent.
  //   if (evt.lengthComputable) {
  //     var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
  //     // Increase the progress bar length.
  //     if (percentLoaded < 100) {
  //       progress.style.width = percentLoaded + '%';
  //       progress.textContent = percentLoaded + '%';
  //     }
  //   }
  // }

  function parseObj(s, callback) {
    var vertices = [];
    var faces = [];

    var lines = s.split('\n');

    for(var k in lines){

      var line = lines[k];
      var words = line.split(' ')

      if(words[0] == 'v'){
        vertices.push(words.slice(1));
      }
      else if(words[0] == 'f'){
        faces.push(words.slice(1));
      }
    }

    callback(vertices, faces)
  }

  this.handleFileSelect = function (evt) {

    var ext = evt.target.files[0].name.split('.').pop();

    if(ext != 'obj'){
      console.log('Please select obj file');
      return;
    }
    else{
      // Reset progress indicator on new file selection.
      // progress.style.width = '0%';
      // progress.textContent = '0%';

      reader = new FileReader();
      reader.onerror = errorHandler;
      // reader.onprogress = updateProgress;
      reader.onabort = function(e) {
        alert('File read cancelled');
      };
      // reader.onloadstart = function(e) {
      //   document.getElementById('progress_bar').className = 'loading';
      // };
      reader.onload = function(e) {
        // Ensure that the progress bar displays 100% at the end.
        // progress.style.width = '100%';
        // progress.textContent = '100%';
        // setTimeout("document.getElementById('progress_bar').className='';", 2000);
      }
      reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {
          parseObj(evt.target.result, function (vertices, faces){
            objLoadEnd(vertices, faces);
          });
        }
      }
      // Read in the image file as a binary string.
      reader.readAsText(evt.target.files[0], 'UTF-8');
    }
  }

  this.loadDirect = function(data){
    parseObj(data, function(vertices, faces){
      objLoadEnd(vertices, faces);
    });
  }

  this.objLoadEnd = function(func) {
    objLoadEnd = func;
  }

}
