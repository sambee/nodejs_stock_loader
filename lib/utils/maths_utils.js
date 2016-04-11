var fs=require("fs");
var scommon=require("./common_utils");
var dt=require("./datetime_utils");
var mail=require("./mail_client_utils");
var each = scommon.each;
var getYear = dt.getYear;
var getDateFormat = dt.getDateFormat;
var async = require("async");
var dataCompare = scommon.dataCompare;
function array1(c1){
    var ss = []
    for(var ii=0;ii<c1; ii++){
        ss[ii] = 0;
    }
    return ss;
}

function $array2(c1,c2) {
    var s = [];
    for(var i=0;i<c1; i++){
        s.push(array1(c2));
    }
    return s;
}


function $min(d){
    var min = d[0];
    each(d, function (d, i, idx) {
        if(d < min){
            min = d;
        }
    })
    return min;
}

function $max(d){
    var max = 0;
    each(d, function (d, i, idx) {
        if(d > max){
            max = d;
        }
    })
    return max;
}

function range(d, colName){
    var a = [];
    each(d,function (r, i, idx) {
        if(r[colName]){
            a.push(parseFloat(r[colName]));
        }
    })
    return a;
}

/***
 *
 * @param d
 * @returns {number}
 */
function sum(d) {
    var s = 0;
   each(d, function (r, i, idx) {
       s +=r;
   });
    return s;
}

//平均值
function $Arg(s) {
    return ($max(s) + $min(s))/2;
}

//分成N份,每一份的增量
function sper(d, count){
    return  parseFloat((($max(d) - $min(d))/count).toFixed(4));
}

/**
 * 生成N份增量的数组
 * @param d
 * @param count
 * @returns {Array}
 */
function increase(d, count) {
    var a  = [];
    var per = sper(d, count);
    var min = $min(d);
    var s0 = min;
    var s1;
   for(var i=1;i<=count;i++){
        s0 = parseFloat(s0.toFixed(4));
       if(i<count){
           s1 = parseFloat((s0+per-.0001).toFixed(4));
       }
       else{
           s1 = s0+per;
       }
        a.push(s0+ '-' + s1);
        s0 +=per;
    }
    return a;
}

/**
 * 统计第idx维的和
 * @param d
 * @param idx
 */
function $sum(d, idx) {
    var sum = 0 ;
    each(d, function (r, i, idx) {
        sum+=r[1];
    });
    return sum;
}

/**
 *  数列分布出现的次数统计
 * @param d
 * @param count 需要分成的区间数量
 * @return 返回三维数据,第一维是序列,第二维是出现的次数, 第三维是次数的占比
 */
function $dis(d, count) {
    var min = $min(d);
   var per = sper(d, count);
   var inc = increase(d, count);
   var incs = $array2(inc.length,3);
    var id;
    each(d, function (r, i, idx) {
        var check =  (r - min)%per==0;

        if(check){
            id = parseInt((r - min)/per);
        }
        else{
            id = parseInt((r - min - 0.0001)/per);
        }

        // console.info( r + " ---- 区间: " + id);
        if(id>=incs.length){
            id = incs.length-1;
        }
        incs[id][1]++;

    });
    var sum =  $sum(incs, 1);
    each(incs, function (r, i, idx) {
        r[0] = inc[i];
        r[2] = (r[1]*100/ sum).toFixed(4) + "%";
    })
    return incs;
}

/**
 * 根据原始序列得到上穿或下穿空间的序列
 * @param d
 * @param count
 * @return 在数列中,0:没有区间变化,>0为上升区间, <为下降区别, 变化越大,区间变化越大
 */
function $trend(d, count) {
    var min = $min(d);
    var ds = [];
    var per = sper(d, count);
    var oldRangeId =0;
    var newRangeId;

    var inc = increase(d, count);
    each(d, function (r,i,idx) {

        newRangeId = parseInt((r - min)/per);

        //防止溢出
        if(newRangeId>=inc.length-1){
            newRangeId = inc.length-1
        }
        ds.push({
            rangeId: newRangeId,
            range:inc[newRangeId],
            original: r,
            change:newRangeId - oldRangeId, //上穿或下穿区间, 0 为区间没有变化
            from:oldRangeId,
            to:newRangeId
        });

        //区间发生了变化
        if(oldRangeId!=newRangeId&&i>0){
            oldRangeId = newRangeId;
        }
    });

    return ds;
}

/**
 * 趋势分布
 * @param d
 * @param count
 * @return 返回二维数据,第二维中的 [0:序列,1:上升次数, 2:上升占比,3:平次数, 4:平的占比, 5:下跌次数, 6:下跌的占比]
 */
