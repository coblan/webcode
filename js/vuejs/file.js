/*

主要内容
========
fl
    包含可以操作file对象的函数，例如上传upload,批量上传uploads.

file-input
    该组件用户收集用户输入。只能返回file list 。所以，如果使用upload上传文件，必须取 [0] 第一个file对象。

img-uploador
    图片选择，自动上传。

多个文件上传步骤
==============

1. Vue.data设置
 data:{
    files:[],
 },

2. 在html中插入Vue组件 <file-input id='jjyy' v-model='files' multiple></file-input>

3. 在Methods中上传
fl.uploads(files,url,function(resp){  // url 可以忽略，默认url为 /face/upload
    resp ....
})

单个文件
=======
1.Vue.data设置
 data:{
    files:[],
 },

2. 在html中插入Vue组件 <file-input id='jjyy' v-model='files'></file-input>

3. 在Methods中上传
 fl.uploads(this.files[0],url,function(resp){
    resp ....
 })

.. Note:: 默认上传url是/face/upload ，该接口返回的是 file_url_list。

上传进度
=========
进度只是上传进度，判断文件是否被后端接收成功，需要判断是否success回调被调用。
 fl.upload(this.file2[0],'/face/upload',function(url_list){

 },function(progress){
    console.log(progress)
 })

预览图片
=========
从file-input读出数据，然后赋予图片的src ::

    f1.read(this.files[0],function (data) {
            $('#haha')[0].src = data
    }


上传图片
==========

<img-uploador v-model='xxx_url_variable'></img-uploador>   //默认上传，使用的是 fl.upload默认地址 /face/upload
<img-uploador v-model='xxx_url_variable' up_url='xxx'></img-uploador>


样式技巧
========
1. 自定义样式

    <file-inpu>不支持直接自定义样式。但是可以通过其他方式自定义。最简单的方式是：

    * 隐藏<file-input> ，
    * 然后触发其click事件('.file-input').click()

*/



var fl={
	read:function (file,callback) {
        // 读完文件后，调用callback
		var reader = new FileReader();
    	reader.onloadend = function () {
	        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
	        var dataURL = reader.result;
	        //var img = new Image();
	        //img.src = dataURL;
	        // 插入到 DOM 中预览
	        //$('#haha')[0].src=dataURL
	        callback(dataURL) 
	    };
	    reader.readAsDataURL(file); // 读出 base64
	},
	upload:function (file,url,success,progress) {
            if(ex.is_fun(url)){
                var progress = success
                var success = url
                var url='/face/upload'
            }else{
                var url=url||'/face/upload'
            }

            var fd = new FormData();
            fd.append('file',file);
            $.ajax({
                url:url,
                type:'post',
                data:fd,
                contentType: false,
                success:success,
                //success:function (data) {
                //    success(data)
                //},
                processData:false, 
		       xhr:function() {
			        var xhr = new window.XMLHttpRequest();
			        xhr.upload.addEventListener("progress", function(evt) {
			            if (progress && evt.lengthComputable) {
			                var percentComplete = evt.loaded / evt.total;
                            progress(percentComplete)
			                //console.log('进度', percentComplete);
			            }
			        }, false);

			        return xhr;
			}
		})
	},
	uploads:function (files,url,success,progress) {
            if(ex.is_fun(url)){
                var progress = success
                var success = url
                var url='/face/upload'
            }else{
                var url=url||'/face/upload'
            }

        	var fd = new FormData();
        	for(var x=0;x<files.length;x++){
	        	var file=files[x]
	        	 fd.append(file.name,file);
        	}
            $.ajax({
                url:url,
                type:'post',
                data:fd,
                contentType: false,
                success:success,
                processData:false, 
		       xhr:function() {
			        var xhr = new window.XMLHttpRequest();
			        xhr.upload.addEventListener("progress", function(evt) {
			            if (progress &&evt.lengthComputable) {
			                var percentComplete = evt.loaded / evt.total;
                            progress(percentComplete)
			                //console.log('进度', percentComplete);
			            }
			        }, false);

			        return xhr;
				}
			})
        }
}

