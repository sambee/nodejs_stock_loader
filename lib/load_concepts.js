var http = require('http');
var gbk = require('gbk');
var cheerio = require('cheerio');
var exec = require('child_process').exec;

(function () {

//概念(concept) 接口
    var concept_url = "http://stock.jrj.com.cn/concept/conceptCode.js";
    var base_url =  'http://stock.jrj.com.cn/concept/conceptdetail/conceptStock_{0}.js';

//V1 method
// String.prototype.format = function()
// {
//     var args = arguments;
//     return this.replace(/\{(\d+)\}/g,
//         function(m,i){
//             return args[i];
//         });
// }



//V2 static
    String.format = function() {
        if( arguments.length == 0 )
            return null;

        var str = arguments[0];
        for(var i=1;i<arguments.length;i++) {
            var re = new RegExp('\\{' + (i-1) + '\\}','gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    }

    function parseJS(jsonStr, callback){
        //console.info("===============START========================"),
        //console.info(jsonStr),
        //console.info("===============END========================");
        var pos = jsonStr.indexOf("=");
        var _temp = "("+ jsonStr.substring(pos+1, jsonStr.length-1) + ")";

        var data = eval(_temp);
        var stockData = data.stockData;

        if(callback){
            var array = [];
            for(var idx in stockData){
                var item  = stockData[idx];
                array.push({
                    code:item[0],
                    name:item[1],
                    description:item[2],
                    concept:item[3]
                });
            }
            callback(array);
        }
        //exec("BalloonTip.exe 更新完成 温馨提示 10000 1")
    }

    function failure(res) {
        console.error(res);
        process.exit(0);
    }
    function load(url, successFN, callback){
        console.info("Get url "+url);
        var request = http.get(url, function(res) {
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
                var contentType = res.headers['content-type'];
                if(contentType && contentType.length>0 && contentType.indexOf('javascript')!=-1){
                    if(successFN){
                        successFN(utf8String.toString(),callback);
                    }

                }

            });
        }, failure);

        request.setTimeout( 10000, function( ) {
            console.error("--------- Timeout ---------");
            process.exit(0);
        });
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

    function loadConcept(config){
        load(concept_url, function (res) {
            var concepts  = eval(res.substring(4));
            var item;
            for(index in concepts) {
                item = concepts[index];
                item.url = String.format(base_url, item.code);
                item.index = parseInt(index);
                item.count = parseInt(concepts.length);
                };


            var index = 0;
            var url = concepts[index].url;
            var callback = function (arrayData) {
                if(config.success){
                    config.success(clone(concepts[index]), arrayData);
                }

                if(index < concepts.length-1){
                    // console.info("[------->]" + index + "/" + concepts.length);
                    url = concepts[++index].url;
                    // console.info("-----> LOAD URL " + url);
                    load(url, parseJS, callback, index)
                }
            };
            // console.info("-----> LOAD URL " + url);
            load(url, parseJS, callback, concepts[index]);

        });
    }

    exports.loadConcept = loadConcept;

    // loadConcept(function (data, config) {
    //     //console.info(data,config);
    // });
})();

