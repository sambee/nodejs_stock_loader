var http = require('http');
var gs = require('nodegrass');

(function () {

    function load(config, parseData){
        var url = config.url;

        gs.get(url, function(data,status,headers) {
                //将data输出即使中文
                if(parseData){
                    parseData(data, config. parseData);
                }
            }, 'gbk')
            .on('error', function(e) {
                // console.log("Got error: " + e.message);
                if(failure){
                    failure(e, config.failure);
                }
            });
    };


    function load2(){
        load({
            url: 'http://web.ifzq.gtimg.cn/appstock/app/minute/query?_var=min_data_sz000651&code=sz000651&r=0.3749524171798464',
            // url:'http://web.ifzq.gtimg.cn/stock/doctor/data/hqy?code=000651&_var=tempDatas',
        }, function (data) {
            var obj = eval(data);
            console.info(JSON.stringify(obj,' ',2));

        })
    };

    load2();
})();