(function (global) {
  "use strict";

  global.addEventListener("DOMContentLoaded", function () {
    const root = document.querySelector("#reservation-app");
    if (root) {
      global.gymReservationApp = global.GymUI.create(root, global.GymData.createInitialState());
    }
  });
})(window);