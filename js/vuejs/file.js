/*
file-input
===========
预览图片
	从file-input读出数据，然后赋予图片的src ::
	
		f1.read(file,function (data) {
				$('#haha')[0].src = data
				}



*/
var fl={
	read:function (file,callback) {
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
	upload:function (file,url,success) {
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
			            if (evt.lengthComputable) {
			                var percentComplete = evt.loaded / evt.total;
			                console.log('进度', percentComplete);
			            }
			        }, false);

			        return xhr;
			}
		})
	},
	uploads:function (files,url,success) {
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
			            if (evt.lengthComputable) {
			                var percentComplete = evt.loaded / evt.total;
			                console.log('进度', percentComplete);
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
        _changed:function (changeEvent) {
            var file=changeEvent.target.files[0];
            if(!file)
                return
            this.file=file
            this.fd = new FormData();
            this.fd.append('file', file);
            this.$dispatch('ready')
            //this.ready=true;
        },
        read:function (callback) {
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

		    reader.readAsDataURL(this.file); // 读出 base64
        },
        upload:function (up_url,success,error) {
            var self =this;
            $.ajax({
                url:up_url,
                type:'post',
                data:this.fd,
                contentType: false,
                cache: false,
                success:function (data,textStatus,jqXHR ) {
	                success(data,textStatus,jqXHR)
                    //self.$dispatch('response',data)
                    
                },
                error:function (jqXHR, textStatus,errorThrown) {
                	error(jqXHR, textStatus,errorThrown)
                },
                processData:false
            })
        },
    }
})





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