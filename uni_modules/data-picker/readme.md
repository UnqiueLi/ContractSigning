# data-picker
**具体使用示例请导入示例项目查看**

1、该组件在uview的基础上研发，使用前需要先引入uview，[点击查看组件引入教程](http://t.csdn.cn/9uFhh)

2、sourceData如果不传的话，会默认取区域数据作为数据源

3、支持三种模式传递默认值，如下

```
	indexs: [0, 0, 7],
	defaultIds: [1, 110000, 110111],
	defaultNames: ['北京市', '北京市', '房山区']
```

4、三种默认任选其一即可，如果传了多个，则选择其中一种生效，权重从大到小为indexs、defaultNames、defaultIds

5、自动识别需要的层级，如数组长度为1，显示一列，长度为3，显示3列

6、默认显示底部按钮，如果需要切换为顶部按钮，则需要传递参数showToolbar=true和showBottombar=false

### DataPicker Props

|    属性名     |  类型   |   可选值   |      默认      |                             说明                             |
| :-----------: | :-----: | :--------: | :------------: | :----------------------------------------------------------: |
|    indexs     |  Array  |     -      |       -        |                       默认选择数据下标                       |
| defaultNames  |  Array  |     -      |       -        |                      默认选择数据的name                      |
|  defaultIds   |  Array  |     -      |       -        |                       默认选择数据的id                       |
|  sourceData   |  Array  |     -      | 省市县区域数据 |             源数据。不传则默认读取省市县区域数据             |
|  showToolbar  | Boolean | true/false |     false      |                       显示顶部操作按钮                       |
| showBottombar | Boolean | true/false |      true      |                       显示底部操作按钮                       |
|   labelName   | String  |     -      |      name      | 默认sourceData中对象属性名为name，如果不是name，<br />可以自定义名称，具体可以看示例项目 |
|   initBack    | Boolean | true/false |      true      | 是否返回根据默认值加载的数据，相当于初始化后手动点了一次确认，<br />获取数据同样在confirm里面 |

注意：由于本组件是基于uview中的picker开发的，u-picker组件中所有的属性在本组件都支持，不再重复罗列， [点击查看u-picker组件属性](https://www.uviewui.com/components/picker.html)