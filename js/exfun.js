
function parseSearch(queryString) {
	var queryString = queryString || location.search
	if(queryString.startsWith('?')){
		var queryString=queryString.substring(1)
	}
	var params = {}
    // Split into key/value pairs
    var queries = queryString.split("&");
    // Convert the array of strings into an object
    for (var i = 0; i < queries.length; i++ ) {
	    var mt = /([^=]+?)=(.+)/.exec(queries[i])
        params[mt[1]] = mt[2];
    }
    return params;
}
function searchfy(obj,pre){
	var outstr=pre||''
	for(x in obj){
		if(obj[x]){
			outstr+=x.toString()+'='+ obj[x].toString()+'&';
		}
		
	}
	if(outstr.endsWith('&')){
		return outstr.slice(0,-1)
	}else{
		return outstr
	}
	
}
function update(dst_obj,src_obj) {
	for(x in src_obj){
		dst_obj[x]=src_obj[x]
	}
}

//  startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

Array.prototype.each = function(fn) 
{ 
return this.length ? [fn(this.slice(0,1))].concat(this.slice(1).each(fn)) : []; 
};

 /*两种调用方式
 var template1="我是{0}，今年{1}了";
 var template2="我是{name}，今年{age}了";
 var result1=template1.format("loogn",22);
 var result2=template2.format({name:"loogn",age:22});
 两个结果都是"我是loogn，今年22了"
 */
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
　　　　　　　　　　　　var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}