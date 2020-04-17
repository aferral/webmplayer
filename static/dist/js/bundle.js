(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var toggles = document.querySelectorAll('.dropdown-toggle');
var dropdowns = [];

var hasClass = function (el, cl) {
	return (el.classList.toString().indexOf(cl) > -1) ? true : false;
}

if (toggles) {
	toggles.forEach(function (toggle) {
		toggle.addEventListener('click', function (e) {

			e.stopPropagation();
			
			var target = this.getAttribute('data-dropdown');
			if (!target) return false;

			var dropdown = document.querySelector('#' + target);
			if (!dropdown) return false;

			if (hasClass(dropdown, 'is-active')) {
				dropdown.classList.remove('is-active');
			} else {
				dropdown.classList.add('is-active');
				dropdowns.push(dropdown);
				dropdown.addEventListener('click', function (e) {
					e.stopPropagation();
				}, false);
			}

		}, false);
	});

	document.body.addEventListener('click', function () {

		dropdowns.forEach(function (dropdown) {
			if (hasClass(dropdown, 'is-active')) {
				dropdown.classList.remove('is-active');
				dropdowns.splice(dropdowns.indexOf(dropdown), 1);
			}
		});

	}, false);

}
},{}],2:[function(require,module,exports){
var timeHelper = require('../helpers/time');
var env_vars = require('../env.js');


var audio           = document.querySelector("#player"),
    btnPlay         = document.querySelector("#btn-play"),
    btnPause        = document.querySelector("#btn-pause"),
    btnPrev         = document.querySelector("#prev"),
    btnNext         = document.querySelector("#next"),
    btnRepeat       = document.querySelector("#repeat"),
    btnRandom       = document.querySelector("#random"),
    volumeControl   = document.querySelector("#volume"),
    timeLine        = document.querySelector("#timeline"),
    musicTimeCount  = document.querySelector("#time-count"),
    musicTime       = document.querySelector("#time"),
    musicName       = document.querySelector("#music-name"),
    playListElement = document.querySelector("#play-list"),
    loading         = document.querySelector("#loading-music"),
    flip            = document.querySelector("#flip-container"),
    rd              = new FileReader();

var Player = {
    currentTrack : 0,
    isPlaying    : false,
    isRepeating  : false,
    isRandomized : false,
    playList     : []
};

var setPlayList = function (x) {
    Player.playList.push(x);
}

var activateListItem = function (id) {
    document.querySelector("#list-item-" + id).classList.add("is-active");
    document.querySelector("#list-icon-" + id).classList.add("is-active");
}

var inactivateListItem = function (id) {
    document.querySelector("#list-item-" + id).classList.remove("is-active");
    document.querySelector("#list-icon-" + id).classList.remove("is-active");
}

var clearPlayList = function () {
    Player.playList = [];
}

var showLoading = function () {
    loading.classList.add("show");
};

var hideLoading = function () {
    loading.classList.remove("show");
};

var playMusic = function (track) {
    
	var temp_obj = Player.playList[track]
	var name = temp_obj.Band+" "+temp_obj.Album+" "+temp_obj.Song;
	var url_full = env_vars.API_URL+'/download/'+temp_obj.id_drive

    audio.onloadeddata = function() {
        
        audio.play();
        
        flip.classList.add('is-flipped');
        if (Player.currentTrack > -1) {
           inactivateListItem(Player.currentTrack);
        }
        
        activateListItem(track);
        
        Player.isPlaying = true;
        Player.currentTrack = track;
        
        hideLoading();


        setMusicName(name);
        setTimeLineMax(this.duration);
        setMusicTime(this.duration);
    };
	audio.src = url_full;
    
};

var pause = function () {
    
    if (audio.src == "") return false;

    flip.classList.remove('is-flipped');
    inactivateListItem(Player.currentTrack);
    
    Player.isPlaying = false;
    audio.pause();
    
};

var resume = function () {
    
    if (audio.src == "") return false;

    flip.classList.add('is-flipped');
    activateListItem(Player.currentTrack);
    
    Player.isPlaying = true;
    audio.play();
    
}

var playPrev = function () {
    
    if (audio.src == "") return false;
    
    var prev = Player.currentTrack - 1;
    (prev > -1) ? playMusic(prev) : playMusic(0);
    
};

var playNext = function () {
    
    if (audio.src == "") return false;
    
    var next      = Player.currentTrack + 1;
    var lastMusic = Player.playList.length - 1;
    var random    = Math.round( Math.random() * lastMusic );

    if (!Player.isRandomized) {
        (next <= lastMusic) ? playMusic(next) : playMusic(0);
    } else {
        playMusic(random);
    }
    
};

var repeat = function () {
    if (!Player.isRepeating) {
        btnRepeat.classList.add('is-on');
        audio.setAttribute("loop", "");
        Player.isRepeating = true;
    } else {
        btnRepeat.classList.remove('is-on');
        audio.removeAttribute("loop");
        Player.isRepeating = false;
    }
};

var randomize = function () {
    if (!Player.isRandomized) {
        btnRandom.classList.add('is-on');
        Player.isRandomized = true;
    } else {
        btnRandom.classList.remove('is-on');
        Player.isRandomized = false;
    }
};

var changeVolume = function () {
    audio.volume = volumeControl.value / 10;
};

var changeTime = function () {
    if (audio.readyState != 0) audio.currentTime = timeLine.value;
};

var timeLineUpdate = function () {
    timeLine.value = audio.currentTime;
};

var setTimeLineMax = function (time) {
    timeLine.setAttribute( "max", Math.round(time) );
};

var setMusicTime = function (time) {
    musicTime.innerHTML = timeHelper.secondsToTime( Math.round(time) );
};

var musicCountUpdate = function (time) {
    musicTimeCount.innerHTML = timeHelper.secondsToTime( Math.round(time) );
};

var setMusicName = function (name) {
    musicName.innerHTML = name.replace(".mp3", "");
};

var createPlayList = function () {
    
    var musicName, i, li, button, span,
        len = Player.playList.length;

    playListElement.innerHTML = "";

    for (i = 0; i < len; i += 1) {
	
	var temp_obj = Player.playList[i]
	var name = temp_obj.Band+"--"+temp_obj.Album+"--"+temp_obj.Song;
        
        musicName = document.createTextNode(name);

        li     = document.createElement("li");
        button = document.createElement("button");
        span   = document.createElement("span");

        button.setAttribute("type", "button");
        button.setAttribute("class", "btn btn-circle btn-small");
        button.innerHTML = '<i class="icon icon-play"></i>';
        
        (function (id) {
            button.addEventListener('click', function () { 
                playMusic(id);
            }, false);
        })(i);

        span.setAttribute("id", "list-icon-"+i);
        span.setAttribute("class", "sound-wave");
        span.innerHTML = "<span class='bar'></span><span class='bar'></span><span class='bar'></span>";
    
        li.setAttribute("id", "list-item-"+i);
        li.setAttribute("class", "list-item");
        li.appendChild(button);
        li.appendChild(musicName);
        li.appendChild(span);
        playListElement.appendChild(li);

    };
};

//botões
btnPlay.addEventListener("click", resume, false);
btnPause.addEventListener("click", pause, false);
btnPrev.addEventListener("click", playPrev, false);
btnNext.addEventListener("click", playNext, false);
btnRepeat.addEventListener("click", repeat, false);
btnRandom.addEventListener("click", randomize, false);

//volume
volumeControl.addEventListener("change", changeVolume, false);

//timeLine
timeLine.addEventListener("change", changeTime, false);
timeLine.addEventListener("mousedown", function() {
    audio.removeEventListener("timeupdate", timeLineUpdate);
}, false);
timeLine.addEventListener("mouseup", function() {
    audio.addEventListener("timeupdate", timeLineUpdate, false);
}, false);

//player
audio.addEventListener("ended", playNext, false);
audio.addEventListener("timeupdate", timeLineUpdate, false);
audio.addEventListener("timeupdate", function() { 
    musicCountUpdate( Math.floor(this.currentTime) );
}, false);

module.exports = {
    setPlayList: setPlayList,
    clearPlayList: clearPlayList,
    playMusic: playMusic,
    createPlayList: createPlayList
}

},{"../env.js":3,"../helpers/time":4}],3:[function(require,module,exports){
var env = {
  API_URL: 'http://ec2-3-15-227-224.us-east-2.compute.amazonaws.com:9999',
}
module.exports = env;

},{}],4:[function(require,module,exports){
function padLeft(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var secondsToTime = function (seconds) {

  if (isNaN(seconds) || seconds == "" || typeof seconds != 'number') return "00:00";

  var hours   = parseInt( seconds / 3600 ) % 24,
      minutes = parseInt( seconds / 60 ) % 60,
      seconds = parseInt( seconds % 60);

  if (hours > 0) {
    var result = padLeft(hours, 2, 0) + ':' + padLeft(minutes, 2, 0) + ':' + padLeft(seconds, 2, 0);
  } else {
    var result = padLeft(minutes, 2, 0) + ':' + padLeft(seconds, 2, 0);
  }

  return result;

};

module.exports = {
  secondsToTime: secondsToTime
}
},{}],5:[function(require,module,exports){
require('./components/dropdown.js');

var Player = require('./components/player.js');
var env_vars = require('./env.js');


(function () {
    
    var btnUpload   = document.querySelector("#btn-upload"),
        themeLight  = document.querySelector("#theme-light"),
        themeDark   = document.querySelector("#theme-dark"),
        btnsTheme   = document.querySelectorAll('.theme-item-btn'),
        btnsColor   = document.querySelectorAll('.btn-color'),
        
        setLocalStorage = function (item, value) {
            if (window.hasOwnProperty('localStorage')) {
                localStorage.setItem(item, value);
            }
        },

        getLocalStorage = function (item) {
            if (window.hasOwnProperty('localStorage')) {
                return localStorage.getItem(item);
            }
        },

        setTheme = function (theme) {
            
            theme = theme || "light";
            document.body.classList.remove('dark', 'light');
            document.body.classList.add(theme);
            setLocalStorage("theme", theme);
            
        },

        setColor = function (color) {

            color = color || "green";
            document.body.className = document.body.className.replace(/(blue|red|green|pink|purple|cyan|teal|yellow|orange)/g, '');
            document.body.classList.add(color);
            setLocalStorage("color", color);

        };

    if (window.hasOwnProperty('localStorage')) {
        setTheme(getLocalStorage('theme'));
        setColor(getLocalStorage('color'));
    }

    btnUpload.addEventListener("click", function (e) {
        
        e.stopPropagation();
        e.preventDefault();
        
        
	Player.clearPlayList();

	var request2 = new Request(env_vars.API_URL+'/list');fetch(request2)
	  .then(response => {
	    if (response.status === 200) {
	      return response.json();
	    } else {
	      throw new Error('Something went wrong on api server!');
	    }
	  })
	  .then(response => {
	    console.debug(response);
		  for (var elem of response){
			Player.setPlayList(elem)
		  }
        	Player.createPlayList();
        	Player.playMusic(0);
	  }).catch(error => {
	    console.error(error);
	  });

        
    }, false);


    btnsTheme.forEach(function (btnTheme) {
        btnTheme.addEventListener('click', function () {
            var themeScheme = this.getAttribute('data-theme-scheme');
            setTheme(themeScheme);
        }, false);
    });

    btnsColor.forEach(function (btnColor) {
        btnColor.addEventListener('click', function () {
            var color = this.getAttribute('data-theme-color');
            setColor(color);
        }, false);
    });

}());

},{"./components/dropdown.js":1,"./components/player.js":2,"./env.js":3}],6:[function(require,module,exports){
require('./index.js');
},{"./index.js":5}]},{},[6])
//# sourceMappingURL=bundle.map.js
