(function () {
    "use strict";

    var SLIDES = [
        {
            image: "images/slide-00-capital.png",
            caption: "Неизвестная столица неизвестной провинции, куда выжившие силы десятого экспедиционного полка пробиваются после катастрофы при высадке"
        },
        {
            image: "images/slide-01-quartmaster.png",
            caption: "Интендант 3 взвода ждёт ваших находок"
        },
        {
            image: "images/slide-02-barracks.png",
            caption: "Слуга императора должен хорошо отдыхать, ведь сон восстанавливает здоровье, а так же где то хранить вещи своего взвода"
        },
        {
            image: "images/slide-03-sewer.png",
            caption: "Спускаться в канализацию нужно с остородностью, они полны тварей, которые сожрут тебя раньше, чем ты успеешь пискнуть"
        }
    ];

    var INTRO_INDEX = 0;
    var SLIDE_DURATION = 9000;
    var CAPTION_DELAY = 800;
    var CAPTION_FADE_OUT = 500;

    var playlist = [];
    var playlistIndex = 0;
    var currentSlideIndex = INTRO_INDEX;
    var slideTimer = null;
    var captionTimer = null;

    var slideElements = document.querySelectorAll(".slide");
    var captionEl = document.getElementById("caption");
    var statusEl = document.getElementById("status");
    var progressEl = document.getElementById("progress");
    var serverNameEl = document.getElementById("server-name");

    function shuffle(array) {
        var result = array.slice();

        for (var i = result.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }

        return result;
    }

    function buildPlaylist() {
        var randomSlides = [];

        for (var i = 1; i < SLIDES.length; i++) {
            randomSlides.push(i);
        }

        return [INTRO_INDEX].concat(shuffle(randomSlides));
    }

    function showCaption(text) {
        captionEl.classList.remove("visible");
        clearTimeout(captionTimer);

        captionTimer = setTimeout(function () {
            captionEl.textContent = text;
            captionEl.classList.add("visible");
        }, CAPTION_DELAY);
    }

    function hideCaption() {
        captionEl.classList.remove("visible");
    }

    function goToSlide(slideIndex) {
        var prev = slideElements[currentSlideIndex];
        var next = slideElements[slideIndex];

        hideCaption();
        prev.classList.remove("active");

        next.classList.remove("active");
        void next.offsetWidth;
        next.classList.add("active");

        currentSlideIndex = slideIndex;
        showCaption(SLIDES[slideIndex].caption);
    }

    function nextSlide() {
        playlistIndex++;

        if (playlistIndex >= playlist.length) {
            playlist = buildPlaylist();
            playlistIndex = 0;
        }

        goToSlide(playlist[playlistIndex]);
        scheduleNext();
    }

    function scheduleNext() {
        clearTimeout(slideTimer);
        slideTimer = setTimeout(function () {
            hideCaption();
            setTimeout(nextSlide, CAPTION_FADE_OUT);
        }, SLIDE_DURATION);
    }

    function init() {
        playlist = buildPlaylist();
        playlistIndex = 0;
        currentSlideIndex = playlist[0];
        goToSlide(playlist[0]);
        scheduleNext();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.GameDetails = function (servername, serverurl, mapname, maxplayers, steamid, gamemode) {
        if (servername) {
            serverNameEl.textContent = servername;
        }
        if (mapname) {
            statusEl.textContent = "Карта: " + mapname;
        }
    };

    window.SetStatusChanged = function (status) {
        if (status) {
            statusEl.textContent = status;
        }
    };

    window.DownloadingFile = function (filename) {
        if (filename) {
            statusEl.textContent = "Загрузка: " + filename;
        }
    };

    window.LoadingProgressChanged = function (progress) {
        if (typeof progress === "number") {
            progressEl.style.width = Math.min(100, Math.max(0, progress)) + "%";
        }
    };
})();
