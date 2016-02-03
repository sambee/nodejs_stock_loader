/**
 * Created by HHF on 2016/1/22.
 */
var http = require('http')
    , gbk = require('gbk')
    //, xpath = require('xpath')
    //, dom = require('xmldom').DOMParser;
    ,cheerio = require('cheerio');
var SStock = {};

SStock.loader = {
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
                    SStock.fireEvent('load', utf8String.toString(), res.headers['content-type'], url);
                }

            });
        });
    }

};

SStock.events = {
    'load': function(data, type, url){
        if('text/html' === type){
            SStock.fireEvent('html', data, url);
        }
    },
    'html' : {}

};
SStock.fireEvent = function(){
    var args = arguments;
    var arg0 = args[0];
    var hanlders = SStock.events[arg0];
    var params = [];
    for( var i=1; i<arguments.length; i++ ) {
        params.push(args[i]);
    }
    if(hanlders){
        if(Array.isArray(hanlders)){
            for(var key in hanlders){
                var f =hanlders[key];
                if(SStock.isFunction(f)){
                    f.apply(SStock.fireEvent, params);
                }

            }
        }
        else{
            if(SStock.isFunction(hanlders)){
                hanlders.apply(SStock.fireEvent, params)
            };
        }


    }
};

SStock.on =function(action, callback){
    if(!callback){
        return;
    }
    var handlers = SStock.events[action];
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
    SStock.events[action] = handlers;
}

SStock.isFunction = function(v){
    return typeof v === "function";
}

var urls = [
    'http://quote.eastmoney.com/stocklist.html'
];

//only implement if no native implementation is available
if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
};

///////////////////////////////////////////////////////////////////////////
//test
(function test(){
    console.info("============ Load all stocks starting ========");

    SStock.on('html', function(data, url){
        console.info("=======" + url);
        console.info("=======\n" + data);
        //var doc = new dom().parseFromString(data)
        //var nodes = xpath.select("//title", doc)


        $ = cheerio.load(data);
      $('ul li > a').each(function(i, e) {
            console.log($(e).text()  + "  " + $(e).attr('href') );
        });
    });
    for(index in urls){
        SStock.loader.load(urls[index]);
    }


})();