/**
 * Created by zhangrong on 2016/8/6.
 */

export function hook_ajax_msg(){
	if(window.hook_ajax_msg_mark){
		return
	}
	window.hook_ajax_msg_mark = true
	$(window).bind('beforeunload',function () {
		window.iclosed=true
	})
	
    $(document).ajaxSuccess(function (event,data) {
        var rt = data.responseJSON
        if(rt && rt.msg){
            alert(rt.msg)
        }
    }).ajaxError(function (event,jqxhr, settings, thrownError) {
		if(! window.iclosed){
			if(jqxhr.status !=0){
				alert('server has error')
			}else{
				alert('maybe server offline')
			}

		}
	})
}

export function show_upload(){
	$('#load_wrap').show()
}
export function hide_upload(){
	$('#load_wrap').hide()
}

if(!window.__font_awesome){
	window.__font_awesome=true
	document.write(`<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">`)
}

if(!window.__uploading_mark){
	window.__uploading_mark=true
	document.write(`
		<style>
		.popup{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display:none;
		}
		#_upload_inn{
			background: rgba(88, 88, 88, 0.2);
			border-radius: 5px;
			width:180px;
			height:120px;
			/*padding:30px 80px ;*/
		}
		.imiddle{
	    position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
		/*display: table;*/
        z-index: 1000;
    	}
    	#_upload_mark{
    		float: left;

    	}
		</style>`)
	$(function(){
		$('body').append(`<div class="popup" id="load_wrap"><div id='_upload_inn' class="imiddle">
		<div  id="_upload_mark" class="imiddle"><i class="fa fa-spinner fa-spin fa-3x"></i></div></div></div>`)
	})
}

