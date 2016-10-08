
export function load_js(src,success) {
	success = success || function(){};
	
	var name = btoa(src)
	if(window['__src_'+name]){
		return success()
	}
	window['__src_'+name]=true

	var domScript = document.createElement('script');
	  domScript.src = src;
	  
	  domScript.onload = domScript.onreadystatechange = function() {
	    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
	      success();
	      this.onload = this.onreadystatechange = null;
	      this.parentNode.removeChild(this);
	    }
	  }
	  document.getElementsByTagName('head')[0].appendChild(domScript);
	
}

export function load_css(src) {
	var name = btoa(src)
	if(window['__src_'+name]){
		return
	}
	window['__src_'+name]=true
	$('head').append('<link rel="stylesheet" href="'+src+'" type="text/css" />')
	
}

//var s = document.createElement("script");
//s.type = "text/javascript";
//s.src = "http://somedomain.com/somescript";
//$("head").append(s);