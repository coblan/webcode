
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
 	$('code[class^="language-"]').each(function () {
	 	var lan=/language-(\w+)/.exec($(this).attr('class'))
		$(this).parent().addClass('brush:'+lan[1])
		$(this).parent().html($(this).html())
	})
 }
 function load_all_brush() {
	 // load all brush
	 var brushs=['Python','JScript','Bash']
	 for (var i =0;i<brushs.length;i++){
		document.write('<script src="http://apps.bdimg.com/libs/SyntaxHighlighter/3.0.83/scripts/shBrush'+brushs[i]+'.min.js"></script>')
	 }
 	
 }
 function all() {
 	SyntaxHighlighter.all();
 }
module.exports={
		myimport:myimport,
		autoload:autoload,
		adapt_ck:adapt_ck,
		all:all,
		load_all_brush:load_all_brush,
	}