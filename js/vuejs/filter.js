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
    <form autocomplete="on" v-if='search_tip || heads.length>0' class="com-filter flex flex-grow flex-ac">
                <input style="max-width: 20em;min-width: 10em;" v-if='search_tip' type="text" name="_q" v-model='search._q' :placeholder='search_tip' class='form-control'/>
                <div style="flex-grow:0;min-width: 10em;">
                    <select  v-if="filter.options"  v-for='filter in heads'
                        v-model='search[filter.name]' class='form-control' >
                        <option :value="undefined" v-text='filter.label'></option>
                        <option value="">-------</option>
                        <option v-for='option in filter.options' :value="option.value" v-text='option.label'></option>
                    </select>
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

          <button name="go" type="button" class="btn btn-info" @click='m_submit()' >{search}</button>
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
            //if(this.submit){
            //    this.submit()
            //}else{
            //    location =ex.template('{path}{search}',{path:location.pathname,
            //        search: encodeURI(ex.searchfy(this.search,'?')) })
            //}

        },
    }

})