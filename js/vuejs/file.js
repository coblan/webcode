/*
>>>front/file.rst>
===========
文件上传
===========

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

1. Vue.data设置::

    data:{
    files:[],
    },

2. 在html中插入Vue组件::

    <file-input id='jjyy' v-model='files' multiple></file-input>

3. 在Methods中上传::

    fl.uploads(files,url,function(resp){  // url 可以忽略，默认url为 /face/upload
        resp ....
    })

单个文件
=======
1.Vue.data设置::

    data:{
        files:[],
    },

2. 在html中插入Vue组件::

    <file-input id='jjyy' v-model='files'></file-input>

3. 在Methods中上传::

     fl.uploads(this.files[0],url,function(resp){
        resp ....
     })

.. Note:: 默认上传url是/face/upload ，该接口返回的是 file_url_list。

上传进度
=========
进度只是上传进度，判断文件是否被后端接收成功，需要判断是否success回调被调用::

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
::

    <img-uploador v-model='xxx_url_variable'></img-uploador>   //默认上传，使用的是 fl.upload默认地址 /face/upload
    <img-uploador v-model='xxx_url_variable' up_url='xxx'></img-uploador>

具备裁剪性质::

    <img-uploader v-model='xxx' :config='{crop:true,aspectRatio: 8 / 10}'></img-uploader>


样式技巧
========
1. 自定义样式

    <file-inpu>不支持直接自定义样式。但是可以通过其他方式自定义。最简单的方式是：

    * 隐藏<file-input> ，
    * 然后触发其click事件('.file-input').click()
<<<<
*/



require('./css/file.scss')


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

var file_input= {
    template: "<input class='file-input' type='file' @change='on_change($event)'>",
    props: ['value'],
    data: function () {
        return {
            files: []
        }
    },
    watch: {
        value: function (v) {
            // when input clear selected file, Component file-input need clear too.
            // Brower prohebit to set to Un-none string
            if (v == '') {
                this.$el.value = v
            }
        }
        ,
    },
    methods: {
        on_change: function (event) {
            this.files = event.target.files
            this.$emit('input', this.files)
        },
    }
}

Vue.component('file-input',file_input)


/*
<img-uploader v-model='xxx'></img-uploader>
 <img-uploader v-model='xxx' :config='{crop:true,aspectRatio: 8 / 10}'></img-uploader>

 accept='image/gif,image/jpeg,image/png'
*/

var img_uploader={
    props:['value','up_url','config'],
    data:function(){
        return {
            img_files:'',
            url:this.value,
        }
    },
    computed:{
        is_crop:function(){
            return this.config && this.config.crop
        },
        crop_config:function(){
            if(this.config && this.config.crop){
                var temp_config=ex.copy(this.config)
                delete temp_config.crop
                return temp_config
            }else{
                return {}
            }
        }
    },
    //mounted:function(){
    //    var self=this
    //  setInterval(function(){
    //      console.log('img_files')
    //      console.log(self.img_files)
    //  },2000)
    //},
    template:`
          <div class='up_wrap logo-input img-uploader'>
            <file-input v-if="!is_crop"
                accept='image/*'
                v-model= 'img_files'>
            </file-input>
            <img-crop class='input' v-if='is_crop' v-model='img_files' :config="crop_config">
            </img-crop>
            <div style="padding: 40px" @click="select()">
                <a class='choose'>Choose</a>
            </div>
            <div v-if='url' class="closeDiv">
            <div class="close" @click='clear()'><i class="fa fa-times" aria-hidden="true" style="padding: 5px;"></i></div>
            <img :src="url" alt="" class="logoImg">
            </div>
            </div>
        `,
    watch:{
        img_files:function(v){
            var self=this
            console.log('start upload')
            fl.upload(v[0],this.up_url,function(url_list){
                self.url=url_list[0]
                self.$emit('input',self.url)
            })
        }
    },
    methods:{
        clear:function () {
            console.log('clear image data')
            this.img_files=''
            this.url=''
            this.$emit('input','')
            //$(this.$el).find('input[type=file]').val('')
            //$('#'+this.id).val('')
        },
        select:function(){
            console.log('before select')
            $(this.$el).find('input[type=file]').click()
            console.log('after select')
        }
    }
}

