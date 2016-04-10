var fs = require("fs");


exports.getUserHome =  function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

exports.getStockHome =  function getUserHome() {
    return path ;
}

exports.loadModel = function (modelName){
    return cfg["modules"][modelName];
};

var cfg = {
    userId:"",
    userName:"",
    email:"",
    emailPassword:"",
    modules:{
        history : "./../loader/load_day_histories_store"
    }
};
var path =exports.getUserHome() + "/.sambee_stock";
var dataPath =  path + "/config.json";
var exist= fs.existsSync(path);
if(!exist){
    fs.mkdirSync(path);
}
exist= fs.existsSync(dataPath);
if(!exist){
    fs.appendFileSync(dataPath, JSON.stringify(cfg, 2, " "));
}
else{
    var data=fs.readFileSync(dataPath,"utf-8");
    var obj = eval("(" +data + ")");
    cfg = obj;
}