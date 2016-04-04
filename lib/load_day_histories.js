var http = require('http');
var gs = require('nodegrass');

(function () {

    function loadData(config, parseData){
        var url = config.url;

        gs.get(url, function(data,status,headers) {
                //将data输出即使中文
                if(parseData){
                    parseData(data, config);
                }
            }, 'gbk')
            .on('error', function(e) {
                // console.log("Got error: " + e.message);
                if(failure){
                    failure(e, config.failure);
                }
            });
    };

    function parseData(data,config) {
        var code = config.code;
        var dataArray = [];
        var obj = eval(data);
        var kline = obj['data'][code]['qfqday'];
        //console.info(JSON.stringify(obj,' ',2));
        var v;
        for(var k in kline){
            v = kline[k];
            dataArray.push({
                date:v[0],
                open: v[1],
                high: v[2],
                low: v[3],
                close: v[4],
                volumn:v[5]
            }
            );
        }
        if(config.success){
            config.success(dataArray,config);
        }
    }

    function failureFN() {
        
    }

    function loadHistories(stockCode, dateFrom, dateTo, successFN, failureFN){

        if(stockCode.startsWith("0")){
            stockCode = "sz"+stockCode;
        }
        if(stockCode.startsWith("6")){
            stockCode = "sh"+stockCode;
        }
        var url = 'http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?_var=kline_dayqfq2004&param=' + stockCode +',day,'+ dateFrom +','+ dateTo+',640,qfq&r=0.14594201214508784';
        loadData({
            url:url,
            code: stockCode,
            success:successFN,
            failure:failureFN
        }, parseData);

    };

    exports.loadHistories = loadHistories;
    // load('000651', '2014-01-01', '2015-12-31');
})();