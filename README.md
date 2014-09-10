# achart-canvas [![spm version](http://spmjs.io/badge/achart-canvas)](http://spmjs.io/package/achart-canvas)

---

图表的基础库，封装了raphael.js，用于增删改查图形，增加了分组概念。

 * [wiki 文档](wiki/)
 * [demo 示例](examples/)


---

## Install

```
$ spm install achart-canvas --save
```

## 使用

### 示例

```js
var Canvas = require('achart-canvas');

var canvas = new Canvas({id : 'canvas'});

canvas.addShape({
  type : 'rect',
  attrs : {
    width : 100,
    height : 100,
    x : 100,
    y : 100,
    stroke : 'red'
  }
});

```

## 内容

 * 画布(canvas)
 * 分组(Group)
 * 各种图形(Shape)
 * 渐变
 * 事件

### Canvas

  1. 创建Canvas 对象
  ```js
   var canvas = new Canvas({id : 'id',width : 500,height : 500});
  ```
  2. canvas 操作
  ```js
  canvas.setSize(100,200); //设置宽高
  canvas.setViewBox(x, y, w, h); //设置视图范围，用于缩放
  canvas.getPoint(clientX,clientY); //将页面的坐标轴转换成canvas上的坐标点
  ```
  3. canvas api

    #### 配置项

     * id : 容器的id
     * width : 宽度
     * heigth ： 高度
     * viewbox : 缩放

    #### 方法

     * setSize(width,height) 设置宽高
     * setViewBox(x, y, w, h) 设置视图范围，用于缩放
     * getPoint(clientX,clientY) 将页面的坐标轴转换成canvas上的坐标点

    #### [通用属性和方法](api/common.md)

    #### [容器方法](api/container.md)


### Group

  1. 创建分组

    ```js

    canvas.addGroup({id : 'id',x : 100, y : 100}); //添加分组

    ```
  2. 分组操作

    ```js
    canvas.find('id'); //查找分组

    var group = canvas.addGroup() //添加匿名分组

    group.addGroup() //分组嵌套

    group.move(x,y); //移动到对应的点

    group.clear(); //清除分组内容
    group.remove(); //移除分组

    ```
  3. api

    #### 配置项

     * x : 偏移的x坐标
     * y : 偏移的y坐标

    #### 方法

     * containsElement(dom) 是否包含指定的dom
     * move(x,y) 移动到对应的坐标

    #### [通用属性和方法](api/common.md)

    #### [画布元素属性和方法](api/item.md)

    #### [容器方法](api/container.md)


