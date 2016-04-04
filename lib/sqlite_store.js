var fs = require("fs");
var db_file = "stock.db";
var db_memory = ':memory:';
var colors = require('colors');
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(db_file);

(function () {

    function saveStockInfos(stocks, callback) {

        // var db = new sqlite3.Database(db_file,sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        try{
            db.run("CREATE TABLE IF NOT EXISTS  STOCK_INFO (code varchar(6) PRIMARY KEY , [name] varchar(8), description varchar(8), concept TEXT, tag TEXT); ");

            //no block and not wait to return that will be continue serialize executing
            db.serialize(function() {
                db.exec("BEGIN");
            // db.run("BEGIN TRANSACTION");
                var stmt = db.prepare("INSERT OR REPLACE INTO STOCK_INFO(code, name, description, concept, tag) VALUES (?,?,?,?,?);");
                for (var index in stocks) {
                    var s = stocks[index];
                    stmt.run([
                        getValue(s.code,""),
                        getValue(s.name,""),
                        getValue(s.description,""),
                        getValue(s.concept,""),
                        getValue(s.tag,""),
                    ]);
                }
                stmt.finalize(function (err) {
                    if(err !== null && err !== undefined) {
                        console.log("Error when trying to write user to database in finalize ! "+err);
                        db.run("ROLLBACK");
                        db.close(function(err){if(err !== null) {console.log("Close failed in in finalize "+err);}});
                    }
                    else {
                        // db.run("COMMIT");
                        db.exec("COMMIT");
                        setTimeout(function(){
                            if (callback) {
                                callback(s)
                            };
                        },1000);

                        // db.close(function(err){if(err !== null) {console.log("Close failed in after adding user "+err);}});
                    }
               });
                // db.exec("COMMIT");
                //@see API https://github.com/mapbox/node-sqlite3/wiki/API
                // stmt.finalize(function () {
                //     var stmt1 = db.prepare("UPDATE STOCK_INFO SET name=?, description=?, href=? WHERE code=?");
                //     for (var index in stocks) {
                //         var s = stocks[index];
                //         stmt1.run(getValue(s.name,""), getValue(s.description,""), getValue(s.href,""), getValue(s.code, ""));
                //     }
                //     stmt1.finalize(function () {
                //        if(callback) {callback()};
                //     });
                // });


            });
        }
        finally {
            // db.close();

        }
    }

    function getValue(s, dv) {
        return s && s!=null ? s : dv;
    }
    

    function listAllStoreInfo() {

    }

    store = {
        saveStockInfos : saveStockInfos
    }

    exports.store =store;
/////////////////////////////////////////////////////////////////////
// (function test() {
//     console.log('==== SQLite Test Start ===='.green);
//     saveStockInfos([{
//         code:'000001',
//         name:'中文',
//         description:'',
//         href:'hhhhh'
//     }]);
//     console.log('====SQLite Test  End ===='.green);
//     //process.exit(0);
// })();
})();
