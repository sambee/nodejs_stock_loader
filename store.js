
//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database(':memory:');
//
//db.serialize(function() {
//    db.run("CREATE TABLE lorem (info TEXT)");
//
//    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//    for (var i = 0; i < 10; i++) {
//        stmt.run("Ipsum " + i);
//    }
//    stmt.finalize();
//
//    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//        console.log(row.id + ": " + row.info);
//    });
//});
//
//db.close();

//you may think the next step is to create this file for use.
// We could create the file and place it in a common place for use...
// or we could create the file on the fly, which sqlite3 will do for us.
// First, however, we need to check if the file exists, which will help
// us with some operations later.
var fs = require("fs");
var file = "stock.db";
var exists = fs.existsSync(file);

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
    if(!exists) {
        console.info("create table stock table.");
       // db.run("CREATE TABLE stock (id varchar(32))");
    }
});