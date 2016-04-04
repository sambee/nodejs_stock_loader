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
    console.info(request.name + "["  + isLast+"]" +  idx + "/" + count  + " "+ url);
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
    stock.saveStockInfos(responseArrayData, function (savedData) {
       // console.info(JSON.stringify(savedData));
        console.info("saved--->" + JSON.stringify(savedData));
        if(isLast == true){
            process.exit(0);
        }

    });
}

stock.loadConcepts({
    success: loadDataProxy
});

// loadDataProxy({
//     code:'1',
//     name:'中文',
//     description:'',
//     href:'hhhhh'
// }, {isLast:false});
//
// loadDataProxy({
//     code:'2',
//     name:'中文123',
//     description:'',
//     href:'hhhhh'
// }, {isLast:false});
//
// loadDataProxy({
//     code:'3',
//     name:'中文333333',
//     description:'',
//     href:'hhhhh'
// }, {isLast:true});