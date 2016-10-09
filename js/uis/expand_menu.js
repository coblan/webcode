

var template_str=`
<div class='_expand_menu'>
	<ul>
		<li v-for='act in menu'>
			<a :class='["menu_item",{"selected":act.selected,"opened_submenu":opened_submenu==act.submenu}]' 
				:href='act.url'
				@click='opened_submenu==act.submenu?opened_submenu="":opened_submenu=act.submenu'>
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
			props:{
				menu:{
					coerce:function (val) {
						var path = location.pathname
						
						var matched={url:''}
						var matched_menu={url:''}
						var matched_submenu={url:''}
						
						for (var x=0;x<val.length;x++){
							var url = val[x].url
							if(path.startsWith(url)&&url.length>matched.url.length){
								matched=val[x]
								matched_menu=val[x]
								matched_submenu={url:''}
							}
							var submenu=val[x].submenu || []
							for(var y=0;y<submenu.length;y++){
								var url = submenu[y].url
								if(path.startsWith(url)&&url.length>=matched.url.length){
									matched=submenu[y]
									matched_menu=val[x]
									matched_submenu=submenu[y]
								}
							}
						}
						if(matched_menu.url){
							matched_menu.selected=true
						}
						if(matched_submenu){
							matched_submenu.active=true
						}
						return val
				}
				},
			data:function () {
				return {
					opened_submenu:''
				}
			},
		
			}
		})
Vue.transition('expand', {
  beforeEnter: function (el) {
    $(el).slideDown(300)
  },

  leave: function (el) {
    $(el).slideUp(300)
  },

})

if(! window.__expand_menu){
document.write(`
 <style type="text/css" media="screen" id="test">
	._expand_menu{
		background-color: #364150;
		width:200px;
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
