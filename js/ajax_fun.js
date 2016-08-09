/**
 * Created by zhangrong on 2016/8/6.
 */

export function hook_ajax_msg(){
    $(document).ajaxSuccess(function (event,data) {
        var rt = data.responseJSON
        if(rt && rt.msg){
            alert(rt.msg)
        }
    }).ajaxError(function (event) {
        alert('server has error')
    })
}