

exports.each = function each(d, fn){
    var i = 0;
    var next ;
    for(var idx in d){
        next = fn(d[idx],i++, idx);
        if(next === false){
           break;
        }
    }

}

