/**
 * Created by coblan on 2017/3/11.

 >->front/filter.rst>


 <-<
 */

Vue.component('com-filter',{
    props:['heads','search','search_tip'],
    template:ex.template(`
    <form class='button-group ' autocomplete="on" v-if='search_tip || heads.length>0'>
            <input v-if='search_tip' type="text" name="_q" v-model='search._q' :placeholder='search_tip' class='form-control'/>
            <select v-if="filter.options"  v-for='filter in heads' v-model='search[filter.name]' class='form-control'>
                <option :value="undefined" v-text='filter.label'></option>
                <option value="">----</option>
                <option v-for='option in filter.options' :value="option.value" v-text='option.label'></option>
            </select>
            <div  v-for='filter in heads' v-if="['time','date','month'].indexOf(filter.type)!=-1" class="date-filter">
                <span>{From}</span>
                <date v-if="filter.type=='month'" set="month" v-model="search['_start_'+filter.name]"></date>
                <span>{To}</span>
                <date v-if="filter.type=='month'" set="month" v-model="search['_end_'+filter.name]"></date>
            </div>

            <slot></slot>

            <button name="go" type="button" class="btn btn-info" @click='submit()' >{submit}</button>
        </form>
    `,ex.trList(['From','To','submit'])),
    methods:{
        submit:function () {
            location =ex.template('{path}{search}',{path:location.pathname,
                search: encodeURI(ex.searchfy(this.search,'?')) })
        },
    }

})