function $trendStat(d, count) {
    var ds = $trend(d,count);
    var min = $min(d);
    var per = sper(d, count);
    var inc = increase(d, count);
    var ret = $array2(inc.length, 7);


    each(ds, function (r, i, idx) {
        var rangeId = r['rangeId'];
        var change = r['change'];
        // console.info(r);
        ret[rangeId][0] =r['range'];
        if(change >0){
            var from =r['from'];
            var to =r['to'];
            for(var i=from+1;i<=to;i++){
                ret[i][1] ++;
            }
        }
        if(change ==0){
            ret[rangeId][3] ++;
        }
        if(change <0){
            var from =r['from'];
            var to =r['to'];
            for(var i=from-1;i>=to;i--){
                ret[i][5] ++;
            }
        }
    });

    var sum = 0;
    each(ret, function (r, i, idx) {
        sum += r[1] +r[3] + r[5];
    });
    each(ret, function (r, i, idx) {
        r[2] = ((r[1]*100) / sum).toFixed(2)+'%';
        r[4] = (r[3]*100 / sum).toFixed(2)+'%';
        r[6] = (r[5]*100 / sum).toFixed(2)+'%';
    });
    return ret;
}

/**
 * 序列中,出现下一个序列的概率
 * @param d
 * @param count
 */
function $RangeChange(d, count) {

}

function getlastMonth(d, n) {
    var s = d.split("-");
    var yy = parseInt(s[0]);
    var mm = parseInt(s[1])-1 ;
    var dd = parseInt(s[2]);
    var dt = new Date(yy, mm, dd);
    dt.setMonth(dt.getMonth() + n);
    var month = parseInt(dt.getMonth()) + 1;
    return dt.getFullYear() + "-" + month  + "-" + dd;
}

function getlastNYear(d, n) {
    return getlastMonth(d, n*12);
}

/**
 * 给出买卖意见
 * @param tradeDate交易日期
 * @param count 分级数量
 */
function $suggestion(stockCode, tradeDate, count, callback) {

    //过去3个月,
    var last3MonthFrom =  getDateFormat(getlastMonth(tradeDate, -3));
    var last3MonthTo =tradeDate;

    //本年度
    var currYearFrom = getYear(tradeDate) + '-01-01';
    var currYearTo = tradeDate;
    //过去1年
    var last1YearFrom = getDateFormat(getlastNYear(tradeDate, -1));
    var last1YearTo = tradeDate;
    
    //过去2年
    var last2YearFrom = getDateFormat(getlastNYear(tradeDate, -2));
    var last2YearTo = tradeDate;

    //过去3年
    var last3YearFrom = getDateFormat(getlastNYear(tradeDate, -3));
    var last3YearTo = tradeDate;
    //过去5年
    var last5YearFrom = getDateFormat(getlastNYear(tradeDate, -5));
    var last5YearTo = tradeDate;

    var his =  require(cfg.loadModel("history"));

    var infos = [];
    var count = 0;
    function handler(data){
        var sequence = range(data, 'close');

        var from = data[0]['date'];
        var to = data[data.length-1]['date'];
        var price  =data[data.length-1]['close'];
        var stat = $trendStat(sequence, 10);

        var s =["Date " + from +  "   " + to ,
        stat.join(" \n").replace(/,/g, ', '),
        " current price:" + price].join( " \n");


        infos.push(s);
        if(count++ >=3){

            var c =cfg.cfg;
            mail.sendmailer(c.email, c.emailPassword, c.emailTo, "[股票概率分布]", s);
            console.info(infos.join(' \n\n '));
        }

    }


    his.execute(code, last3MonthFrom, last3MonthTo, handler);
    his.execute(code, currYearFrom, currYearTo, handler);
    his.execute(code, last1YearFrom, last1YearTo, handler);
    his.execute(code, last2YearFrom, last2YearTo, handler);
    his.execute(code, last3YearFrom, last3YearTo, handler);
    his.execute(code, last5YearFrom, last5YearTo, handler);


}


//////////////////////////////////////////////////////////////////////////
var cfg = require('./../config');
    var code = "sh601398";
    var to = "2016-04-11";

        // d = [10, 19.9, 20.1, 20,30,40,50,60,70,,80,90,100,110,10]
        // var max = smax(d);
        // var min = smin(d);
        // var arg = $Arg(d);
        // var per = sper(d, 10);
        // var dist = $dis(d, 10);
        //
        // console.info('min:'+ min);
        // console.info('max:'+ max);
        // console.info('arg:'+ arg);
        // console.info('per:'+ per);
        // console.info(dist);

        $suggestion(code, to,10);
    // })


//////////////////////////////////////////////////////////////////////////