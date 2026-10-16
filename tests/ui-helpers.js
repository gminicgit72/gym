(function (global) {
  "use strict";

  function withTestApp(run, initialState) {
    const root = document.createElement("div");
    root.className = "test-mount";
    document.body.appendChild(root);
    const app = global.GymUI.create(root, initialState || global.GymData.createInitialState());
    try {
      return run(app, root);
    } finally {
      app.destroy();
      root.remove();
    }
  }

  global.GymUITestHelpers = Object.freeze({ withTestApp: withTestApp });
})(window);