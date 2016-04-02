var stock = require("./lib/stock_loader").sstock;

function loadDataProxy(data) {
    console.info(data);
    stock.getStore().addStoreInfos(data);
}
stock.loadAll(loadDataProxy);

