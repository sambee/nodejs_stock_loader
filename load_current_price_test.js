var stock = require("./lib/stock_loader").sstock;
var colors = require('colors');

var code = "600383";
function successFN(data) {
    console.info(data);
    stock.saveStockInfos(data, function () {
        console.info("==== DONE ====");
        process.exit(0);
    });

}
stock.loadCurrent(code, successFN);
