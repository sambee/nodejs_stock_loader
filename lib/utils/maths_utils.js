var fs=require("fs");
var scommon=require("./common_utils");

var each = scommon.each;

function array1(c1){
    var ss = []
    for(var ii=0;ii<c1; ii++){
        ss[ii] = 0;
    }
    return ss;
}

function array2(c1,c2) {
    var s = [];
    for(var i=0;i<c1; i++){
        s.push(array1(c2));
    }
    return s;
}


function smin(d){
    var min = d[0];
    each(d, function (d, i, idx) {
        if(d < min){
            min = d;
        }
    })
    return min;
}

function smax(d){
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

function sum(d) {
    var s = 0;
   each(d, function (r, i, idx) {
       s +=r;
   });
    return s;
}

//平均值
function $Arg(d) {
    return (smax(d) + smin(d))/2;
}

//分成N份,每一份的增量
function sper(d, count){
    return  parseFloat(((smax(d) - smin(d))/count).toFixed(4));
}

//生成N份增量的数组
function increase(d, count) {
    var a  = [];
    var per = sper(d, count);
    var min = smin(d);
    var s = min;
   for(var i=0;i<=count;i++){
        a.push(parseFloat(s.toFixed(4)));
        s +=per;
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
 * @return 返回三维数据,第一维是序列,第二维是出现的次数
 */
function $dis(d, count) {
   var min = smin(d);
   var per = sper(d, count);
   var inc = increase(d, count);
   var incs = array2(inc.length,3);

    each(d, function (r, i, idx) {
        id = parseInt((r - min)/per);
        //console.info( r + " ----  " + id);
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
 * 序列中,出现下一个序列的概率
 * @param d
 * @param count
 */
function $RangeChange(d, count) {
    
}


//////////////////////////////////////////////////////////////////////////
var cfg = require('./../config');
    var code = "sh601398";
    var from = "2015-2-29";
    var to = "2016-2-29";

    var his =  require(cfg.loadModel("history"));

    his.execute(code, from, to, function (data) {


        var d = range(data, 'close');
        // var max = smax(d);
        // var min = smin(d);
        // var arg = $Arg(d);
        // var per = sper(d, 10);
        var dist = $dis(d, 10);
        //
        // console.info('min:'+ min);
        // console.info('max:'+ max);
        // console.info('arg:'+ arg);
        // console.info('per:'+ per);

        console.info("Date " + from +  " - " + to);
        console.info(dist);
    })


//////////////////////////////////////////////////////////////////////////