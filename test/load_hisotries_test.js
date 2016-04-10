var stock = require("./../lib/stock_loader").sstock;
var colors = require('colors');

var code = "600383";
var dateFrom = '2014-01-01';
var dateTo = '2016-04-01';

function successFN(data) {
    console.info(data);
    stock.saveStockInfos(data, function () {
        console.info("==== DONE ====");
        process.exit(0);
    });
}

stock.loadHistories(code, dateFrom, dateTo, successFN);