Vue.component('file-input',{
    template:"<input class='file-input' type='file' @change='on_change($event)'>",
   	props:['value'],
    data:function () {
    	return {
	    	files:[]
    	}
    },
    watch:{
	    value:function (v) {
            // when input clear selected file, Component file-input need clear too.
            // Brower prohebit to set to Un-none string
		    if(v==''){
			    this.$el.value=v
		    }
	    },
    },
    methods:{
	    on_change:function (event) {
	    	this.files=event.target.files
	    	this.$emit('input',this.files)
	    },
    }
})


Vue.component('img-uploador',{
    props:['value','up_url'],
    data:function(){
       return {
           img_files:'',
           url:this.value,
       }
    },
    template:`
          <div class='up_wrap logo-input'>
            <file-input
                accept='image/gif,image/jpeg,image/png'
                v-model= 'img_files'>
            </file-input>
            <div style="padding: 40px">
                <a class='choose'>Choose</a>
            </div>
            <div v-if='url' class="closeDiv">
            <div class="close" @click='clear()'>X</div>
            <img :src="url" alt="" class="logoImg">
            </div>
            </div>
        `,
    watch:{
      img_files:function(v){
          var self=this
        fl.upload(v[0],this.up_url,function(url_list){
            self.url=url_list[0]
            self.$emit('input',self.url)
        })
      }
    },
    methods:{
        clear:function () {
            this.img_files=''

        }
    }
})





/*
* 下面是为了老代码的兼容性，以后不会用了。
*
*/

Vue.component('file-obj',{
    template:"<input model='filebody' type='file' @change='changed'>",
    props:{
        up_url:{
            type: String,
            required: true
        },
        //url:{
        //    type: String,
        //    twoWay:true
        //},
        ready:{}
    },
    methods:{
        changed:function (changeEvent) {
            var file=changeEvent.target.files[0];
            if(!file)
                return
            this.fd = new FormData();
            this.fd.append('file', file);
            this.ready=true;
            this.upload()
        },
        upload:function () {
            var self =this;
            $.ajax({
                url:this.up_url,
                type:'post',
                data:this.fd,
                contentType: false,
                cache: false,
                success:function (data) {
                    if(data.url){
                        self.$dispatch('rt_url',data.url)
                    }

                    //alert(data);
                    //self.url=data.url;
                    //self.$emit('url.changed',data.url)
                },
                //error:function (data) {
                //	alert(data.responseText)
                //},
                processData:false
            })
        }
    }
})


    Vue.component('logo-input',{
        props:['up_url','web_url','id'],
        template:`
          <div class='up_wrap logo-input'>
            <file-obj :id='id'
                accept='image/gif,image/jpeg,image/png'
                :up_url='up_url'
                @rt_url= 'get_web_url'>
            </file-obj>
            <div style="padding: 40px">
                <a class='choose'>Choose</a>
            </div>
            <div v-if='web_url' class="closeDiv">
            <div class="close" @click='clear()'>X</div>
            <img :src="web_url" alt="" class="logoImg">
            </div>
            </div>
        `,
        methods:{
            get_web_url:function(e){
                this.web_url=e
            },
            clear:function () {
                this.web_url=''
                $('#'+this.id).val('')
            }
        }
    })

  if(!window._logo_input_css){
      document.write(`

<style type="text/css" media="screen" >
.up_wrap{
    position: relative;
    text-align: center;
    border: 2px dashed #ccc;
    background: #FDFDFD;
    width:300px;
}
.logo-input input[type="file"]{
    opacity: 0;
    position: absolute;
    top: 40px;
    left: 40px;
    display: block;
    cursor: pointer;
}
.closeDiv{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #ffffff;
}
.choose{
    display: inline-block;
    text-decoration: none;
    padding: 5px;
    border: 1px solid #0092F2;
    border-radius: 4px;
    font-size: 14px;
    color: #0092F2;
    cursor: pointer;
}
.choose:hover,.choose:active{
    text-decoration: none;
    color: #0092F2;
}
.close{
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
    font-size: 14px;
    color: #242424;
}
.logoImg{
    max-height: 100px !important;
    vertical-align: middle;
    margin-top: 5px;
}
.req_star{
    color: red;
    font-size: 200%;
}
</style>

      `)
  }


window.fl=fl