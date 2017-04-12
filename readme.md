###一、文件引入
Js文件引用：
`
	1.js/customScrollBar.js   (默认添加 jquery-1.9.1.min.js)`

###二、参数说明 
		var opt = {
			scrollBoxCssX: {	//X轴滚动槽样式对象
				width: 8,
				backgroundColor:'black'
			},
			scrollBarCssX: {	//X轴滚动条样式对象	
				backgroundColor:'white'				
			},
			scrollBoxCssY: {	//Y轴滚动槽样式对象
				width: 10,
				backgroundColor:'green'
			},
			scrollBarCssY: {	//Y轴滚动条样式对象
				backgroundColor:'black'
			}
		}
>调用方式：$( ).customScrollBar(opt);	

###三.业务调用者的注意事项
>
1.以上样式对象跟jquery的样式对象的格式完全一致
>
2.滚动条都不可以人为的设置宽高，滚动槽可以设置对应宽高，X可设置高，Y可设置宽度
>
3.customScrollBar可以不配置opt，存在默认参数样式，下图为例
>
4.使用滚动条的元素结构必须具备出现滚动条的条件并且内容区域元素要存在"t-selectContent"的class名

	<div id="scrollBar" >
		<div class="content  t-selectContent"></div>
	</div>
>*这里scrollBar要设置样式为{overflow:hidden}
类名为content的元素内容要满足出现滚动条的条件
可参考/res/component/scrollBar/index.html的对应的样式例子*