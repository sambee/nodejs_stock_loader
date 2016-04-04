var stock = require("./lib/stock_loader").sstock;
var colors = require('colors');



function  each(array, fn) {
 for(index in array){
     fn(array[index], index);
 }
}

function loadDataProxy(request, responseArrayData) {
    var req = request;
    var idx = request.index;
    var count = request.count;
    var url = request.url;
    var isLast = (idx+1 == count);
    // console.info(request.name + "["  + isLast+"]" +  idx + "/" + count  + " "+ url);
    each(responseArrayData, function (data, index) {

        data.tag = req.name;
        var str = "";
        each(data.concept, function (d, id) {
            if(id==0){
                str = d[1] ;
            }
            else{
                str += "," + d[1] ;
            }
        });
        data.concept = str;
    })
    stock.saveStockConcepts(responseArrayData, function (data) {

        console.info("saved--->" + isLast +" " +idx + "/" + count + JSON.stringify(data));
        if(isLast == true){
           // process.exit(0);
            console.info("All data has been saved");
        }

    });
}

stock.loadConcepts({
    success: loadDataProxy
});

