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
        db.run("CREATE TABLE IF NOT EXISTS  STOCK_INFO (code varchar(6) PRIMARY KEY UNIQUE, [name] varchar(8), description varchar(8), concept TEXT, tag TEXT); ", callback);
    }


    function saveStockInfos(stocks, callback){
        fire('save',{
            fn:saveData,
            args:["STOCK_INFO", ["code", "name"], stocks, callback],
        });
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

    function saveData(table, columnNames, data, callback){
        db.serialize(function() {
            // db.exec("BEGIN");
            var sql = "INSERT OR IGNORE INTO "+table +"(" + columnNames[0] +") VALUES(?)";
            stmt = db.prepare(sql);
            var v;
            for (var index in data) {
                v = data[index][columnNames[0]];
                stmt.run([v]);
            }
            stmt.finalize(function () {
                console.info("----------------");
                updateData(table, columnNames, data, callback);
            });
        });
    }



    function updateData(table, columnNames, data, callback) {
        // var db = new sqlite3.Database(db_file,sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        // try{
            //no block and not wait to return that will be continue serialize executing
            db.serialize(function() {
                // db.exec("BEGIN");
                // db.run("BEGIN TRANSACTION");
                // var stmt = db.prepare("INSERT OR REPLACE INTO STOCK_INFO(code, name, description, concept, tag) VALUES (?,?,?,?,?);");
                var sql = " UPDATE " + table + " SET ";
                var columns =  "";
                var cs = clone(columnNames);
                var codeName = cs.shift();
                var where = " WHERE " + codeName + '=$' + codeName;
                each(cs, function (v, n, name) {
                    if(n==0){
                        columns += v + "=$" + v;

                    }
                    else{
                        columns +="," + v + "=$" + v ;
                    }
                });
                sql += columns + where;
                var stmt = db.prepare(sql);


                each(data, function (val, idx, name) {
                    var value = {};
                    each(columnNames, function (v, n) {
                        value['$'+v] = getValue(val[v],"");
                    });

                    stmt.run(value)
                })

                stmt.finalize(function (err) {
                    if(err !== null && err !== undefined) {
                        console.log("Error when trying to write user to database in finalize ! "+err);
                        db.run("ROLLBACK");
                        db.close(function(err){if(err !== null) {console.log("Close failed in in finalize "+err);}});
                    }
                    else {
                        // db.run("COMMIT");
                        // db.exec("COMMIT", function () {
                            callback(data);
                        // });


                        // db.close(function(err){if(err !== null) {console.log("Close failed in after adding user "+err);}});
                    }
                });
            });
        // }
        // finally {
            // db.close();

        // }
    }

    function getValue(s, dv) {
        return s && s!=null ? s : dv;
    }
    

    function listAllStoreInfo() {

    }

    function clone(obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];

            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
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
//                 // process.exit(0);
//             });
//         })
//
//
//     })();
/////////////////////////////////////////////////////////////////////
})();
