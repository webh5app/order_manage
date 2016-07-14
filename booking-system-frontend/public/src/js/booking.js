"use strict";

window.onload = function () {
    bookingSystem.init();
};

var bookingSystem = window.bookingSystem = {
    init: function init() {
        this.Util.config();
        this.Events.mountEventListeners();
    }
};
