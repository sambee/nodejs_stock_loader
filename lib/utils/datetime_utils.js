
exports.getYear = function getYear(s){
    if(!isNaN(s)){
        return s;
    }
    return s.substring(0, s.indexOf('-'));
}


exports.getDateFormat = function getDateFormat(d) {
    var day=0;
    var month=0;
    var year=0;
    mydate=exports.getDate(d);
    mymonth=mydate.getMonth()+1;
    myday= mydate.getDate();
    myyear= mydate.getFullYear();
    year=(myyear > 200) ? myyear : 1900 + myyear;
    if(mymonth >= 10){mymonth=mymonth;}else{mymonth="0" + mymonth;}
    if(myday >= 10){myday=myday;}else{myday="0" + myday;}
    return year+'-'+mymonth+'-'+myday;
}

exports.getDate =  function getDate(strDate){
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
            function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
    return date;
}

exports.datetime = {

}

