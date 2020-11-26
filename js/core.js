window.onload = function() {
  var $video = document.getElementById("video");
  var $videoWraper = document.getElementsByClassName("video-wraper")[0];
  var $btnPlayVideo = document.getElementById("btn-play-video");
  var $inputName = document.getElementById("input-name");
  var $searchSection = document.getElementById("cover");
  var namesArr= ['Pozi', 'Risitas'];






  // Execute a function when the user releases a key on the keyboard
  $inputName.addEventListener("keyup", function(event) {

    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {

      console.log('hago enter')
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click

      $btnPlayVideo.click();
    }
  });


  $btnPlayVideo.onclick = function() {
    var nameValue = $inputName.value;
    var videos =  $videoWraper.getElementsByClassName("video")
    showMyVideos(0,videos,nameValue);
  }


  function playMyClosingMenu() {
    playVideo($videoWraper.getElementsByClassName("closing")[0], loop=true);
    setTimeout (function () {
      $searchSection.style.display = "block";
    }, 1000);
  };



  function set_up_speech() {
    return new Promise(function(resolve, reject) {
      var synth = window.speechSynthesis;
      var voices = synth.getVoices();
      resolve(voices)
    })
  }
  set_up_speech().then(function(voices) {});


  function personalizedAudio(nameValue){

    var message = new SpeechSynthesisUtterance('Tenemos noticias importantes sobre '+ nameValue);
    var voices = speechSynthesis.getVoices();

    console.log('las voce son',voices)
    //españolas son la 0 y la 15 14 y 61 portugues
    message.voice = voices[15];
    message.rate = 1;
    message.pitch = .7;
    message.volume =2;

    speechSynthesis.speak(message);

  }

  function playMyVideo(videoContainer,personalizedVideo, nameValue, loop=false) {
    var lastVideoContainer = $videoWraper.getElementsByClassName("active")[0];
    lastVideoContainer.classList.remove("active");
    lastVideoContainer.style.display = "none";

    videoContainer.style.display = "block";
    videoContainer.classList.add("active");

    var video = videoContainer.getElementsByTagName("video")[0];
    if(personalizedVideo){
      var nameIsOnNamesArr = namesArr.includes(nameValue);
      if(nameIsOnNamesArr){
        videoContainer.getElementsByTagName("source")[0].src="videos/"+nameValue+".mp4"
        videoContainer.getElementsByTagName("source")[1].src="videos/"+nameValue+".webm"
      }else{
        // crea un nuevo div
        // y añade contenido
        var newDiv = document.createElement("div");
        var newContent = document.createTextNode(nameValue+ " es capaz de zurrarle a Chuck Norris.");
        newDiv.classList.add("js-video-text");
        newDiv.classList.add("p-5");
        newDiv.appendChild(newContent); //añade texto al div creado.
        videoContainer.prepend(newDiv);
      };
    }
    video.preload = "auto";
    video.load();
    video.play();
    video.loop = loop;

    return video;
  }

  function showMyVideos(index, videos,nameValue) {

    var personalizedVideo =false;

    if (index < (videos.length - 1)) {
      hasNextVideo = true;
    } else {
      hasNextVideo = false;
    }

    $searchSection.style.display = "none";
    $video.style.display = "block";

    if(index===0){
      personalizedAudio(nameValue);
    }


    if(index===1){
      personalizedVideo=true;
    }else{
      personalizedVideo=false
    }

    var video = playMyVideo(videos[index],personalizedVideo, nameValue);

    video.addEventListener("timeupdate", function() {
      var currentTime = (this.currentTime / this.duration) * 100;

      if (hasNextVideo && currentTime > 70) {
        nextVideo = videos[index + 1];
        nextVideoTag = nextVideo.getElementsByTagName("video")[0];
        nextVideoTag.preload = "auto";
      }
    })

    video.onended = function() {
      if (hasNextVideo) {
        showMyVideos(index+1, videos,nameValue);
      } else {
        playMyClosingMenu();
      }
    }
  }


}