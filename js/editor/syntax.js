
function myimport() {
	var url=[
	'<script src="http://apps.bdimg.com/libs/SyntaxHighlighter/3.0.83/scripts/shCore.min.js"></script>',
	'<script src="http://apps.bdimg.com/libs/SyntaxHighlighter/3.0.83/scripts/shAutoloader.min.js"></script>',
	'<link rel="stylesheet" href="http://apps.bdimg.com/libs/SyntaxHighlighter/3.0.83/styles/shCore.min.css">',
'<link rel="stylesheet" href="http://apps.bdimg.com/libs/SyntaxHighlighter/3.0.83/styles/shThemeDefault.min.css">']
	for(var i=0;i<url.length;i++){
		document.write(url[i])
	}
}
 function path() {
        var args = arguments,
        result = [];
        for (var i = 0; i < args.length; i++){
	        var tmp=args[i].replace('$', 'http://apps.bdimg.com/libs/SyntaxHighlighter/3.0.83/scripts/')
	        result.push(tmp.replace('.js','.min.js'));
	        
        }
        return result
    }
    
function autoload() {
	SyntaxHighlighter.vars.discoveredBrushes=null; // 对于动态内容极为重要，迫使syntax重新查看页面，重新load brush
	 SyntaxHighlighter.autoloader.apply(null, path(
            'applescript            $shBrushAppleScript.js',
            'actionscript3 as3      $shBrushAS3.js',
            'bash shell             $shBrushBash.js',
            'coldfusion cf          $shBrushColdFusion.js',
            'cpp c                  $shBrushCpp.js',
            'c# c-sharp csharp      $shBrushCSharp.js',
            'css                    $shBrushCss.js',
            'delphi pascal          $shBrushDelphi.js',
            'diff patch pas         $shBrushDiff.js',
            'erl erlang             $shBrushErlang.js',
            'groovy                 $shBrushGroovy.js',
            'java                   $shBrushJava.js',
            'jfx javafx             $shBrushJavaFX.js',
            'js jscript javascript  $shBrushJScript.js',
            'perl pl                $shBrushPerl.js',
            'php                    $shBrushPhp.js',
            'text plain             $shBrushPlain.js',
            'py python              $shBrushPython.js',
            'ruby rails ror rb      $shBrushRuby.js',
            'sass scss              $shBrushSass.js',
            'scala                  $shBrushScala.js',
            'sql                    $shBrushSql.js',
            'vb vbnet               $shBrushVb.js',
            'xml xhtml xslt html    $shBrushXml.js'
        ));
}


 function  adapt_ck() {
	/*
	ckeditor输入的内容为:<pre><code class='language-python'></code></pre>
	需要调整为<pre class='brush:python'></pre>
	*/
 	$('code[class^="language-"]').each(function () {
	 	var lan=/language-(\w+)/.exec($(this).attr('class'))
		$(this).parent().addClass('brush:'+lan[1])
		$(this).parent().html($(this).html())
	})
 }
 function load_all_brush() {
	 // load all brush
	 // 由于解决了autoload的问题，所以这个函数没用了。留在这里作为纪念
	 var brushs=['Python','JScript','Bash']
	 for (var i =0;i<brushs.length;i++){
		document.write('<script src="http://apps.bdimg.com/libs/SyntaxHighlighter/3.0.83/scripts/shBrush'+brushs[i]+'.min.js"></script>')
	 }
 	
 }
 function all() {
 	SyntaxHighlighter.all();
 }
 function highlight() {
	 // all()是监听的load事件，能够和autoloader配合使用，但是如果要自己手动刷新，就需要使用这个函数
 	SyntaxHighlighter.highlight()
 }
module.exports={
		myimport:myimport,
		autoload:autoload,
		adapt_ck:adapt_ck,
		all:all,
		load_all_brush:load_all_brush,
		highlight:highlight,
	}