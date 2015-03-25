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

function activeItem(target) {
  $('.panel.'+target).show()
    .css('display', 'inline-block');
}

function choosefile() {
  document.getElementById('file').click();
}
