
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