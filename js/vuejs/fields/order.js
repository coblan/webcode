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

export function	order_by_key (array,key) {
    return  array.slice().sort(function (a,b) {
        if(isChinese(a[key])&&isChinese(b[key])){
            return a[key].localeCompare(b[key],'zh')
        }else{
            return compare(a[key],b[key])
        }
    })
}