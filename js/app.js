"use strict";

function heightToggleElement(toggler, blocks) {
    toggler.addEventListener("click", (e) => {
        e.preventDefault();
        if (blocks instanceof NodeList) {
            blocks.forEach(function (block) {
                addFunctionality(toggler, block);
            });
        } else {
            addFunctionality(toggler, blocks);
        }
    });

    function addFunctionality(toggler, block) {
        if (block.style.height === "0px" || !block.style.height) {
            block.style.height = `${block.scrollHeight}px`;
            toggler.classList.add("is-active");
            block.classList.add("is-expanded");
        } else {
            block.style.height = `${block.scrollHeight}px`;
            window.getComputedStyle(block, null).getPropertyValue("height");
            block.style.height = "0";
            toggler.classList.remove("is-active");
            block.classList.remove("is-expanded");
        }
        block.addEventListener("transitionend", () => {
            if (block.style.height !== "0px") {
                block.style.height = "auto";
            }
        });
    }
}

function initHeader() {
    const header = document.querySelector(".site-header");

    if (!header) return;

    animateHeader();
    setPaddingForPage();

    function setPaddingForPage() {
        const page = document.querySelector(".page");

        if (!page) return;

        page.style.paddingTop = `${header.clientHeight}px`;
    }

    function animateHeader() {
        let lastScrollTop = 0;

        window.addEventListener("scroll", (e) => {
            const scrollTop = document.documentElement.scrollTop;

            header.classList.remove("scroll-down");

            if (scrollTop > lastScrollTop) {
                header.classList.add("scroll-down");
            }

            lastScrollTop = scrollTop;
        });
    }
}

function initBurger() {
    const burger = document.querySelector(".site-header__burger");
    const headerPanel = document.querySelector(".site-header__panel");

    if (!burger || !headerPanel) return;

    const headerPanelClose = headerPanel.querySelector(".site-header__panel-close");

    if (headerPanelClose) initHeaderPanelClose();

    burger.addEventListener("click", (e) => {
        headerPanel.classList.add("is-active");
        document.body.classList.add("lock");
    });

    function initHeaderPanelClose() {
        headerPanelClose.addEventListener("click", (e) => {
            headerPanel.classList.remove("is-active");
            document.body.classList.remove("lock");
        });
    }
}

function initFoldedElements() {
    const foledElements = document.querySelectorAll("[data-fold]");

    if (!foledElements) return;

    foledElements.forEach((foledElement) => {
        const foledElementBtn = foledElement.querySelector("[data-fold-btn]");
        const foledElementContent = foledElement.querySelectorAll("[data-fold-content]");

        heightToggleElement(foledElementBtn, foledElementContent);
    });
}

function initPhoneMask() {
    [].forEach.call(document.querySelectorAll('[name="tel"]'), function (input) {
        var keyCode;

        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);

            var pos = this.selectionStart;

            if (pos < 3) event.preventDefault();

            var matrix = "+7 (___) ___-__-__",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i);
            }
            var reg = matrix
                .substr(0, this.value.length)
                .replace(/_+/g, function (a) {
                    return "\\d{1," + a.length + "}";
                })
                .replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || (keyCode > 47 && keyCode < 58)) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5) this.value = "";
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false);
    });
}

function initMap() {
    const map = document.querySelector(".cta__map");

    if (!map) return;

    ymaps.ready(function () {
        var myMap = new ymaps.Map(map, {
            center: [55.75582, 37.617633],
            zoom: 10,
        });

        createPlacemark(myMap, "myPlacemark_1", [55.751016, 37.677813]);
        createPlacemark(myMap, "myPlacemark_2", [55.743629, 37.403953]);
        createPlacemark(myMap, "myPlacemark_3", [55.711681, 37.730733]);

        myMap.controls.remove("trafficControl");
        myMap.controls.remove("typeSelector");
        myMap.controls.remove("fullscreenControl");
        myMap.controls.remove("rulerControl");
        myMap.controls.remove("geolocationControl");

        // if (MEDIA_QUERY_768.matches) {
        // myMap.setZoom(11);
        // }
    });

    function createPlacemark(map, markerId, coords) {
        markerId = new ymaps.Placemark(coords, null, {
            preset: "islands#blueIcon",
        });

        map.geoObjects.add(markerId);
    }
}

