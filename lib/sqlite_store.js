var fs = require("fs");
var db_file = "stock.db";
var db_memory = ':memory:';
var colors = require('colors');
var sqlite3 = require("sqlite3").verbose();


(function () {

    
    function addStoreInfos(stocks) {
        var db = new sqlite3.Database(db_file);
        try{
            db.run("CREATE TABLE IF NOT EXISTS  STOCK_INFO (code varchar(6), [name] varchar(8), description varchar(8), href TEXT); ");

            //no block and not wait to return that will be continue serialize executing
            db.serialize(function() {
                var stmt = db.prepare("INSERT OR IGNORE INTO STOCK_INFO(code) VALUES (?);");
                for (var index in stocks) {
                    var s = stocks[index];
                    stmt.run(s.code);
                }
                //@see API https://github.com/mapbox/node-sqlite3/wiki/API
                stmt.finalize(function () {
                    var stmt1 = db.prepare("UPDATE STOCK_INFO SET name=?, description=?, href=? WHERE code=?");
                    for (var index in stocks) {
                        var s = stocks[index];
                        stmt1.run(s.name, s.description, s.href, s.code);
                    }
                    stmt1.finalize();
                });

            });


        }
        finally {
            db.close();

        }
    }

    function getValue(s, dv) {
        return s && s!=null ? s : dv;
    }
    
    function addStoreInfo(stock) {
        db = new sqlite3.Database(db_file);
        var s = stock;
        try{
            db.run("CREATE TABLE IF NOT EXISTS  STOCK_INFO (code varchar(6), [name] varchar(8), description varchar(8), href TEXT)");
            db.serialize(function() {

                var stmt = db.prepare("INSERT INTO STOCK_INFO(code, name, description,href) VALUES (?,?,?,?)");
                stmt.run(
                    getValue(s.code, ""),
                    getValue(s.name, ""),
                    getValue(s.description, ""),
                    getValue(s.href, "")

                )
                stmt.finalize();
            });

        }
        finally {
            db.close();
        }
    }

    function listAllStoreInfo() {

    }

    store = {
        addStoreInfo : addStoreInfo,
        addStoreInfos : addStoreInfos
    }

    exports.store =store;

(function test() {
    console.log('==== Start ===='.green);
    addStoreInfos([{
        code:'000001',
        name:'中文',
        description:'',
        href:'hhhhh'
    }]);
    console.log('==== End ===='.green);
    //process.exit(0);
})();
})();
