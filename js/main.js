(function () {
    "use strict";

    var SLIDES = [
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

    var SLIDE_DURATION = 9000;
    var CAPTION_DELAY = 800;
    var CAPTION_FADE_OUT = 500;

    var currentIndex = 0;
    var slideTimer = null;
    var captionTimer = null;

    var slides = document.querySelectorAll(".slide");
    var captionEl = document.getElementById("caption");
    var statusEl = document.getElementById("status");
    var progressEl = document.getElementById("progress");
    var serverNameEl = document.getElementById("server-name");

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

    function goToSlide(index) {
        var prev = slides[currentIndex];
        var next = slides[index];

        hideCaption();

        prev.classList.remove("active");

        next.classList.remove("active");
        void next.offsetWidth;
        next.classList.add("active");

        currentIndex = index;
        showCaption(SLIDES[index].caption);
    }

    function nextSlide() {
        var next = (currentIndex + 1) % SLIDES.length;
        goToSlide(next);
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
        showCaption(SLIDES[0].caption);
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
