# 画布

----

画布的基本功能

----

<style>
  
  .canvas{
    border : 1px solid #ededed;
  }
</style>

## 目录

 * 画布的创建
 * 画布的宽高和比例
 * 网页坐标和画布坐标
 * 画布内容
 * 画布的事件

### 画布的创建

 画布通过js来创建，用来屏蔽vml和svg的差异

 * 创建代码

    ```js

    var canvas = new Canvas({
        id : 'id',
        width : 500,
        height : 800
    });
    ```
 
 * svg 会生成一个 svg标签

 ```html 
    <svg height="800" version="1.1" width="500" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden; position: relative;"></svg>
 ```

 * vml 会生成一个div 标签


### 画布的宽高和比例

 * 默认情况下,canvas的宽高跟canvas内部的坐标点一一对应
 * 设置了viewbox后，可以设置起点的平移和画布的内部宽度，不与像素一一对应

### 网页坐标和画布坐标

 * 一一对应的画布

````html

<p>500 * 500 的画布</p>

<div id="c1"></div>

````

````javascript
seajs.use(['index'], function(Canvas,$) {
  var canvas = new Canvas({
    id : 'c1',
    elCls : 'canvas',
    width : 500,
    height : 500
  });

  var 
    width = canvas.get('width'),
    height =  canvas.get('height');

  canvas.addShape('line',{
    x1: 0,
    y1: 0,
    x2: width,
    y2 : height,
    stroke : 'red'
  });

  var lineX = canvas.addShape('line',{
    x1 : 0,
    y1 : 0,
    x2 : 500,
    y2 : 0,
    stroke : '#ddd'
  }),
  lineY = canvas.addShape('line',{
    x1 : 0,
    y1 : 0,
    x2 : 0,
    y2 : 500,
    stroke : '#ddd'
  }),
  text = canvas.addShape('text',{
    width : 0,
    height : 0,
    'font-size' : '14px',
    text : '(0,0)',
    fill : '#999'
  });
  

  canvas.addShape('label',{
    x : width/2,
    y : height/2,
    text : width + ' * ' + height,
    'text-anchor' : 'middle',
    fill : 'blue',
    "font-size" : "24px",
    rotate : 45
  });

  canvas.on('mousemove',function(ev){
    var point = canvas.getPoint(ev.clientX,ev.clientY);
    lineX.transform(['t',0,point.y]);
    lineY.transform(['t',point.x,0]);
    text.attr({
      x : point.x,
      y : point.y,
      text : '('+point.x + ','+ point.y+')'
    });
  });
});

````

 
 * 不一一对应的坐标轴

````html

<p>500 * 500 的画布</p>

<div id="c2"></div>

````

````javascript
seajs.use(['index'], function(Canvas,$) {
  var canvas = new Canvas({
    id : 'c2',
    elCls : 'canvas',
    width : 500,
    height : 500
  });

  canvas.setViewBox(100,100,1000,1000);

  var 
    width = 1000,
    height =  1000;

  canvas.addShape('line',{
    x1: 100,
    y1: 100,
    x2: 1100,
    y2 : 1100,
    stroke : 'red'
  });

  var lineX = canvas.addShape('line',{
    x1 : 100,
    y1 : 100,
    x2 : 1100,
    y2 : 100,
    stroke : '#ddd'
  }),
  lineY = canvas.addShape('line',{
    x1 : 100,
    y1 : 100,
    x2 : 100,
    y2 : 1100,
    stroke : '#ddd'
  }),
  text = canvas.addShape('text',{
    width : 0,
    height : 0,
    'font-size' : '14px',
    text : '(0,0)',
    fill : '#999'
  });
  

  canvas.addShape('label',{
    x : 1100/2,
    y : 1100/2,
    text : width + ' * ' + height,
    'text-anchor' : 'middle',
    fill : 'blue',
    "font-size" : "24px",
    rotate : 45
  });

  canvas.on('mousemove',function(ev){
    var point = canvas.getPoint(ev.clientX,ev.clientY);
    lineX.transform(['t',0,point.y - 100]);
    lineY.transform(['t',point.x - 100,0]);
    text.attr({
      x : point.x,
      y : point.y,
      text : '('+point.x + ','+ point.y+')'
    });
    console.log(point);
  });
});

````

### 画布的内容

![画布构成](http://gtms01.alicdn.com/tps/i1/TB1UuDIFVXXXXcAXVXXHI3LQpXX-300-156.jpg)

 * 画布内部包含[分组（Group)](3-group.md)和[图形（Shape）](4-shape.md)
 * 分组也可以嵌套分组于图形
 * 图形不能包含任何分组和图形

```js

canvas.addShape('rect',{...});//添加图形

var group = canvas.addGroup(C,{...}); //添加构造函数为C 的分组


group.addGroup(); //分组添加分组

group.addShape('circle',{...}) //分组添加图形
```

### 画布的事件

  * 画布上可以绑定所有的DOM事件，图形触发事件时都会冒泡到画布上来
  * ev.target是触发事件的DOM对象，ev.target.shape是触发事件的图形对象

```js

function callback(ev){
  var shape = ev.target.shape;
  if(shape){
    //TO DO
  }
}
canvas.on('click',callback);

canvas.off('click',callback);

canvas.fire('click',{target : ...});

```

### 更多
  
 * [api](../#canvas)
 * 更多信息请参考 [分组（Group)](3-group.md)和[图形（Shape）](4-shape.md)






