var http = require('http');
var gbk = require('gbk');
var cheerio = require('cheerio');
var exec = require('child_process').exec;
var urls = [
    //'http://stock.jrj.com.cn/concept/conceptdetail/conceptDetail_yy.shtml'
    'http://stock.jrj.com.cn/concept/conceptdetail/conceptStock_yy.js'
];

function parseHTML(html){
    console.info("======================================="),
    console.info(html),
    console.info("=======================================");

   // var $ = cheerio.load(html);
   //var objs = $('#stockTbody').children('tr').length;
   //console.info(objs);

}

function parseJS(jsonStr){
    //console.info("===============START========================"),
    //console.info(jsonStr),
    //console.info("===============END========================");
    var pos = jsonStr.indexOf("=");
    var _temp = "("+ jsonStr.substring(pos+1, jsonStr.length-1) + ")";
    //console.info(_temp);
   var data = eval(_temp);
    var stockData = data.stockData;
    //console.info(json);
    for(var idx in stockData){
        var item  = stockData[idx];
        console.info(item);
    }
    exec("BalloonTip.exe 更新完成 温馨提示 10000 1")
}

for(var index in urls){
    http.get(urls[index], function(res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //res.setEncoding('utf8');
        var buffers = [], size = 0;
        res.on('data', function (buffer) {
            buffers.push(buffer);
            size += buffer.length;
        });
        res.on('end', function() {
            var buffer = new Buffer(size), pos = 0;
            for(var i = 0, l = buffers.length; i < l; i++) {
                buffers[i].copy(buffer, pos);
                pos += buffers[i].length;
            }
            var utf8String = gbk.toString('utf-8', buffer);
            //console.log(utf8String.toString());
            if(res.headers['content-type'].indexOf('javascript')!=-1){
                parseJS(utf8String.toString())
            }

        });
    });
}
