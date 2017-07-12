# paging
分页控件paging

例子见：[http://tianxiangbing.github.io/paging/](http://tianxiangbing.github.io/paging/)  *一个要仔细看例子的使用*
或
[http://www.lovewebgames.com/jsmodule/paging.html](http://www.lovewebgames.com/jsmodule/paging.html)  

![预览效果:](http://tianxiangbing.github.io/paging/paging.jpg "分页组件效果图")

# 使用方法案例:（推荐使用这种方式）
	<div id="pageTool"></div>
	var p = new Paging();
	p.init({target:'#pageTool',pagesize:10,count:100});
	//重新渲染分页使用render
	p.render({count:100,pagesize:10,current:3});
# 或者 
	var p = $('#pageTool').Paging({pagesize:10,count:100});
	//返回的p是个数组，p[0]是第一个返回对象
***
# npm安装方式
```bash
npm install jq-page
```
# 属性和方法
## hash:false

	是否用url hash值的形式来表达分页，默认为true,但如果出现两个分页时，为导致互相影响，应保证只有一个对应hash
## pagesize:

	每页的条数
## current:

	当前页码，默认为1
## prevTpl

	上一页的模板,默认“上一页”
## nextTpl

	下一页的模板，默认“下一页”
## firstTpl

	首页的模板，默认“首页”
## lastTpl

	末页的模板，默认“末页”
## ellipseTpl

	省略号的模板，默认“...”
## toolbar: bool

	是否显示工具栏,默认为false
## pageSizeList:[]

	当显示工具栏时有效，可设置每页条数，默认为[5,10,15,20]
## callback:function(page,size,count)

	翻页时的回调方法，page为当前页码,size为每页条数，count为总页数
## changePagesize:function(pagesize,currenpage,pagecount)

	修改每页的条数,参数为int
## go:function(p)

	跳转至某一页,默认到current
## render:function(ops)

	重新渲染,ops:{count:int,pagesize:int,current:int,pagecount:int}