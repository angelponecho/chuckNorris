
/*document.addEventListener("DOMContentLoaded", function() {
  var videos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var videoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          video.poster = video.dataset.poster;
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          videoObserver.unobserve(video.target);
        }
      });
    });

    videos.forEach(function(video) {
      videoObserver.observe(video);
    });
  }
});*/


$(function() {

  $('.lazy').lazy({
    // called before an elements gets handled
    beforeLoad: function(element) {
      var imageSrc = element.data('src');
      console.log('image "' + imageSrc + '" is about to be loaded');
    },

    // called after an element was successfully handled
    afterLoad: function(element) {
      var imageSrc = element.data('src');
      console.log('image "' + imageSrc + '" was loaded successfully');
    },

    // called whenever an element could not be handled
    onError: function(element) {
      var imageSrc = element.data('src');
      console.log('image "' + imageSrc + '" could not be loaded');
    },

    // called once all elements was handled
    onFinishedAll: function() {
      console.log('finished loading all images');
    }
  });
});

