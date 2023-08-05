'use strict';

const path = require('path');
const Router = require('./lib/router');

module.exports = app => {
  const router = new Router(app);

  // proxy app.router
  const rootRouter = router.namespace();
  Object.defineProperty(app, 'router', {
    get() {
      return rootRouter;
    },
  });


  /**
   * Router namespace list
   * @return {Array<Array<String | Router>>} Return Router namespace list with special prefix
   */
  app.router.routers = (...args) => {
    return router.routers;
  };


  /**
   * get sub router
   *
   * @function Router#namespace
   * @param {String} prefix - sub router prefix
   * @param {...Function} [middlewares] - optional middlewares
   * @return {Router} Return sub router with special prefix
   */

  app.router.namespace = (...args) => {
    return router.namespace(...args);
  };

  /**
   * get url by name
   */
  app.url = router.url.bind(router);

  // patch loadRouter
  // load sub routers first
  const loadRouter = app.loader.loadRouter;
  app.loader.loadRouter = function () {
    new app.loader.FileLoader({
      directory: path.join(app.baseDir, 'app/router'),
      target: {},
      inject: app,
      call: true,
    }).load();
    loadRouter.call(app.loader);
  };
};
