
initUI();

function initUI() {
  $('.panelTitle.segment').on('mousedown', function(e) {

    $(this).parent().addClass('draggable').parents().on('mousemove', function(e) {
      $('.draggable').offset({
        top: e.pageY - $('.draggable').outerHeight() / 2,
        left: e.pageX - $('.draggable').outerWidth() / 2
      }).on('mouseup', function() {
        $(this).removeClass('draggable');
      });
    });
    e.preventDefault();
  }).on('mouseup', function() {
      $('.draggable').removeClass('draggable');
  });

  $('.panel.remove.icon').on('click', function(e){
    $(this).parent().hide();
  })

  $('.objects.remove.button').on('click', function(){
    var index = $('.dropdown').dropdown('get value')[0];
    var objects = space.removeObject(index);

    $('.dropdown').dropdown('clear');
    $('.objects.operate').hide();

    updateUI(objects);
  })
}

function activeItem(target) {
  $('.panel.'+target).show()
    .css('display', 'inline-block');
}

function choosefile() {
  document.getElementById('file').click();
}

function updateUI(objects) {

  $('.objects.menu').html('');
  for(var k in objects){
    var obj = objects[k];
    var dropContent = "";

    dropContent = '<div class="item" data-value="'+ k +'">'+
      obj.name+'</div>'

    $('.objects.menu').append(dropContent);
  }

  $('.dropdown').dropdown();
  if(objects.length > 0){
    if($('.dropdown').dropdown('get value')[0].length != 0){
      $('.objects.operate').show();
    }
    else {
      $('.dropdown').dropdown('set selected', 0);
      $('.objects.operate').show();
    }
  }


}
