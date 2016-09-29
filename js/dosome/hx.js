//构造h1-h6的索引
function build_index(node){
        // node :某个jquery对象
        // 函数用于构建索引。以列表的形式，返回node下面所有的H1-6标题。
        var out=$('<ul></ul>');

        var count=0;
        var stat=new Array(0,0,0,0,0,0);
        var wrap=new Array(0,0,0,0,0,0);

        node.find(":header").each(function(index, el) {
          var id=$(this).attr('id');
          if (!id){
              $(this).attr('id','link'+count);
              count+=1;
            }
  
          var new_node=$('<li><a href="#'+$(this).attr('id')+'" target="_self">'+$(this).text()+'</a></li>');
          x=parseInt(el.tagName.charAt(1))-1;
          if (x==0){
            out.append(new_node);
            stat[x]=new_node;
          }else{
            if (!wrap[x-1]){
              wrap[x-1]=$("<ul></ul>");
              var tmp=out;
              for (var i=x-1;i>-1;i--){
                if (stat[i]){
                  tmp=stat[i];
                  break;
                }
              }
            tmp.append(wrap[x-1]);

            }
            stat[x]=new_node;
            wrap[x-1].append(new_node);
            }
            for (var i=x+1;i<6;i++){
              stat[i]=0;
              wrap[i-1]=0;
            }
      });
    return out;
  }

module.exports={
	build_index:build_index,
}