var stocks_loader = require('./load_all_stocks').loader;
var db_store = require('./sqlite_store').store;
var current = require('./load_current');
var history = require('./load_day_histories');
var concepts = require('./load_concepts');
(function () {
    db_store.setup();
    sstock = {
        loadStockInfos:function(callback){stocks_loader.loadAll(callback);},
        saveStockInfos:function(data, callback){return db_store.saveStockInfos(data, callback);},
        saveStockConcepts:function (data, callback) {return db_store.saveStockConcepts(data, callback);},
        loadCurrent:function (code, succesFN) {current.loadCurrent(code,succesFN)},
        loadHistories: function(code, dateFrom,dateTo,successFN) {history.loadHistories(code,dateFrom, dateTo, successFN)},
        loadConcepts:function (successFN) {concepts.loadConcept(successFN)}
     }
    exports.sstock = sstock;

})();
