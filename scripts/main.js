(function($){

  var canvas = new CanvasImage($('#cnv-background')[0]),
      blur = 4,
      fileOpen = $('#file-open'),
      fileDownload = $('#file-download')[0],
      isNonChrome = false;

  verticalAlignForSuckyBrowsers();

  canvas.setup = function(image, _blur) {
    this.change(image);
    this.blur(_blur || blur);
    isNonChrome && $(this.element).trigger('elem-resize');
  };

  $.flickr().done(function(imgUrl){
    $.getImageData(
      { url: imgUrl }
    ).done(function(image){
      canvas.setup(image);
      $('.loading').addClass('slide-top');
    }).fail(handleFail);
  }).fail(handleFail);

  $('button.open').click(function(){
    fileOpen.click();
  });

  $('button.blur').click(function(){
    var addBlur = parseInt($(this).data('value'));
    if (blur === 0 && addBlur < 0) return;
    blur += addBlur;
    canvas.blur(blur);
  });

  $('button.download').click(function(){
    fileDownload.href = canvas.element.toDataURL('image/jpeg', 0.9);
    fileDownload.click();
  });

  fileOpen.change(function(evt){
    if (evt.target.files)
      readFile(evt.target.files[0]);
  });

  $('.container').on({
    'dragover': handleDragOver,
    'dragleave': handleDragLeave,
    'drop': handleDrop
  });

  function readFile(file) {
    // Only process image files
    var imageType = /image.*/;
    if (!file || !file.type.match(imageType)) return;

    var reader = new FileReader();

    reader.onerror = function(e) {
      alert("Error code: " + e.target.error.code);
    };

    reader.onload = function(e) {
      var image = new Image();
      image.onload = function() {
        canvas.setup(image);
      };
      image.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }

  function handleDragLeave(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }

  function handleDrop(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    readFile(evt.originalEvent.dataTransfer.files[0]);
  }

  function handleFail() {
    var image = new Image();
    image.onload = function() {
      canvas.setup(image);
      $('.loading').addClass('slide-top');
    };
    image.src = 'images/sample.jpg';
  }

  function verticalAlignForSuckyBrowsers() {
    if (window.navigator && window.navigator.userAgent.indexOf('Chrome') !== -1)
      return;

    isNonChrome = true;

    function center() {
      $(this).css({
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
        'margin-top': '-' + $(this).outerHeight() / 2 + 'px',
        'margin-left': '-' + $(this).outerWidth() / 2 + 'px'
      });
    }

    $('.center-content>*').each(function(){
      if ($(this).is('.fixed')) {
        center.call($(this));
      }
      else if ($(this).is('.dynamic')) {
        $(this).on('elem-resize', center);
      }
    });

    $(window).resize(function(){
      $('.center-content>.dynamic').trigger('elem-resize');
    });
  }

})(jQuery);
