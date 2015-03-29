var transTabOrigin = $('.trans.panel').html();

initUI();

function initUI() {

  $('.objects.panel.segment').offset({top:270,left:0});
  $('.objects.panel.segment').css('visibility','visible');


  $('.trans.panel.segment').offset({top:36,left:$('.main.segment').width() - 485});
  $('.trans.panel.segment').css('visibility','visible');
  panelInit();

  $('.ui.modal').modal();
  settingInit();

  messageInit();

  $('.objects.remove.button').on('click', function(){
    var index = $('.objectSelect.dropdown .value').val();
    var objects = space.removeObject(index);

    $('.objectSelect.dropdown').dropdown('clear');
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

  $('.objectSelect.dropdown').on('change', function(){
    transTabClear('translation');
    transButtonClick();
  })

  $('.sampleImport.dropdown').dropdown();

  $('.import.sample.button').on('click', function(){
    var filename =  $('.sampleImport.dropdown .value').val();
    if(filename.length > 0){
      $(this).addClass('loading');
      $.get('data/'+filename, function(data){
        objReader.loadDirect(data);
        $('.import.sample.button').removeClass('loading');
      })
    }
  })

}

function panelInit(select) {
  select = typeof select !== 'undefined' ? select : '';
  $(select+'.panelTitle.segment').on('mousedown', function(e) {

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

  $(select+'.panel.remove.icon').on('click', function(e){
    $(this).parent().hide();
  })

  // $(select+'.panel.segment').css('max-height', function(){
  //   // console.log($(this).parent().height());
  //   return $(this).parent().height();
  // })
}

function transButtonClick() {
  var objectText = $('.objectSelect.dropdown .text').text();
  var headerText = '<i class="tiny yellow wizard icon"></i>'+objectText;
  $('.selectedObj.header').html(headerText);

  var objectIndex = $('.objectSelect.dropdown .value').val();
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

    var tar = $('.objectSelect.dropdown .value').val();
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

    var tar = $('.objectSelect.dropdown .value').val();
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

    var tar = $('.objectSelect.dropdown .value').val();
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

    var tar = $('.objectSelect.dropdown .value').val();
    if(tar.length > 0){
      space.objectShear(tar, sxz, sxy, szx, szy, syx, syz);
    }

    transTabClear('shear');
  })

  // Reflection Apply
  $('.reflection.apply').on('click',function(){
    var tar = $('.objectSelect.dropdown .value').val();
    if(tar.length > 0){
      if($(this).hasClass('xy'))
        space.objectReflect(tar, 'xz');
      else if($(this).hasClass('yz'))
        space.objectReflect(tar, 'yz');
      if($(this).hasClass('xz'))
        space.objectReflect(tar, 'xy');
    }

    transTabClear('reflection');
  })

}

function transTabClear(tabname) {
  $('.trans.panel').html(transTabOrigin);
  $('.tab.'+tabname).addClass('active');
  $('.item.'+tabname).addClass('active');
  $('.trans.menu .item').tab();

  var tar = $('.objectSelect.dropdown .value').val();
  if(tar.length>0){
    var objectText = $('.objectSelect.dropdown .text').text();
    var headerText = '<i class="tiny yellow wizard icon"></i>'+objectText;
    $('.selectedObj.header').html(headerText);
  }

  transTabInit();
  panelInit('.trans');
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

  $('.objectSelect.dropdown').dropdown();
  if(objects.length > 0){
    if($('.objectSelect.dropdown .value').val().length != 0){
      $('.objects.operate').show();
    }
    else {
      $('.objectSelect.dropdown').dropdown('set selected', 0);
      $('.objects.operate').show();
    }
  }
  else {
    $('.trans.panel').addClass('disabled');
    $('.selectedObj').html('<i class="tiny yellow wizard icon"></i>No Object Selected');
  }

}

function setting() {
  $('.ui.modal').modal('show');
}

function settingInit() {
  $('.setting.menu .item').tab();
  $('.ui.perspective.checkbox').checkbox({
    onChange: function(){
      space.setPerspective($('.ui.perspective.checkbox').checkbox('is checked'));
    }
  });

  $('.scale.view.value').on('input', function(){
    space.setViewScale(parseFloat($('.scale.view.value').val()));
  })
}

function messageInit(){
  // console.log($('.message').)
  var h = $('.main.segment').height()-120;
  // var w = $('.main.segment').width() - 520;
  $('.message').css({top:h});
  $('.message').css('visibility','visible');
  // console.log('no')
  $('.message .close.icon').on('click', function(){
    $('.message').transition('fade');
  })
}
