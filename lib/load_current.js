var http = require('http');
var gs = require('nodegrass');

(function () {
    /**
     * stock tools is a stock loader will load
     * in real-time and historical stock information to
     * the local system in order to carry out into the look
     * of stock analysis
     *
     *
     */

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

    function parseData(res, callback) {
        var arrayData = res.split('~');


        if (callback) {

            //@see http://blog.csdn.net/ustbhacker/article/details/8365756
            //v_sz000651="51~格力电器~000651~17.94~17.60~17.73~664886~335988~328898~17.94~51~17.93~418~17.92~783~17.91~1674~17.90~2006~17.96~62~17.97~222~17.98~317~17.99~667~18.00~822~11:11:55/17.94/282/S/506043/17184|11:11:55/17.95/28/S/50259/17176|11:11:52/17.95/111/B/199175/17171|11:11:49/17.95/78/B/139971/17161|11:11:43/17.95/27/B/48462/17152|11:11:43/17.95/43/B/77180/17146~20151023111158~0.34~1.93~18.38~17.64~17.95/662156/1198271290~664886~120317~1.11~7.62~~18.38~17.64~4.20~1071.59~1079.22~1.31~19.36~15.84~";

            var data = {
                //0 未知= "v_sz000651="51"
                //1 名字 name = "格力电器"
                name:arrayData[1],
                //2 代码 code = "000651"
                code:arrayData[2],
                //3 当前价格  Last = "18.01"
                last:arrayData[3],
                //4 昨收 = "17.60"
                //5 今开 open = "17.73"
                open:arrayData[5],
                //6 成交量（手）Volume = "693366"
                volume:arrayData[6],
                //7 外盘= "350638"
                //8 内盘= "342728"
                //9 买一= "18.00"
                buy1:arrayData[9],
                //10 买一 量= "742"
                //11 买二= "17.99"
                //12 买二 量= "217"
                //13 买三= "17.98"
                //14 买三 量= "1591"
                //15 买四= "17.97"
                //16 买四 量= "1574"
                //17 买五= "17.96"
                //18 买五 量= "129"
                //19 卖一= "18.01"
                //20 卖一 量= "863"
                //21 卖二 = "18.02"
                //22 卖二 量= "12"
                //23 卖三 = "18.03"
                //24 卖三 量= "78"
                //25 卖四 = "18.04"
                //26 卖四 量= "128"
                //27 卖五 = "18.05"
                //28 卖五 量= "315"
                //29 最近逐笔成交 = "11:29:37/18.01/137/S/246737/10059|11:29:34/18.02/78/B/140556/10054|11:29:31/18.02/185/S/332384/10052|11:29:28/18.02/155/S/279375/10047|11:29:26/18.03/6/B/10815/10044|11:29:17/18.02/138/S/248703/10034"
                //30 时间 = "20151023112938"
                //31 涨跌 = "0.41"
                //32 涨跌% = "2.33"
                //33 最高 = "18.38"
                //34 最低 = "17.64"
                //35 价格/成交量（手）/成交额= "18.03/692486/1252942644"
                //36 成交量（手）= "693366"
                //37 成交额（万） = "125453"
                //38 换手率 = "1.16"
                //39 市盈率 = "7.65"
                //40 = ""
                //41 最高 =  "18.38"
                //42 最低 =  "17.64"
                //43 振幅 =  "4.20"
                //44 = 流通市值 "1075.77"
                //45 = 总市值 "1083.43"
                //46 市净率 = "1.32"
                //47 涨停价 = "19.36"
                //48 跌停价 = "15.84"
            };

            callback(data);
        }
    }

    function failure(callback) {
        
    }

   // var url = 'http://qt.gtimg.cn/q=sz000651';
     var url = 'http://qt.gtimg.cn/q='

     function loadCurrent(stockCode,successFN, failureFN) {
         var code = stockCode;
         if(stockCode.startsWith("0")){
             code = "sz"+stockCode;
         }
         if(stockCode.startsWith("6")){
             code = "sh"+stockCode;
         }

         load({
             url:url+code,
             success:successFN,
             failure:failureFN
         }, parseData);

     }

    // function load2(){
    //     load({
    //         // url: 'http://web.ifzq.gtimg.cn/appstock/app/minute/query?_var=min_data_sz000651&code=sz000651&r=0.3749524171798464',
    //         url:'http://web.ifzq.gtimg.cn/stock/doctor/data/hqy?code=000651&_var=tempDatas',
    //     }, function (data) {
    //         var obj = eval(data);
    //         console.info(JSON.stringify(obj,' ',2));
    //
    //     })
    // };


    exports.loadCurrent = loadCurrent;

///////////////////////////////////////////////////////////
//console.info(stocks.getStock('格力电器'));

    // loadCurrent(
    //     '000651',
    //     function (res) {
    //         console.info(res);
    //         process.exit();
    //     }
    // );
})();




