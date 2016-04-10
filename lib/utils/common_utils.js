

exports.each = function each(d, fn){
    var i = 0;
    for(var idx in d){
        fn(d[idx],i++, idx);
    }

}