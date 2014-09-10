# 图形

----

图形的分类和使用

----

## 目录

  * 基本图形概念,及创建
  * 图形的分类
  * 图形扩展
  * API

### 基本图形

  * 基本图形(Canvas.Shape)具有以下特征： 

    1. 可以使用 getBBox 获取边界x,y,width ,height
    2. 使用getPath 获取path路径，使用 getTransformPath获取transform 后的路径
    3. attrs中的属性可以使用动画
    4. 可以使用translate,scale,rotate以及tranform方法进行坐标变换

  * 所有其他图形都是基础图形的子类,并且注册到Canvas.Shape上面，例如：

    ```js

      //Canvas.Shape.Circle 表示圆形,使用时，首写字母小写作为类型

      canvas.addShape(circle,{...});
    ```

  * 基本图形的属性： [基本属性](../#shape-基类)

  * 图形的创建方式有2种

    ```js

    canvas.addShape({
      id : 'id',
      type : 'rect',
      attrs : {
        ....
      }
    });

    //或者

    canvas.addShape('rect',{...});

    //第一种存在id的可以方便查找

    var rect = canvas.find('id');

    ```

### 图形分类

  * circle 圆形 attrs : cx,cy,r
  * rect 矩形 attrs : x,y,width,height
  * ellipse 椭圆 attrs : cx,cy,rx,ry
  * path : 自定义路径，[详情参看](../#path)
  * polyLine : 折线 attrs : points
  * polygon : 多边形 attrs : points
  * marker: 标记，attrs : x,y,symbol,radius
  * text : 文本，attrs : x,y,font,text,text-anchor 
  * label : 带旋转角度的文本 attrs : rotate
  * image : 图片 attrs : x,y,width,height,image

#### 基本图形示例


````html

<div id="c1"></div>
````

````javascript
seajs.use('index', function(Canvas) {
  
  var canvas = new Canvas({
    id : 'c1',
    width : 500,
    height : 500
  });

  //画线
  canvas.addShape('line',{
    x1 : 0,
    y1 : 0,
    x2 : 50,
    y2 : 50,
    stroke : 'red'
  });

  //画矩形，也可以指定额外的信息，如id,elCls
  canvas.addShape({
    type : 'rect',
    id : 'rect', //canvas.find('rect');既可以查找到
    elCls : 'my-rect',
    attrs : {
      x : 100,
      y : 0,
      r : 5,
      width : 50,
      height: 50,
      stroke : 'yellow',
      fill : 'red'
    }
  });

  //圆
  canvas.addShape('circle',{
    cx : 125,
    cy : 100,
    r : 20,
    fill : '#2f7ed8',
    stroke : ''
  });

  //椭圆
  canvas.addShape('ellipse',{
    cx : 200,
    cy : 100,
    rx : 20,
    ry : 30,
    fill : 'yellow'
  });

  //多边形
  canvas.addShape('polygon',{
    points : ['10,150','110,150','60,200'],
    stroke : '#c0c0c0'
  });

  //path
  canvas.addShape('path',{
    path : 'M250,225L250,70M250,225L359.60155108391484,115.39844891608514M250,225L405,225M250,225L359.60155108391484,334.60155108391484M250,225L250.00000000000003,380M250,225L140.39844891608516,334.60155108391484M250,225L95,225.00000000000003M250,225L140.39844891608513,115.39844891608516',
    stroke : '#c0c0c0'
  });
  //图片
  canvas.addShape('image',{
    x : 0,
    y : 400,
    width : 200,
    height : 250,
    src : 'http://i.mmcdn.cn/simba/img/T1dOKRFyVeXXb1upjX.jpg'
  });
});
````

#### markers示例

````html

<div id="c2"></div>

````

````javascript
seajs.use('index', function(Canvas) {
  
  var canvas = new Canvas({
    id : 'c2',
    width : 500,
    height : 500
  });

  //圆形
  var circle = canvas.addShape('marker',{
    x : 400,
    y : 100,
    fill: 'blue',
    radius : 10,
    symbol : 'circle'
  });

  //三角
  var triangle = canvas.addShape('marker',{
    x : 350,
    y : 100,
    fill: 'blue',
    radius : 10,
    symbol : 'triangle'
  });
  //方形
  var rect = canvas.addShape('marker',{
    x : 400,
    y : 200,
    fill: '#ffcc00',
    radius : 10,
    symbol : 'square'
  });
   //倒三角
  canvas.addShape('marker',{
    x : 350,
    y : 200,
    fill: 'yellow',
    radius : 10,
    symbol : 'triangle-down'
  });
  //菱形
   var  diamond = canvas.addShape('marker',{
    x : 350,
    y : 150,
    fill: 'red',
    radius : 10,
    symbol : 'diamond'
  });
  //图片
  var image = canvas.addShape('marker',{
    x : 400,
    y : 150,
    radius : 10,
    symbol : 'url(http://mat1.gtimg.com/www/images/qq2012/weather/20120906/sun.png)'
  });
  //自定义
  var cpath = canvas.addShape('marker',{
    x : 400,
    y : 250,
    path : 'M {x} {y} l 10 0 l0 10 z',
    fill : 'red'
  });

  //函数,绘制环形
  var cpath = canvas.addShape('marker',{
    x : 350,
    y : 250,
    radius : 8,
    symbol : function(x,y,r){
      return [['M',x,y - r],['a',r,r,0,1,1,0,2*r],['a',r,r,0,1,1,0,-2*r],['M',x,y-r+2],['a',r-2,r-2,0,1,0,0,2*(r-2)],['a',r-2,r-2,0,1,0,0,-2*(r - 2)],['z']];
    },
    fill : 'blue'
  });

  //所有事件可以在分组、画板上监听
  canvas.on('click',function  (ev) {
    var shape = ev.target.shape;
    if(shape){
      var preRadius = shape.attr('radius');
      if(preRadius < 100){
         shape.attr('radius',preRadius * 2);
      }else{
        shape.attr('radius',preRadius/2 );
      }
    }
  });

});
````


### 图形扩展

 * 扩展的图形，需要继承Canvas.Shape或者其子类
 * 覆写 parseElCfg 方法处理配置项，
 * 如果不是图形的基本绘制属性，创建 `__setXxx`函数，处理更绘制属性性操作，例如 `__setCx` 函数处理 cx属性发生改变时，circle.attr('cx',100);
 * 如果不是图形的基本绘制属性，创建 `__getXxx`函数用于获取绘制属性，例如 `__getCx` ，当circle.attr('cx') 时触发
 * 将扩展图形的构造函数注册到Canvas.Shape上
 * 添加图形时指定类别为构造函数名称的首写字母小写的字符串

下面是一个环形图形的示例：



````html

<div id="c3"></div>

````

````javascript

seajs.use(['index','achart-util'], function(Canvas,Util) {
  
  var Ring = function(cfg){
    Ring.superclass.constructor.call(this,cfg);
  };

  
  Ring.ATTRS = {  //声明属性，不影响默认值
    /**
     * 圆心x坐标
     * @type {Number}
     */
    cx : null,
    /**
     * 圆心y坐标
     * @type {Number}
     */
    cy : null,
    /**
     * 半径
     * @type {Number}
     */
    r : null,

    /**
     * 内部半径
     * @type {Number}
     */
    ir : null

  };

  Util.extend(Ring,Canvas.Shape.Path); //继承自path

  Util.augment(Ring,{

    /**
     * @protected
     * 格式化初始化配置项
     */
    parseElCfg : function(attrs){
      attrs.type = 'path'; //将线转换成path
      attrs.path = this._getRingPath(attrs.cx,attrs.cy,attrs.r,attrs.ir);
      return attrs;
    },
    _getRingPath : function(x,y,r,ir){
      
      return [['M',x,y - r],['a',r,r,0,1,1,0,2*r],['a',r,r,0,1,1,0,-2*r],['M',x,y-ir],['a',ir,ir,0,1,0,0,2*ir],['a',ir,ir,0,1,0,0,-2*ir],['z']];
    },
    __setCx : function(cx){
      var attrs = this.get('attrs');

      this._setRing(cx,attrs.cy,attrs.r,attrs.ir);
    },
    __getCx : function(){
      return this.get('attrs').cx;
    },
    __setCy : function(cy){
      var attrs = this.get('attrs');

      this._setRing(attrs.cx,cy,attrs.r,attrs.ir);
    },
    __getCy : function(){
      return this.get('attrs').cy;
    },
    __setR : function(r){
      var attrs = this.get('attrs');

      this._setRing(attrs.cx,attrs.cy,r,attrs.ir);
    },
    __getR : function(){
      return this.get('attrs').r;
    },
    __setIr : function(ir){
      var attrs = this.get('attrs');

      this._setRing(attrs.cx,attrs.cy,attrs.r,ir);
    },
    __getIr : function(){
      return this.get('attrs').ir;
    },
    //设置属性
    _setRing : function(x,y,r,ir){
      var attrs = this.get('attrs');

      Util.mix(attrs,{
        cx : x,
        cy : y,
        r : r,
        ir : ir
      });

      this.attr('path',this._getRingPath(x,y,r,ir));
    }
  });
  
  Canvas.Shape.Ring = Ring;

  var canvas = new Canvas({
    id : 'c3',
    width : 500,
    height : 300
  });

  canvas.addShape('ring',{
    cx : 100,
    cy : 100,
    r : 40,
    ir : 35,
    stroke : 'red'
  });

  canvas.addShape('ring',{
    cx : 100,
    cy : 150,
    r : 40,
    ir : 35,
    stroke : 'blue'
  });
  

  canvas.addShape('ring',{
    cx : 200,
    cy : 100,
    r : 40,
    ir : 35,
    fill : 'red'
  });

  canvas.addShape('ring',{
    cx : 200,
    cy : 150,
    r : 40,
    ir : 35,
    fill : 'blue'
  });
  

  canvas.on('click',function(ev){
    var shape = ev.target.shape;
    if(shape){
      shape.attr({
        r : shape.attr('r') + 5,
        ir : shape.attr('r')
      });
    }
  });

})

````

### 更多

  * 更多的扩展请参考：[分组和图形扩展](6-extend.md)
  * 关于图形属性和绘制属性的差异请参考:[属性](7-attrs.md)

### [API](../#Shape)

