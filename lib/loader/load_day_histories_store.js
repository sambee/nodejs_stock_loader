var loader = require('./load_day_histories');
var fs = require('./../utils/file_store_utils');
var scommon = require('./../utils/common_utils');

var each = scommon.each;

exports.execute = (function () {


    function failureFN() {

    }

    function  rangeExist(d, dateFrom, dateTo) {

        var f = getYear(dateFrom);
        var t = getYear(dateTo);

        var fExist = false;
        var tExist = false;
        each(d, function (r, i, idx) {
           var s = getYear(r['date']);
           if(f == s){
                fExist = true;
            }
            if(t == s){
                tExist = true;
            }
            if(fExist && tExist){
                return false; //stop loop;
            }
        })
        return fExist && tExist;
    }


    function  isDateFormat(d) {
        var a = /^(\d{4})-(\d{2})-(\d{2})$/;
            return a.test(d);
     }

    function getDate(strDate){
        var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
                function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
        return date;
    }

    function filter(d, dateFrom, dateTo) {
        var ret = [];
        var f = getDate(dateFrom).getTime();
        var t = getDate(dateTo).getTime();

        each(d, function (r, i, idx) {

            var da = getDate( r['date']).getTime();
            if(da>=f && da<= t){
                ret.push(r);
            }
        });
        return ret;
    }
    
    function compare(v1, v2) {
        var d1 = getDate(v1['date']).getTime();
        var d2 = getDate(v2['date']).getTime();
        if (d1 < d2) {
            return -1;
        } else if (d1 > d2) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * 两个日期数据合并,重复的将会被删除.
     * @param d
     * @param d2
     * @returns {*}
     */
    function merge(d, d2) {
        var result = [], hash = {};
        if(!d2){
            return d;
        }
        if(!d){
            return d2;
        }
        each(d, function (r, i, idx) {
            if(!hash[r['date']]){
                result.push(r);
                hash[r['date']] = true;
            }
        });
        each(d2, function (r, i, idx) {
            if(!hash[r['date']]){
                result.push(r);
                hash[r['date']] = true;
            }
        });
        result.sort(compare);
        return result;
    }

    function LoadClass(stockCode, dateFrom, dateTo, successFN, failureFN) {

       var fromYear =parseInt(getYear(dateFrom));
       var toYear =parseInt(getYear(dateTo));
       var n = toYear-fromYear;
       var rs = [];
        for(var i=fromYear; i<=toYear; i++){
            var currFrom = getFrom(i );
            var currTo = getTo(i );

            loader.loadHistories(stockCode, currFrom, currTo,function (d) {
                var year = parseInt(getYear(d[0]['date']));
                each(d, function (r, id,idx) {
                    rs.push(r);
                })
                if((n-- <=0) && successFN){
                    successFN(rs);
                }
            }, failureFN);
        }

    }

    function getFrom(s) {
        return getYear(s)+'-01-01';
    }

    function getTo(s) {
        return getYear(s)+'-12-31';
    }
    function getYear(s) {
        if(!isNaN(s)){
            return s;
        }
        return s.substring(0, s.indexOf('-'));
    }


    function loadHistories(stockCode, dateFrom, dateTo, successFN, failureFN){
        if(!isDateFormat(dateFrom)){
            throw 'dateFrom参数不是日期格式, 请确保是(YYYY-MM-DD) :' + dateFrom;
        }
        if(!isDateFormat(dateTo)){
            throw 'dateTo参数不是日期格式(YYYY-MM-DD) :' + dateTo;
        }
        fs.loadData(stockCode, function (d) {
            if(!d){
               new LoadClass(stockCode, dateFrom, dateTo, function (d2) {
                    var d3 = merge(d,d2);
                    fs.saveData(stockCode, d3);
                    if(successFN)successFN(d2);
                }, failureFN);
            }
            else{
                if(rangeExist(d, dateFrom, dateTo)){
                    console.info("Load from cache");
                    successFN(filter(d, dateFrom, dateTo));
                }
                else{
                  new  LoadClass(stockCode, dateFrom, dateTo, function (d2) {
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

