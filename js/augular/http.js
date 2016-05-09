
function add_ajax(app) {
	app.factory('ajax',function ($http) {
		return {
			post:function (post_url,post_data,callback) {
				$http.post(post_url,post_data)
					.success(function(data, status, headers, config) {
						if(data.msg){
							alert(data.msg)
						} 
						callback(data)
					}).error(function(data, status, headers, config) {  
					    alert('有错误,返回码为:'+status)
					});
			}
		}
	})
}

module.exports={
	add_ajax:add_ajax,
}