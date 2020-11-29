window.onload = function() {

  var $video = document.getElementById("video");
  var $videoWraper = document.getElementsByClassName("video-wraper")[0];
  var $inputName = document.getElementById("input-name");
  var $searchSection = document.getElementById("cover");
  var hasNextVideo =true;
  var namesArr= ['pozi', 'risitas'];

  var $btnPlayVideo = document.getElementById("btn-play-video");

  //this on jquery
  var $btnPlayPause = $('.btn-play-pause');
  var isVideoOnPlay =true;
  var $btnVolume = $('.btn-volume');
  var isVolume =true;

  //SECCION BUSCADOR

 //precargo mi primer video
  LoadMiFirstVideo();

  // Execute a function when the user releases a key on the keyboard
  $inputName.addEventListener("keyup", function(event) {

    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {

      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click

      $btnPlayVideo.click();
    }
  });

  $btnPlayVideo.onclick = function() {
    var nameValue = $inputName.value;
    //texto en minusculas y sin espacios
    nameValue= nameValue.toLowerCase().trim();
    console.log ('nombre es',nameValue);
    var videos =  $videoWraper.getElementsByClassName("video")
    //oculto el buscador
    $searchSection.style.display = "none";
    //muestro el video
    $video.classList.remove("hide");
    showMyVideos(0,videos,nameValue);
  }

  //SECCION VIDEO

  function showMyVideos(index, videos,nameValue) {

    var personalizedVideo =false;

    //compruebo que hay mas videos
    if (index < (videos.length - 1)) {
      hasNextVideo = true;
    } else {
      hasNextVideo = false;
    }


    //añado audio personalizalo al primer video
    if(index===0){
      personalizedAudio(nameValue);
    }


    //le doy play al video
    var video = playMyVideo(videos[index],personalizedVideo, nameValue);

    //escucho que esta pasando en el vidoe
    video.addEventListener("timeupdate", preloadVideo);

    function preloadVideo() {
      var currentTime = (this.currentTime / this.duration) * 100;

      if (hasNextVideo && currentTime > 50) {

        var nextVideo = videos[index + 1];
        var nextVideoTag = nextVideo.getElementsByTagName("video")[0];
        var isPersonalizedVideo = nextVideo.classList.contains("personalized-video")

        //está el nomre en la lista?
        var nameIsOnNamesArr = namesArr.includes(nameValue);

        if(isPersonalizedVideo){

          //esta en la lista creamos video personalizado
          if (nameIsOnNamesArr) {
            nextVideo.getElementsByTagName("source")[0].src = "video/" + nameValue + ".mp4"
            nextVideo.getElementsByTagName("source")[1].src = "video/" + nameValue + ".webm"
          }else{
            //NO esta en la listaponecmos texto
            // crea un nuevo div// y añade contenido
            var newDiv = document.createElement("div");
            var newContent = document.createTextNode(nameValue+ " es gay.");
            newDiv.classList.add("js-video-text");
            newDiv.classList.add("p-5");
            newDiv.appendChild(newContent); //añade texto al div creado.
            //añade el div del texto sobre el video (prepend en jquery)
            nextVideo.insertBefore(newDiv, nextVideo.firstChild);

          }

        }

        console.log('ameIsOnNamesArr',nameIsOnNamesArr)

        nextVideoTag.preload = "auto";
        nextVideoTag.load();
        this.removeEventListener("timeupdate",preloadVideo);

      }
    };

    video.onended = function() {
      if (hasNextVideo) {
        showMyVideos(index+1, videos,nameValue);
      } else {
        playMyClosingMenu();
      }
    }
  }

  function playMyVideo(videoContainer,personalizedVideo, nameValue) {

    //elimino el ultimo vidoe activo
    var lastVideoContainer = $videoWraper.getElementsByClassName("active")[0];

    lastVideoContainer.classList.remove("active");
    lastVideoContainer.style.display = "none";

    //activo el video
    videoContainer.style.display = "block";
    videoContainer.classList.add("active");

    var video = videoContainer.getElementsByTagName("video")[0];

    if(!isVolume){
      video.volume=0;

    }
    video.play();
    video.removeAttribute("mute");

    video.loop = false;


    return video;
  }

  function playMyClosingMenu() {
    console.log('cierro')
    //playMyVideo($videoWraper.getElementsByClassName("closing")[0], loop=true);
    var lastVideoContainer = $videoWraper.getElementsByClassName("active")[0];
    var videoContainer = $videoWraper.getElementsByClassName("closing")[0];

    lastVideoContainer.classList.remove("active");
    lastVideoContainer.style.display = "none";

    videoContainer.style.display = "block";
    videoContainer.classList.add("active");

  };

  function set_up_speech() {
    return new Promise(function(resolve, reject) {
      var synth = window.speechSynthesis;
      var voices = synth.getVoices();
      resolve(voices)
    })
  }

  set_up_speech().then(function(voices){});


  function personalizedAudio(nameValue){

    var message = new SpeechSynthesisUtterance('Tenemos noticias importantes sobre '+ nameValue);
    var voices = speechSynthesis.getVoices();

    //españolas son la 0 y la 15 14 y 61 portugues
    message.voice = voices[15];
    message.rate = 1;
    message.pitch = .7;
    message.volume =2;

    speechSynthesis.speak(message);

  }

  function LoadMiFirstVideo() {
    var firstVideoContainer = $videoWraper.getElementsByClassName("first-video")[0];
    var video = firstVideoContainer.getElementsByTagName("video")[0];
    video.preload = "auto";
    video.load();
    video.loop = false;

  }


  //CONTROLES DE VIDEO

  $btnPlayPause.on('click', function (evt) {

    evt.preventDefault();
    var $iconPlay=$(this).find('.oi-media-play');
    var $iconPause=$(this).find('.oi-media-pause');

    //paro el video
    $('.video').each(function(){
      var $this= $(this);
     if($this.hasClass('active')){
       console.log('encuentro un video activo')

       if(isVideoOnPlay){
         isVideoOnPlay=false;
         $this.find('video').trigger('pause');

       }else{
         isVideoOnPlay=true;
         $this.find('video').trigger('play');
       }


     }
    });

    $iconPlay.toggleClass('hide');
    $iconPause.toggleClass('hide');

  });

  $btnVolume.on('click', function (evt) {

    evt.preventDefault();
    var $iconVolumeOn=$(this).find('.oi-volume-high');
    var $iconVolumeOff=$(this).find('.oi-volume-off');

    //paro el video
    $('.video').each(function(){
      var $this= $(this);
      if($this.hasClass('active')){
        console.log('encuentro un video activo')

        if(isVolume){
          isVolume=false;
          $this.find('video').prop("volume", 0);

        }else{
          isVolume=true;
          $this.find('video').prop("volume", 1);
        }


      }
    });

    $iconVolumeOn.toggleClass('hide');
    $iconVolumeOff.toggleClass('hide');

  });


}