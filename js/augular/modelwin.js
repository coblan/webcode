//angular.module('styleInjector', ['ng'])
function add_model(app) {
	
  app.factory('styleInjector', function($rootElement) {
    var ss = angular.element('<style>'),
    initializedDirectives = {};
    $rootElement.append(ss);
    return {
      insertCSS: insertCSS,
      importCSSLink: importCSSLink,
      initDirective: initDirective,
      
    };
    function initDirective(desc) {
      // A helper for directives to add their styles once.
      if (!initializedDirectives[desc.name]) {
        if (desc.css)
          insertCSS(desc.css);
        if (desc.cssUrl)
          importCSSLink(desc.cssUrl);
        initializedDirectives[desc.name] = true;
      }
    }
    function insertCSS(css) {
      ss.text(ss.text()+css+'\n');
    }
    
    function importCSSLink(url) {
      insertCSS('@import url('+JSON.stringify(url)+');');
    }
    
  })

  app.directive('modelForm',function ($window,styleInjector,$timeout) {
	/* <width>: 百分数 或者 px
	    [height]: 百分数，或者px
	<div model-form style='text-align: center;' ng-show='show_form' width='30%' height='30px'>
	*/
	var css=hereDoc(function () {/*
	.-model-back{
	    width: 100%;
	    height: 100%;
	    position: fixed;
	    top:0;
	    left:0;
	    z-index: 8;
	    background: rgba(0,0,0,0.4);
	}
	.-model-form{
	    font-size: 1.1em;
	    border-radius: 5px;
	    background:  #fff;
	}*/}); 
	styleInjector.insertCSS(css)
	return {
		restrict:'A',
		transclude:true,
		template:"<div class='-model-back'>\
				<div ng-transclude class='-model-form'></div></div>",
		link:function (scope,ele,attr) {
			var form = ele.find('.-model-form')
			if (attr.style){
				form.attr('style',attr.style)
			}
			//if(attr.width){
			//	//var mt=/(\d+)%/.exec(attr.width);
			//	//if(mt){
			//	//	form.css('width',$(window).width()*parseFloat('0.'+mt[1]))
			//	//	$(window).resize(function () {
			//	//		form.css('width',$(window).width()*parseFloat('0.'+mt[1]))
			//	//	})
			//	//}else{
			//		form.css('width',attr.width)
			//	//}
			//}
			//if(attr.height){
			//	//var mt = /(\d+)%/.exec(attr.height);
			//	//if(mt){
			//	//	form.css('height',$(window).height()*parseFloat('0.'+mt[1]))
			//	//	$(window).resize(function () {
			//	//		form.css('height',$(window).height()*parseFloat('0.'+mt[1]))
			//	//	})
			//	//}else{
			//		form.css('height',attr.height)
			//	//}
				
			//}
			scope.$watch(attr.ngShow, function(value){
				if (value){
					$timeout(function () {
						win_width=$window.innerWidth;
						win_height=$window.innerHeight;
						form_width=form.width()
						form_height=form.height()
						form.css('margin-left',parseInt((win_width-form_width)/2)+'px')
						form.css('margin-top',parseInt((win_height-form_height)/2)+'px')
					})
				}
			})
		}
	}
})
app.directive('inform',function () {
	var form=hereDoc(function () {/*
	<div model-form style='text-align: center;' ng-show='show_form' width=[[width]]>
	<div style='padding: 20px;'>
		<p  ng-bind='content'></p>
		<button type="button" style="min-width:100px;"
			class="btn btn-success" 
			ng-click='hide()'>
			知道了
		</button>
	</div>
	</div>
	*/
	})
	return {
		restrict:'A',
		template:form,
		scope:{
			self:'=',
			width:'@'
		},
		
		link:function (scope,ele,attr) {
			scope.callback=null;
			scope.self={
				info:function (content,callback) {
					scope.show_form=true;
					scope.content=content;
					if (callback){
						scope.callback=callback
					}
					}
			}
			//scope.width=attr.width;
			scope.show_form=false;
			scope.hide=function () {
				scope.show_form=false;
				if(scope.callback){
					scope.$parent.$eval(scope.callback)
					scope.callback=null;
				}
			}
		}
	}
})

app.directive('assureForm',function () {
	var form=hereDoc(function () {/*
	<div model-form style='text-align: center;' ng-show='show_form' width=[[width]] height=[[height]]>
	<div style='padding: 20px;'>
		<p ng-bind='content'></p>
		<button type="button" style='position:relative;left:-10px;min-width:100px;'
			class="btn btn-success" 
			ng-click='hide(true)'>
			确定
		</button>
		<button type="button" style='position:relative;left:10px;min-width:100px;'
			class="btn btn-default" 
			ng-click='hide(false)'>
			取消
		</button>
	</div>
	</div>
	*/
	})
	return {
		restrict:'A',
		template:form,
		scope:{
			self:'=',
			width:'@',
			height:'@',
		},
		
		link:function (scope,ele,attr) {
			scope.callback=null;
			scope.self={
				info:function (content,callback) {
					scope.show_form=true;
					scope.content=content;
					if (callback){
						scope.callback=callback
					}
					}
			}
			scope.show_form=false;
			scope.hide=function (bool) {
				scope.show_form=false;
				if(scope.callback){
					scope.$parent.$eval(scope.callback(bool))
					scope.callback=null;
				}
			}
		}
	}
})

	
}



//var app = angular.module('he',['ngSanitize','styleInjector']);
//app.config(function($interpolateProvider) {
//	  $interpolateProvider.startSymbol('[[');
//	  $interpolateProvider.endSymbol(']]');
//	});

function hereDoc(f) {　
    return f.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '');
}
function const_div(first_argument) {
	
	return true;
}
module.exports={
	add_model:add_model,
}
	//var modewin=require('augular/modewin')
	//modewin.add_model(app)
	
	//<!-----------------弹出框------------------------>
	//<div inform self='inform' width='50%'></div>
	//<div assure-form self='assure' width='50%'></div>

	//$scope.inform.info(data.msg)
	//$scope.assure.info(data.msg,callback)
