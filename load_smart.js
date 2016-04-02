var http = require('http');
var gbk = require('gbk');
var url = 'http://qt.gtimg.cn/r=0.37758365040645003q=sz399001,bkqt012040,pt012040_002260';

http.get(url, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
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
        // 'content-type': 'text/html;charset=gbk'
        // 百度返回的页面数据流竟然还无法使用gbk完全解码。。
        //var gbk_to_utf8_iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
        //var utf8_buffer = gbk_to_utf8_iconv.convert(buffer);
        var utf8String = gbk.toString('utf-8', buffer);
        console.log(utf8String.toString());
    });
});