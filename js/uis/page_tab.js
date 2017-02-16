

Vue.component('page-tab',{
    template:`<ul class='menu'>
    <li v-for='tab in tabs' :class='{"active":value==tab}' @click='$emit("input",tab)' v-text='tab'></li>
    </ul>`,
    props:['value','tabs'],
})

document.write(`
 <style type="text/css" media="screen" id="test">
.menu{
		margin: 30px auto;
		border-bottom: 1px solid #DADCDE;
	}
	.menu li{
		display: inline-block;
		padding: 10px 20px;
		font-size: 16px;
	}
	.menu li:hover{
		cursor: pointer;
	}
	.menu .active{
		border-bottom: 5px solid #0092F2;
		color: #0092F2;
	}
</style>
`)