function initMore() {
    const moreContainers = document.querySelectorAll("[data-more]");

    if (!moreContainers) return;

    moreContainers.forEach((more) => {
        const moreItems = more.querySelectorAll("[data-more-item]");
        const moreBtn = more.querySelector("[data-more-btn]");

        let currentItems = more.dataset.more;
        let additionalItems = more.dataset.moreOpen;

        if (moreBtn) {
            moreBtn.addEventListener("click", (e) => {
                e.preventDefault();

                currentItems += additionalItems;

                const arrayMoreItems = Array.from(moreItems);
                const visibleItems = arrayMoreItems.slice(0, currentItems);

                visibleItems.forEach((item) => {
                    item.classList.add("is-visible");
                });

                if (visibleItems.length >= arrayMoreItems.length) {
                    moreBtn.classList.add("is-hidden");
                }
            });
        }
    });
}
function initVideos() {
    const videos = document.querySelectorAll(".video");

    if (!videos) return;

    videos.forEach((video) => {
        const videoItem = video.querySelector(".video__item");
        const videoBtn = video.querySelector(".video__btn");

        initVideoBtn();
        initVideoItem();

        function initVideoBtn() {
            videoBtn.addEventListener("click", (e) => {
                video.classList.remove("is-paused");
                videoItem.play();
            });
        }

        function initVideoItem() {
            videoItem.addEventListener("click", (e) => {
                video.classList.add("is-paused");
                videoItem.pause();
            });
        }
    });
}

function initCarsSlider() {
    const carsSlider = document.querySelector(".cars__slider");

    if (!carsSlider) return;

    const carsSliderSwiper = new Swiper(carsSlider, {
        loop: true,
        slidesPerView: "auto",
        spaceBetween: 31,
        grabCursor: true,
        speed: 1000,
        autoplay: {
            delay: 3000,
        },
        navigation: {
            prevEl: carsSlider.closest(".cars__body").querySelector(".arrow--prev"),
            nextEl: carsSlider.closest(".cars__body").querySelector(".arrow--next"),
        },
        pagination: {
            el: ".swiper-pagination",
            type: "bullets",
            clickable: true,
        },
    });
}

function initPopups() {
    const overlay = document.querySelector(".overlay");

    if (!overlay) return;

    initCloseModalsOnClickOverlay();

    const popups = document.querySelectorAll("[data-popup]");
    const popupBtns = document.querySelectorAll("[data-popup-btn]");

    if (!popupBtns) return;

    popupBtns.forEach((btn) => {
        const popup = overlay.querySelector(`[data-popup=${btn.dataset.popupBtn}]`);

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(popup);
        });
    });

    popups.forEach((popup) => {
        const popupCloses = popup.querySelectorAll("[data-popup-close]");

        if (popupCloses) {
            popupCloses.forEach((close) => {
                close.addEventListener("click", (e) => {
                    closeModal(popup);
                });
            });
        }
    });

    function openModal(popup) {
        overlay.classList.remove("is-hidden");
        popup.classList.remove("is-hidden");
        document.body.classList.add("lock");
    }

    function closeModal(popup) {
        overlay.classList.add("is-hidden");
        popup.classList.add("is-hidden");
        document.body.classList.remove("lock");
    }

    function initCloseModalsOnClickOverlay() {
        const overlayChilds = Array.from(overlay.querySelectorAll("*"));

        overlay.addEventListener("click", (e) => {
            const { target } = e;

            if (!contains(overlayChilds, target)) {
                if (popups) {
                    popups.forEach((popup) => {
                        closeModal(popup);
                        refreshModal(popup);
                    });
                }
                document.body.classList.remove("lock");
                overlay.classList.remove("is-visible");
            }
        });
    }
}

function contains(arr, element) {
    return arr.includes(element);
}

function initLazyload() {
    const lazyItems = document.querySelectorAll("[data-lozad]");

    if (!lazyItems) return;

    const observer = lozad(lazyItems);
    observer.observe();
}

function initSelectors() {
    const selectors = document.querySelectorAll(".selector");

    if (!selectors) return;

    selectors.forEach((selector) => {
        selector = new Selector(selector);
    });
}

window.addEventListener("DOMContentLoaded", (e) => {
    initHeader();
    initBurger();
    initFoldedElements();
    initPhoneMask();
    initMap();
    initMore();
    initVideos();
    initCarsSlider();
    initPopups();
    initLazyload();
    initSelectors();
});