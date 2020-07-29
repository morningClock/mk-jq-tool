# Jquery下拉筛选框

用于日常快速开发，需要使用下拉筛选框，简单筛选值使用。

适合用于echarts做数据筛选条件的选择。



# 兼容性

兼容IE9+，以及一般的浏览器



# 效果展示图



![效果展示](readme/%E6%95%88%E6%9E%9C%E5%B1%95%E7%A4%BA.gif)



# 代码使用

## 1.引入CSS样式

此处使用到了iconfont，需要将css/font移到工程中并正确引入

```html
<link rel="stylesheet" href="css/font/iconfont.css">
```

引入picker样式

```html
<link rel="stylesheet" href="./css/select-picker.css">
```

## 2.引入JavaScript文件

```html
<script src="js/jquery.min.js"></script>
<script src="js/select-picker.js"></script>
```

## 3.新增html结构

```html
<div class="select-picker" id="selectPicker" style="width: 200px"></div>
```

## 4.配置构建下拉筛选框

```js
var demo1 = new SelectPicker({
      elem: '#selectPicker',
      datas: ['湖北学院','工商学院','桂林大学','广东大学','工业大学','北京大学','农业大学', '上海大学', '哈尔滨大学']
});

// 获取值
demo1.getValue()

// 监听变化
selectPicker1.onChange(function(val){
  console.log("1选中的值为；", val)
})
```