### Shape

  1. 创建图形

    ```js

      var shape = canvas.addShape({
          type : 'rect',
          id : 'r1',
          attrs : {
            width : 100,
            height : 100,
            x : 100,
            y : 100,
            stroke : 'red'
          }
      });

      var shape = canvas.addShape('rect',{
          width : 100,
          height : 100,
          x : 100,
          y : 100,
          stroke : 'red'
      });

    ```

  2. 图形类型

    #### Shape(基类)

    下面的配置项不同于图形控件的属性，而是作为图形绘制时的属性使用，所以称之为`绘制属性`

    * arrow-end : 类型: classic, block, open, oval, diamond, none, width: wide, narrow, midium, length: long, short, midium.
    * cursor ： 鼠标形状
    * fill ： 填充颜色
    * fill-opacity ： 填充透明度
    * opacity ： 整体透明度
    * stroke ： 边框
    * stroke-dasharray ： [“”, “-”, “.”, “-.”, “-..”, “. ”, “- ”, “--”, “- .”, “--.”, “--..”]
    * stroke-linecap ：线的端点，butt、 round 及 square。默认值是 butt
    * stroke-linejoin ： 线的连接处的样式，可取的值是 :bevel、round、miter。 默认值是 miter
    * stroke-miterlimit ： 线连接处的延长
    * stroke-opacity ： 线的透明度
    * stroke-width : 线的宽度
    * transform ： transform的属性值

    详情参考： [raphael属性](http://raphaeljs.com/reference.html#Element.attr)

    #### circle

     * cx 圆心x坐标
     * cy 圆心y坐标
     * r 半径

    #### rect

     * x 顶点x坐标
     * y 顶点y坐标
     * width 宽
     * height 高
     * r 圆角

    #### ellipse 
      
     * cx 圆心x坐标
     * cy 圆心y坐标
     * rx x轴半径
     * ry y轴半径

    #### path

     * path 路径
     * path中支持一下关键字大写字母表示相对于canvas顶点的坐标，小写字母表示相对于前一个点的相对位置,+号表示可以多个连续的点

        1. M 移动到某点 M(x,y)
        2. L 画一条线到某点 L(x,y)+ 例如 ： 'L 100 100 200 200' = 'L 100 100 L 200 200'
        3. H 水平画线 H(x)+
        4. V 垂直画线 V(y)+
        5. A 画圆形弧线 O(cx,cy,r,startAngle,endAngle,counterClockwise)+ 最后一个参数false表示顺时针，true表示逆时针
        6. Q quadratic curve 贝塞尔曲线 Q(x1,y1,x,y)+ 参考Q & T
        7. T 前一个节点使用了Q 后控制点可以省略 T(x,y)+
        8. C cubic Bézier 三次方贝塞尔曲线 C(x1,y1,x2,y2,x,y)+ 参考C & S
        9. S cubic Bézier 三次方贝塞尔曲线 省略控制点 S(x,y)+
        10. R 光滑曲线的快捷方式 R(x,y)+
        11. Z 结束path 跟上一个M 的节点连接

    #### line

      * x1 起点x坐标
      * y1 起点x坐标
      * x2 结束点x坐标
      * y2 结束点x坐标

    #### polyLine

      * points 多点线段的连接点

    #### polygon

      * points 多边形的顶点

    #### marker

      自定义标记，用于一些简单的图标

      * radius 半径
      * x 中心点x坐标
      * y 中心点y坐标
      * symbol 标记的类型，目前支持： circle、square、diamond、triangle、triangle-down几种类型，除此之外

        1. 如果symbol 是个图片url 则表示是一个图片
        2. symbol是个函数则根据函数生成标记

    #### text

      * x x坐标
      * y y坐标
      * text 文本
      * font 字体 也可以单独使用 font-family，font-size和font-weight
      * text-anchor 文本对齐方式 [“start”, “middle”, “end”], default is “middle”

    #### label
      
      * 带有旋转角度的文本，拥有text的所有属性
      * rotate 旋转角度 -360 到 360

    #### image

      * src 图片地址
      * x 顶点x坐标
      * y 顶点y坐标
      * width 宽
      * height 高

  3. 图形操作

    ```js

    shape.attr({
      width : 200,
      height : 150
    });

    shape.attr('stroke','blue');

    shape.translate(20,30);

    ```

  4. api

    #### 方法

      * getPath() 获取path
      * transform(tstr) 平移、翻转、放大缩小
      * translate(x,y) 平移
      * scale(sx, sy, cx,cy) 以圆心放大缩小
      * rotate(angle,cx,cy) 旋转

    #### [通用属性和方法](api/common.md)

    #### [画布元素属性和方法](api/item.md)


### 渐变

  * 在图形的fill 和 stroke属性上可以使用渐变，氛围线性渐变和圆形渐变

  #### 线性渐变

   * 格式 ： ‹angle›-‹colour›[-‹colour›[:‹offset›]]*-‹colour› 例如 0-#fff-#f00:20-#000 

  #### 圆形渐变

   * 格式：r[(‹fx›, ‹fy›)]‹colour›[-‹colour›[:‹offset›]]*-‹colour› 例如： r(0.25, 0.75)#fff-#000

### 事件

  * 可以在Canvas,Group,和Shape 上绑定事件
  * on,off,fire是对应的绑定事件、移除事件和触发事件的方式
  * 可以自定义事件
  * ev.target.shape可以取的到对应的图形

## links

  * [demo 示例](examples/)
  * [wiki 文档](wiki/)
