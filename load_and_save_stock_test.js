var stock = require("./lib/stock_loader").sstock;
var colors = require('colors');

function loadDataProxy(data) {
    console.info(data);
    stock.saveStockInfos(data, function () {
        console.info("==== DONE ====");
        process.exit(0);
    });

}
stock.loadStockInfos(loadDataProxy);

