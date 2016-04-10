var loader = require('./load_day_histories');
var fs = require('./../utils/file_store_utils');
var scommon = require('./../utils/common_utils');

var each = scommon.each;

exports.execute = (function () {


    function failureFN() {

    }

    function  rangeExist(d, dateFrom, dateTo) {
        return true;
    }

    function merge(d, d2) {
        var i = {};

        if(!d){
            return d2;
        }
        each(d, function (r, i, idx) {
            if(!i[r['date']] ){
                i.push(r);
            }
        });
        return i;
    }

    function load(stockCode, dateFrom, dateTo, successFN, failureFN) {
        loader.loadHistories(stockCode, dateFrom, dateTo,function (d) {
            if(successFN){
                successFN(d);
            }
        }, failureFN);
    }

    function loadHistories(stockCode, dateFrom, dateTo, successFN, failureFN){
        fs.loadData(stockCode, function (d) {
            if(!d){
                load(stockCode, dateFrom, dateTo, function (d2) {
                    var d3 = merge(d,d2);
                    fs.saveData(stockCode, d3);
                    if(successFN)successFN(d2);
                }, failureFN);
            }
            else{
                if(rangeExist(stockCode, dateFrom, dateTo)){
                    successFN(d);
                }
                else{
                    load(stockCode, dateFrom, dateTo, function (d2) {
                        var d3 = merge(d,d2);
                        fs.saveData(stockCode, d3);
                        if(successFN)successFN(d2);
                    }, failureFN);
                }
            }
        });
        

    };

    exports.loadHistories = loadHistories;
    // load('000651', '2014-01-01', '2015-12-31');

    return loadHistories;
})();

