

var template_str=`
<div class='_expand_menu'>
	<ul>
		<li v-for='act in normed_menu'>
			<a :class='["menu_item",{"selected":act.selected,"opened_submenu":opened_submenu==act.submenu}]' 
				:href='act.submenu?"javascript:void(0)":act.url'
				@click='main_act_click(act)'>
				<span v-html='act.icon' class='_icon'></span><span v-text='act.label'></span>
				<span class='left-arrow' v-if='act.selected'></span>
			</a>
			
			<ul class='submenu' v-show='opened_submenu==act.submenu ||act.selected' transition="expand">
				<li v-for='sub_act in act.submenu' :class='{"active":sub_act.active}'>
					<a :href='sub_act.url' class='sub_item'>
						<span v-text='sub_act.label'></span>
					</a>
					
				</li>
			</ul>
		</li>
	</ul>
</div>
`


Vue.component('expand_menu',{
			template:template_str,
			props:['menu'],
			computed:{
				normed_menu:function () {
					var path = location.pathname

					var matched_menu=null
					var matched_submenu=null

					ex.each(this.menu,function(menu){
						if(menu.submenu){
							ex.each(menu.submenu,function(submenu){
								if(path.startsWith(submenu.url) ){
									if(!matched_submenu || matched_submenu.url.length< submenu.url.length){
										matched_menu=menu
										matched_submenu=submenu
									}
									//menu.selected=true
									//submenu.active=true
									//return 'break'
								}
							})
						}else if(menu.url && path.startsWith(menu.url)){
							if(matched_submenu ){}
							else if(!matched_menu || matched_menu.url.length < menu.url.length){
								matched_menu=menu
							}
							//menu.selected=true
							//return 'break'
						}
					})

					if(matched_menu){matched_menu.selected=true}
					if(matched_submenu){matched_submenu.active=true}

					//for (var x=0;x<this.menu.length;x++){
					//	var url = this.menu[x].url
					//	if(path.startsWith(url)&&url.length>matched.url.length){
					//		matched=this.menu[x]
					//		matched_menu=this.menu[x]
					//		matched_submenu={url:''}
					//	}
					//	var submenu=this.menu[x].submenu || []
					//	for(var y=0;y<submenu.length;y++){
					//		var url = submenu[y].url
					//		if(path.startsWith(url)&&url.length>=matched.url.length){
					//			matched=submenu[y]
					//			matched_menu=this.menu[x]
					//			matched_submenu=submenu[y]
					//		}
					//	}
					//}
					//if(matched_menu.label){
					//	matched_menu.selected=true
					//	matched_submenu.active=true
					//}
					//if(matched_submenu){
					//	matched_submenu.active=true
					//}
					return this.menu
				}
			},
			
			data:function () {
				return {
					opened_submenu:''
				}
			},
			methods:{
				main_act_click:function (act) {
					if(!act.submenu)return
					if(this.opened_submenu==act.submenu){
						this.opened_submenu=''
					}else{
						this.opened_submenu=act.submenu
					}
				}
			}
		})
//Vue.transition('expand', {
//  beforeEnter: function (el) {
//    $(el).slideDown(300)
//  },

//  leave: function (el) {
//    $(el).slideUp(300)
//  },

//})

if(! window.__expand_menu){
document.write(`
 <style type="text/css" media="screen" id="test">
	._expand_menu{
		background-color: #364150;
	}
	._expand_menu a{
		color: #8f97a3;
	}
	._expand_menu a:hover{
		text-decoration: none;
	}
	._expand_menu ul{
		padding: 0px;
	}
	._expand_menu ._icon{
		padding: 0px 10px;
	}
	._expand_menu li{
		list-style-type:none;
		cursor: pointer;
		position: relative;
		padding: 0px;
	}
	._expand_menu ul.submenu li{
		padding: 5px 0px;
	}
	._expand_menu .menu_item{
		border-top:1px solid #475563;
		padding: 5px 0px;
		display:block;
	}
	._expand_menu .sub_item{
		display:block;
	}
	._expand_menu .opened_submenu{
		background-color: #2C3542;
	}
	._expand_menu ul.submenu{
		padding:0px;
	}
	
	._expand_menu ul.submenu li{
		padding-left: 20px;
		color: #B4BCC8;
	}

	._expand_menu .menu_item:hover{
		background-color: #2C3542;
		color: #A7BCAE;
	}
	._expand_menu ul.submenu li:hover , ._expand_menu .submenu .active{
		background-color: #3E4B5C;
	}
	._expand_menu .menu_item.selected{
		background-color: #1CAF9A;
		color: white;
	}
   	._expand_menu .left-arrow{
	   	position: absolute;
	   	right:0px;
	   	border-top:12px solid transparent;
	   	border-bottom:12px solid transparent;
	   	border-right: 12px solid white;
   	}
   	.expand-transition {
		  transition: max-height .3s ease;
		
	}
   </style>
`)
	window.__expand_menu=true
}
