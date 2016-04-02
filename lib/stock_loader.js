var loader = require('./load_all_stock_info').loader;
var store = require('./sqlite_store').store;
(function () {

    store.ensureTableExist();
    sstock = {
        loadAll:loader.loadAll,
        getStore:function(){return store;}
    }
    exports.sstock = sstock;

})();
