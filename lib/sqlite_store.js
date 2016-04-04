var fs = require("fs");
var db_file = "stock.db";
var db_memory = ':memory:';
var colors = require('colors');
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(db_file);

//sqlite3 api help
//https://github.com/mapbox/node-sqlite3/wiki/API
(function () {

    var handers = [];
    var events = {};

    function fire(action, config) {
        if('save' == action){
            handers.push(config);
            if(handers.length == 1){
                fire('fire');
            }
        }
        if('fire' == action){
            if(handers.length >0) {
                var handler = handers.shift();
                handler.fn.apply(this,handler.args);
            }
        }
    }

    function setup(callback){
        db.run("CREATE TABLE IF NOT EXISTS  STOCK_INFO (code varchar(6) PRIMARY KEY , [name] varchar(8), description varchar(8), concept TEXT, tag TEXT); ", callback);
    }


    function saveStockInfos(stocks, callback){
        saveData("STOCK_INFO", ["code", "name"], stocks, callback);
    }

    function saveStockConcepts(stocks, callback) {
        fire('save',{
            fn:saveData,
            args:["STOCK_INFO", ["code", "description","concept",'tag'], stocks, callback],
        });
    }

    function  each(array, fn) {
        var i=0;
        for(index in array){
            fn(array[index], i++, index);
        }
    }

    function saveData(table, columnNames, data, callback) {
        // var db = new sqlite3.Database(db_file,sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        try{
            //no block and not wait to return that will be continue serialize executing
            db.serialize(function() {
                db.exec("BEGIN");
                // db.run("BEGIN TRANSACTION");
                // var stmt = db.prepare("INSERT OR REPLACE INTO STOCK_INFO(code, name, description, concept, tag) VALUES (?,?,?,?,?);");
                var sql = " REPLACE INTO " + table + "(";
                var columns =  "";
                var values = "";
                each(columnNames, function (v, n, name) {
                    if(n==0){
                        columns += v;
                        values +="$" + v;
                    }
                    else{
                        columns +="," + v ;
                        values +=",$" + v ;
                    }
                });
                sql += columns + ") VALUES(" + values + ")";
                var stmt = db.prepare(sql);
                var value;
                for (var index in data) {
                    var s = data[index];
                    value = {};
                    each(columnNames, function (v, n) {
                        value['$'+v] = getValue(s[v],"");
                    });
                    db.run(sql, value)
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
        saveStockInfos : saveStockInfos,
        saveStockConcepts : saveStockConcepts,
        setup:setup
    }

    exports.store =store;
/////////////////////////////////////////////////////////////////////
//     (function test() {
//         console.log('==== SQLite Test Start ===='.green);
//         setup(function () {
//             saveStockInfos([{
//                 code:'000001',
//                 name:'中文',
//                 description:'',
//                 href:'hhhhh'
//             }], function () {
//                 console.log('====SQLite Test  End ===='.green);
//                 process.exit(0);
//             });
//         })
//
//
//     })();
/////////////////////////////////////////////////////////////////////
})();
