# Demo

---

## 基本图形

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
  var path = canvas.addShape('path',{
    path : 'M250,225L250,70M250,225L359.60155108391484,115.39844891608514M250,225L405,225M250,225L359.60155108391484,334.60155108391484M250,225L250.00000000000003,380M250,225L140.39844891608516,334.60155108391484M250,225L95,225.00000000000003M250,225L140.39844891608513,115.39844891608516',
    stroke : '#c0c0c0',
    'clip-rect' : '0,0,100,100'
  });
  
  path.animate({
    'clip-rect' : '0,0,500,500'
  },1000)

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

## 图形分组

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

  var group = canvas.addGroup({
    elCls : 'group12',
    attrs : {
      'clip-rect' :'0,0,100,100'
    }
  });
  


  canvas.addGroup({
    id : 'my-group',
    x : 100,
    y : 100
  });

  group.addShape('circle',{
    cx : 125,
    cy : 100,
    r : 20,
    fill : '#2f7ed8',
    stroke : ''
  });

  group.attr('clip-rect','');

  group.animate({ //分组的动画仅支持平移
    x : 300,
    y : 200

  },1000);

  //通过id查找分组
  var mygroup = canvas.find('my-group');

  mygroup.addShape('rect',{
    x : 0,
    y : 0,
    height: 100,
    width : 100,
    fill : 'red',
    'fill-opacity':.5,
    stroke : 'yellow'
  });

});
````

## 图形填充

````html

<div id="c3"></div>

````

````javascript
seajs.use('index', function(Canvas) {
  
  var canvas = new Canvas({
    id : 'c3',
    width : 500,
    height : 500
  });

  //画矩形
  canvas.addShape('rect',{
    x : 100,
    y : 0,
    r : 5,
    width : 50,
    height: 50,
    stroke : 'yellow',
    fill : '0-#ff0000-#fff'
  });

  //画矩形
  canvas.addShape('rect',{
    x : 200,
    y : 0,
    r : 5,
    width : 50,
    height: 50,
    stroke : 'yellow',
    fill : '90-#ff0000-#fff'
  });

  //圆
  canvas.addShape('circle',{
    cx : 125,
    cy : 100,
    r : 20,
    stroke : '#red',
    fill : 'r(0.25, 0.75)#fff-#ff0000'
  });

  //椭圆
  canvas.addShape('ellipse',{
    cx : 200,
    cy : 100,
    rx : 20,
    ry : 30,
    fill : 'r(0.5, 0.5)blue-#fff',
    stroke : 'blue'
  });


});
````


## 图形动画

````html

<button id="J_Btn">path 动画</button>
<div id="c4"></div>

````

````javascript
seajs.use(['index','jquery'], function(Canvas,$) {
  
  var canvas = new Canvas({
    id : 'c4',
    width : 500,
    height : 500
  });

  var circle =   canvas.addShape('circle',{
      cx : 125,
      cy : 100,
      r : 20,
      fill : '#2f7ed8',
      stroke : ''
    });

  circle.on('click',function  () {
    circle.animate({
      fill : 'yellow',
      transform : 't100 100s2 2r45'//平移
    },1000,function () {
      circle.animate({
        fill : '#2f7ed8',
        transform : ''
      },1000);
    });
  });

    //path
  var path =  canvas.addShape('path',{
      path : 'M 25 208.31428571428572 L 35 208.31428571428572 L 105 209.22 L 175 185.67142857142858 L 245 140.3857142857143 L 315 106.87428571428572 L 385 76.9857142857143 L 455 43.47428571428571 L 525 31.69999999999999 L 595 60.68285714285713 L 665 105.96857142857144 L 735 145.82000000000002 L 805 184.7657142857143 L 815 184.7657142857143',
      stroke : '#c0c0c0'
    });
  $('#J_Btn').on('click',function () {
      path.animate({path : 'M 25 279.86571428571426 L 35 279.86571428571426 L 105 266.28 L 175 240.01428571428573 L 245 195.6342857142857 L 315 149.44285714285715 L 385 117.74285714285713 L 455 103.25142857142856 L 525 109.5914285714286 L 595 142.19714285714286 L 665 190.2 L 735 236.39142857142858 L 805 262.65714285714284 L 815 262.65714285714284'},2000);

  });
});
````

## 文本

````html

<div id="c5"></div>

````

````javascript
seajs.use('index', function(Canvas) {
  
  var canvas = new Canvas({
    id : 'c5',
    width : 500,
    height : 500
  });

  //基本的文本
  var text =  canvas.addShape('text',{
    text : 'hello !!!\n你好',
    x : 100,
    y : 100,
    fill : 'red',
    'font-size':16,
    'font-weight' : 'bold'
  });

  //支持平移、旋转
  var label = canvas.addShape('label',{
    text : 'hello !!!\n你好',
    x : 150,
    y : 100,
    rotate : 90,
    fill : 'blue',
    'font-size':16,
    'font-weight' : 'bold'
  });

});
````

## markers

````html

<div id="c6"></div>

````

````javascript
seajs.use('index', function(Canvas) {
  
  var canvas = new Canvas({
    id : 'c6',
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

## 图形事件

````html

<div id="c7"></div>

````

````javascript
seajs.use('index', function(Canvas) {
  
  var canvas = new Canvas({
    id : 'c7',
    width : 500,
    height : 500
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

  var group = canvas.addGroup();

  //圆
 var circle =  group.addShape('circle',{
    cx : 125,
    cy : 100,
    r : 20,
    fill : '#2f7ed8',
    stroke : 'red'
  });

  //椭圆
  group.addShape('ellipse',{
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

  //图片
  canvas.addShape('image',{
    x : 0,
    y : 400,
    width : 200,
    height : 250,
    src : 'http://i.mmcdn.cn/simba/img/T1dOKRFyVeXXb1upjX.jpg'
  });

  canvas.on('click',function (ev) {
    var shape = ev.target.shape;
    if(shape){
      $('#log').text(shape.get('type'));
    }
  });

  group.on('click',function(ev){
    var shape = ev.target.shape;
    if(shape){
      $('#log').text('group click ' + shape.get('type'));
      ev.stopPropagation();
    }
  });

  circle.on('mouseover',function(){
    circle.attr('fill','blue');
  });

  circle.on('mouseout',function(){
    circle.attr('fill','red');
  });
});
````