Vue.component('img-uploador',img_uploader)


/*
具备裁剪功能
==============
 img_crop是一种input

*  <img-crop v-model='xxx' :config='{aspectRatio: 8 / 10}'></img-crop>
*
*  上传:
*  ======
*  fl.upload(xxx[0],function(urls){
*         ...
*  ))
* */

var img_crop={
    template: `<div class="img-crop">
    <input type='file' @change='on_change($event)'
            accept='image/*'>
    <modal v-show='cropping' >
        <div class="total-wrap flex-v" style="width:80vw;height: 80vh;background-color: white;">
            <div class="crop-wrap flex-grow">
                <img class="crop-img" :src="org_img" >
            </div>
            <div style="padding: 5px;">
            <div class="btn-group" role="group">
                <button class="btn btn-primary" @click="rotato_90()"><i class="fa fa-repeat" aria-hidden="true"></i></button>
                <button class="btn btn-primary" @click="zoom_in()"><i class="fa fa-search-plus" aria-hidden="true"></i></button>
                <button class="btn btn-primary" @click="zoom_out()"><i class="fa fa-search-minus" aria-hidden="true"></i></button>
            </div>
            <div class="btn-group" role="group">
                <button class="btn btn-primary" @click="make_sure()"><i class="fa fa-check" aria-hidden="true"></i></button>
                <button class="btn btn-primary" @click="cancel()"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>


            </div>


        </div>
    </modal>
    </div>`,
    props: ['value','config'],
    data: function () {
        var inn_config={
            size:{}
        }
        ex.assign(inn_config,this.config)

        return {
            files: [],
            org_img:'',
            cropping:false,
            inn_config:inn_config
        }
    },
    mounted:function(){
        ex.load_css('https://cdn.bootcss.com/cropper/2.3.4/cropper.min.css')
        ex.load_js('https://cdn.bootcss.com/cropper/2.3.4/cropper.min.js')
    },
    watch: {
        value: function (v) {
            // when input clear selected file, Component file-input need clear too.
            // Brower prohebit to set to Un-none string
            if (v == '') {
                this.$el.value = v
            }

        }
        ,
    },

    methods: {
        cancel:function(){
            $(this.$el).find('input[type=file]').val('')
            this.cropping=false
        },
        zoom_in:function(){
            $(this.$el).find('.crop-img').cropper('zoom', 0.1);
        },
        zoom_out:function(){
            $(this.$el).find('.crop-img').cropper('zoom', -0.1);
        },
        rotato_90:function(){
            $(this.$el).find('.crop-img').cropper('rotate', 90);
        },
        move_img:function(){
            $(this.$el).find('.crop-img').cropper('setDragMode','move')
        },
        move_crop:function(){
            $(this.$el).find('.crop-img').cropper('setDragMode','crop')
        },
        on_change: function (event) {
            if($(this.$el).find('input[type=file]').val()==''){
                return
            }
            var self=this
            this.cropping=true
            var img_file = event.target.files[0]
            //fl.read(img_file)
            //this.$emit('input', this.files)
            fl.read(img_file,function (data) {
                self.org_img = data
                Vue.nextTick(function(){
                    self.init_crop()
                })
            })
        },
        init_crop:function(){
            //$(this.$el).find('.crop-img').cropper({
            //    aspectRatio: 8 / 10,
            //});
            if(this.inn_config.aspectRatio){
                $(this.$el).find('.crop-img').cropper({aspectRatio:this.inn_config.aspectRatio});
            }

            $(this.$el).find('.crop-img').cropper('replace',this.org_img)
            $(this.$el).find('.crop-img').cropper('setDragMode','move')
        },
        make_sure:function(){
            var self=this
            // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`

            //$(this.$el).find('.crop-img').cropper('getCroppedCanvas',this.inn_config.size).toBlob(function (blob) {
            //    //var formData = new FormData();
            //    self.$emit('input',[blob])
            //    self.cropping=false
            //
            //});
            var data_url = $(this.$el).find('.crop-img').cropper('getCroppedCanvas',this.inn_config.size).toDataURL('image/jpeg')
            var blob=dataURLtoBlob(data_url)
            self.$emit('input',[blob])
            self.cropping=false
        }
    }

}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}


Vue.component('img-crop',img_crop)





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



window.fl=fl