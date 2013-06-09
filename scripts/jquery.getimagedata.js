(function($){

  var defaults = {
    server: 'http://maxnov.com/getimagedata/getImageData.php',
    callback: 'callback',
    url: ''
  };

  $.getImageData = function(options) {
    var settings = $.extend({}, defaults, options),
        deferred = $.Deferred();

    $.getJSON(
      settings.server + '?' + settings.callback + '=?',
      { url: settings.url }
    ).done(function(image){
      var imgEl = new Image();
      imgEl.onload = function() {
        deferred.resolve(imgEl);
      };
      imgEl.onerror = function() {
        deferred.reject();
      };
      imgEl.src = image.data;
    }).fail(function(){
      deferred.reject();
    });

    return deferred.promise();
  };

})(jQuery);
