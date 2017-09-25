/**
>5>front/table.rst>

table的过滤器
============
::

    class SalaryFilter(RowFilter):
    names=['is_checked']
    range_fields=[{'name':'month','type':'month'}]
    model=SalaryRecords


<-<
 */

require('./css/table_filter.scss')

Vue.component('com-filter',{
    props:['heads','search','search_tip'],
    template:ex.template(`
    <form v-if='search_tip || heads.length>0' class="com-filter flex flex-grow flex-ac">
                <input style="max-width: 20em;min-width: 10em;" v-if='search_tip' type="text" name="_q" v-model='search._q' :placeholder='search_tip' class='form-control'/>
                <div class="flex row-filter"  style="flex-grow:0;min-width: 10em;">
                    <!--<component is="sim-filter"  v-model='search[filter.name]' v-if="filter.options"  v-for='filter in heads' :id="'filter-'+filter.name"-->
                    <!--</component>-->
                     <component :is="filter.type?filter.type:'sim-filter'"  :filter="filter" v-model='search[filter.name]' v-if="filter.options"  v-for='filter in heads' :id="'filter-'+filter.name">
                    </component>

                    <!--<select  v-if="filter.options" v-for='filter in heads' :id="'filter-'+filter.name"-->
                        <!--v-model='value' class='form-control' >-->
                        <!--<option :value="undefined" v-text='filter.label'></option>-->
                        <!--<option value="">-&#45;&#45;&#45;&#45;&#45;&#45;</option>-->
                        <!--<option v-for='option in orderBy( filter.options,"label")' :value="option.value" v-text='option.label'></option>-->
                    <!--</select>-->
                </div>

                <div  v-for='filter in heads' v-if="['time','date','month'].indexOf(filter.type)!=-1" class="date-filter flex flex-ac">
                    <span v-text="filter.label"></span>
                    <span>{From}</span>
                    <div>
                         <date v-if="filter.type=='month'" set="month" v-model="search['_start_'+filter.name]"></date>
                        <date v-if="filter.type=='date'"  v-model="search['_start_'+filter.name]"></date>
                    </div>
                    <span>{To}</span>
                    <div>
                        <date v-if="filter.type=='month'" set="month" v-model="search['_end_'+filter.name]"></date>
                        <date v-if="filter.type=='date'"  v-model="search['_end_'+filter.name]"></date>
                    </div>

                </div>

                <slot></slot>

          <button name="go" type="button" class="btn btn-info btn-sm" @click='m_submit()' >{search}</button>
        </form>
    `,ex.trList(['From','To','search'])),
    created:function(){
        var self=this
        ex.each(self.heads,function(filter){
            if(ex.isin(filter.type,['month','date'])){
                if(!self.search['_start_'+filter.name]){
                    Vue.set(self.search,'_start_'+filter.name,'')
                }
                if(!self.search['_end_'+filter.name]){
                    Vue.set(self.search,'_end_'+filter.name,'')
                }

            }
        })
    },
    methods:{
        m_submit:function () {
            this.$emit('submit')
        },
        orderBy:function (array,key) {
            return  array.slice().sort(function (a,b) {
                if(isChinese(a[key])&&isChinese(b[key])){
                    return a[key].localeCompare(b[key],'zh')
                }else{
                    return compare(a[key],b[key])
                }
            })
        },
    }

})

function isChinese(temp){
    var re=/[^\u4E00-\u9FA5]/;
    if (re.test(temp[0])){return false  ;}
    return true ;
}
function compare(temp1, temp2) {
    if (temp1 < temp2) {
        return -1;
    } else if (temp1 == temp2) {
        return 0;
    } else {
        return 1;
    }
}

var sim_filter={
    props:['filter','value'],
    data:function(){
        return{
            myvalue:this.value
        }

    },
    watch:{
        myvalue:function(v){
            this.$emit('input',v)
        }
    },
    methods:{
        orderBy:function (array,key) {
            return  array.slice().sort(function (a,b) {
                if(isChinese(a[key])&&isChinese(b[key])){
                    return a[key].localeCompare(b[key],'zh')
                }else{
                    return compare(a[key],b[key])
                }
            })
        },
    },
    template:`<select  v-if="filter.options"
    v-model='myvalue' class='form-control' >
    <option :value="undefined" v-text='filter.label'></option>
    <option value="">-------</option>
    <option v-for='option in orderBy( filter.options,"label")' :value="option.value" v-text='option.label'></option>
    </select>

    `
}
Vue.component('sim-filter',sim_filter)

var sim_filter_with_search={
    props:['filter','value'],
    data:function(){
        return{
            myvalue:this.value
        }

    },
    mounted:function(){
        var self=this
          ex.load_js("/static/lib/bootstrap-select.min.js",function(){
              $(self.$el).selectpicker()
          })
        ex.load_css("/static/lib/bootstrap-select.min.css")
    },
    watch:{
        myvalue:function(v){
            this.$emit('input',v)
        }
    },
    methods:{
        orderBy:function (array,key) {
            return  array.slice().sort(function (a,b) {
                if(isChinese(a[key])&&isChinese(b[key])){
                    return a[key].localeCompare(b[key],'zh')
                }else{
                    return compare(a[key],b[key])
                }
            })
        },
    },
    template:`<select class="selectpicker form-control"  data-live-search="true" v-model='myvalue'>
        <option :value="undefined" v-text='filter.label'></option>
        <option value="">-------</option>
        <option v-for='option in orderBy( filter.options,"label")' :value="option.value"
           :data-tokens="option.label" v-text='option.label'>
        </option>
        </select>
    `
}
Vue.component('sel-search-filter',sim_filter_with_search)

