var cfg = require('./../config');
var fs = require('fs');
exports.loadData = function (key, callback) {
    var sh = cfg.getStockHome() + "/" + key + ".day";
    if (callback) {
        if (fs.existsSync(sh)) {
            var data = fs.readFileSync(sh, "utf-8");
            var obj = eval("(" +  data + ")");
            callback(obj);
        }
        else {
            callback();
        }
    }
    // console.log(data);
    // console.log("READ FILE SYNC END");
}

exports.saveData = function (key, d,  callback) {
    var sh = cfg.getStockHome() + "/" + key + ".day";
    fs.writeFileSync(sh, JSON.stringify(d,2, " "), { encoding: "utf-8" });
    if(callback){
        callback();
    }
}

