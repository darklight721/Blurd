(function($){

  var FLICKR = {
    url: 'http://api.flickr.com/services/rest/',
    methods: {
      interesting: '?method=flickr.interestingness.getList&per_page=10&page=1',
      sizes: '?method=flickr.photos.getSizes&photo_id='
    },
    key: '&api_key=f9a76cb79d0c5a0d0f4073b52b680938',
    format: '&format=json&jsoncallback=?',
    getAPIfor: function(method, arg) {
      return this.url + this.methods[method] + (arg ? arg : '') + this.key + this.format;
    }
  };

  function photoToURL(photo) {
    if (!photo) return '';

    return 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server +
           '/' + photo.id + '_' + photo.secret + '_b.jpg';
  }

  function getLargeSize(photo, callback) {
    $.getJSON(FLICKR.getAPIfor('sizes', photo.id)).done(function(data){
      var retVal = null;
      if (data && data.stat === 'ok' && data.sizes) {
        retVal = _.find(data.sizes.size, function(size){
          return size.label === 'Large' && parseInt(size.width) > parseInt(size.height);
        });
      }
      callback && callback(retVal);
    });
  }

  $.flickr = function() {
    var deferred = $.Deferred(),
        photos = null,
        index = 0,
        callback = function callback(photo) {
          if (photo) {
            deferred.resolve(photo.source);
            return;
          }
          if (index < photos.length) {
            getLargeSize(photos[index++], callback);
          }
          else {
            deferred.reject();
          }
        };

    $.getJSON(FLICKR.getAPIfor('interesting')).done(function(data){
      if (data && data.stat === 'ok' && data.photos.photo.length > 0) {
        photos = data.photos.photo;
        callback();
      }
      else {
        deferred.reject();
      }
    }).fail(function(){
      deferred.reject();
    });

    return deferred.promise();
  };

})(jQuery);
