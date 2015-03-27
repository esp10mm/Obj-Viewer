var transTabOrigin = $('.trans.panel').html();

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
    var index = $('.dropdown .value').val();
    var objects = space.removeObject(index);

    $('.dropdown').dropdown('clear');
    $('.objects.operate').hide();

    updateUI(objects);
  })

  $('.translation.tab').addClass('active');
  $('.translation.item').addClass('active');
  $('.trans.menu .item').tab();
  transTabInit();

  $('.objects.trans.button').on('click', function(){
    $('.trans.panel').show();
    transButtonClick();
  })

  $('.dropdown').on('change', function(){
    transTabClear('shear');
    transButtonClick();
  })

}

function transButtonClick() {
  var objectText = $('.dropdown .text').text();
  var headerText = '<i class="tiny yellow wizard icon"></i>'+objectText;
  $('.selectedObj.header').html(headerText);

  var objectIndex = $('.dropdown .value').val();
  $('.trans.panel').removeClass('disabled');
}

function transTabInit() {
  // Translation Apply
  $('.translation.apply').on('click', function(){
    var vx = $('.translation.x').val();
    var vy = $('.translation.y').val();
    var vz = $('.translation.z').val();

    if(!parseFloat(vx))
      vx = 0;
    else
      vx = parseFloat(vx);
    if(!parseFloat(vy))
      vy = 0;
    else
      vy = parseFloat(vy);
    if(!parseFloat(vz))
      vz = 0;
    else
      vz = parseFloat(vz);

    var tar = $('.dropdown .value').val();
    if(tar.length > 0){
      space.objectTranslation(tar, vx, vz, vy);
    }

    transTabClear('translation');
  })

  // Rotate Apply
  $('.rotate.point.apply').on('click', function(){
    var pax = $('.rotate.pax').val();
    var pay = $('.rotate.pay').val();
    var paz = $('.rotate.paz').val();

    var pcx = $('.rotate.pcx').val();
    var pcy = $('.rotate.pcy').val();
    var pcz = $('.rotate.pcz').val();

    if(!parseFloat(pax))
      pax = 0;
    else
      pax = parseFloat(pax);
    if(!parseFloat(pay))
      pay = 0;
    else
      pay = parseFloat(pay);
    if(!parseFloat(paz))
      paz = 0;
    else
      paz = parseFloat(paz);

    if(!parseFloat(pcx))
      pcx = 0;
    else
      pcx = parseFloat(pcx);
    if(!parseFloat(pcy))
      pcy = 0;
    else
      pcy = parseFloat(pcy);
    if(!parseFloat(pcz))
      pcz = 0;
    else
      pcz = parseFloat(pcz);

    var tar = $('.dropdown .value').val();
    if(tar.length > 0){
      space.objectRotatePoint(tar, pax, pay, paz, pcx, pcz, pcy);
    }

    transTabClear('rotate');
  })

  // Scale Apply
  $('.scale.apply').on('click', function(){
    var sx = $('.scale.sx').val();
    var sy = $('.scale.sy').val();
    var sz = $('.scale.sz').val();

    if(!parseFloat(sx))
      sx = 1;
    else
      sx = parseFloat(sx);
    if(!parseFloat(sy))
      sy = 1;
    else
      sy = parseFloat(sy);
    if(!parseFloat(sz))
      sz = 1;
    else
      sz = parseFloat(sz);

    var tar = $('.dropdown .value').val();
    if(tar.length > 0){
      space.objectScale(tar, sx, sz, sy);
    }

    transTabClear('scale');
  })

  // Shear Apply
  $('.shear.apply').on('click', function(){
    var sxy = $('.shear.sxy').val();
    var sxz = $('.shear.sxz').val();
    var syx = $('.shear.syx').val();
    var syz = $('.shear.syz').val();
    var szx = $('.shear.szx').val();
    var szy = $('.shear.szy').val();

    if(!parseFloat(sxy))
      sxy = 90;
    else
      sxy = parseFloat(sxy);
    if(!parseFloat(syx))
      syx = 90;
    else
      syx = parseFloat(syx);
    if(!parseFloat(szx))
      szx = 90;
    else
      szx = parseFloat(szx);
    if(!parseFloat(sxz))
      sxz = 90;
    else
      sxz = parseFloat(sxz);
    if(!parseFloat(syz))
      syz = 90;
    else
      syz = parseFloat(syz);
    if(!parseFloat(szy))
      szy = 90;
    else
      szy = parseFloat(szy);

    var tar = $('.dropdown .value').val();
    if(tar.length > 0){
      space.objectShear(tar, sxz, sxy, szx, szy, syx, syz);
    }

    transTabClear('shear');
  })

}

function transTabClear(tabname) {
  $('.trans.panel').html(transTabOrigin);
  $('.tab.'+tabname).addClass('active');
  $('.item.'+tabname).addClass('active');
  $('.trans.menu .item').tab();

  var tar = $('.dropdown .value').val();
  if(tar.length>0){
    var objectText = $('.dropdown .text').text();
    var headerText = '<i class="tiny yellow wizard icon"></i>'+objectText;
    $('.selectedObj.header').html(headerText);
  }

  transTabInit();
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
    if($('.dropdown .value').val().length != 0){
      $('.objects.operate').show();
    }
    else {
      $('.dropdown').dropdown('set selected', 0);
      $('.objects.operate').show();
    }
  }
  else {
    $('.trans.panel').addClass('disabled');
    $('.selectedObj').html('<i class="tiny yellow wizard icon"></i>No Object Selected');
  }

}
