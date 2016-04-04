/**
 * Created by HHF on 2016/1/22.
 */
var http = require('http')
    , gbk = require('gbk')
    //, xpath = require('xpath')
    //, dom = require('xmldom').DOMParser;
    ,cheerio = require('cheerio');

(function () {
   loader = {
        load:function(url){
            http.get(url, function(res) {
                var buffers = [], size = 0;
                res.on('data', function (buffer) {
                    buffers.push(buffer);
                    size += buffer.length;
                });
                res.on('end', function () {
                    var buffer = new Buffer(size), pos = 0;
                    for (var i = 0, l = buffers.length; i < l; i++) {
                        buffers[i].copy(buffer, pos);
                        pos += buffers[i].length;
                    }
                    var utf8String = gbk.toString('utf-8', buffer);
                    //console.log(utf8String.toString());
                    if (res.headers['content-type'].indexOf('javascript') != -1) {
                        //parseJS(utf8String.toString())
                    }
                    else {
                        loader.fireEvent('load', utf8String.toString(), res.headers['content-type'], url);
                    }

                });
            });
        }

    };

    loader.events = {
        'load': function(data, type, url){
            if('text/html' === type){
                loader.fireEvent('html', data, url);
            }
        },
        'html' : {}

    };

    loader.fireEvent = function(){
        var args = arguments;
        var arg0 = args[0];
        var hanlders = loader.events[arg0];
        var params = [];
        for( var i=1; i<arguments.length; i++ ) {
            params.push(args[i]);
        }
        if(hanlders){
            if(Array.isArray(hanlders)){
                for(var key in hanlders){
                    var f =hanlders[key];
                    if(isFunction(f)){
                        f.apply(loader.fireEvent, params);
                    }

                }
            }
            else{
                if(isFunction(hanlders)){
                    hanlders.apply(loader.fireEvent, params)
                };
            }


        }
    };

    loader.on =function(action, callback){
        if(!callback){
            return;
        }
        var handlers = loader.events[action];
        if(!handlers){
            handlers = [];
        }
        else{
            //convert to array.
            if(Array.isArray(handlers) === false){
                handlers = [handlers];
            }
        }
        handlers.push(callback);
        loader.events[action] = handlers;
    };

    isFunction = function(v){
        return typeof v === "function";
    };

    var urls = [
        'http://quote.eastmoney.com/stocklist.html'
    ];

//only implement if no native implementation is available
    if (typeof Array.isArray === 'undefined') {
        Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    };


     function getName(str) {
         var pos = str.indexOf("(");
         if(pos>0){
             return str.substring(0,pos);
         }
         return "";

     }
    
    function getCode(str) {
        var pos = str.indexOf("(");
        if(pos>0){
            return str.substring(pos+1, str.indexOf(")"));
        }
        return "";
    }
    
    loader.loadAll = function (callback) {
        loader.on('html', function(data, url){
            console.info("=======" + url);
            // console.info("=======\n" + data);
            //var doc = new dom().parseFromString(data)
            //var nodes = xpath.select("//title", doc)
            $ = cheerio.load(data);
            var arrayData = [];
          $('ul li > a').each(function(i, e) {
              var str = $(e).text();
              var href = $(e).attr('href');
                // console.log(str + "  " + href );
              if( str.length>0){
                  var code = getCode(str);
                  if(code && code.length>0){
                      arrayData.push({
                          code:code,
                          name:getName(str),
                          href:href
                      })
                  }
              }
            });

            if(callback){
                callback(arrayData, url)
            }

        });
        for(index in urls){
             loader.load(urls[index]);
        }
    };

    exports.loader = loader;
///////////////////////////////////////////////////////////////////////////
//test
// (function test(){
//     console.info("============ Load all stocks starting ========");
//

//     for(index in urls){
//         loader.load(urls[index]);
//     }
//
//
// })();


})();


