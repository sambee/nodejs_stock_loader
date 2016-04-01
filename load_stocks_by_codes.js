var http = require('http');
var gs = require('nodegrass');


function reload(){
    var url = 'http://qt.gtimg.cn/q=s_sh601857,s_sh600005,s_sh601919,s_sh600050,s_sz000002,s_sh601398,s_sh601600';

    //http.get(url, function(res) {
    //console.log("Got response: " + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    //  //res.setEncoding('gb2312');
    //  res.on('data', function (chunk) {
    //      console.log('BODY: ' + chunk);
    //	//setTimeout(reload, 1000);
    //  });
    //}, 'gbk').on('error', function(e) {
    //  console.log("Got error: " + e.message);
    //});


    gs.get(url, function(data,status,headers){
        console.log(data);//将data输出即使中文

    }, 'gbk').on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

reload();