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
