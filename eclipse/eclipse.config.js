(() => { // webpackBootstrap
var __webpack_modules__ = ({});
/************************************************************************/
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

/************************************************************************/
// webpack/runtime/rspack_version
(() => {
__webpack_require__.rv = () => ("1.4.10")
})();
// webpack/runtime/rspack_unique_id
(() => {
__webpack_require__.ruid = "bundler=rspack@1.4.10";

})();
/************************************************************************/

/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
self.__eclipse$config = {
    prefix: "/eclipse/",
    codec: self.__eclipse$codecs.xor,
    codecs: "/eclipse/eclipse.codecs.js",
    config: "/eclipse/eclipse.config.js",
    rewrite: "/eclipse/eclipse.rewrite.js",
    worker: "/eclipse/eclipse.worker.js",
    client: "/eclipse/eclipse.client.js"
};

})()
;
//# sourceMappingURL=eclipse.config.js.map