# 事件

----

DOM 的事件和自定义事件

----

## 目录

  * 支持的事件
  * DOM事件
  * 自定义事件

### 支持的事件

  * Canvas,Group和Shape都有对应的DOM存在，所以DOM的事件以上3者都支持，并支持冒泡。例如：click,mouseover,mousedown,mouseup,mouseout等事件
  * Canvas,Group和Shape 通过 on,off和fire 3个方法处理事件的添加、删除和触发
  * Canvas,Group和Shape 可以注册自定义事件，通过fire方法触发自定义事件

### DOM 事件

  通过下面的示例来了解图形控件对DOM事件的支持

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

### 自定义事件

  * 某些场景下，需要提供自定义事件，方便用户进行相应，同时提供方便的参数

  下面是一个自定义事件的示例：

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

      this.fire('ringchange',{ //触发自定义事件ringchange
        cx : x,
        cy : y,
        r :r,
        ir : ir
      });
    }
  });
  
  Canvas.Shape.Ring = Ring;

  var canvas = new Canvas({
    id : 'c3',
    width : 500,
    height : 500
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

  var ring1 = canvas.addShape('ring',{
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

  //监听自定义事件
  ring1.on('ringchange',function(ev){
    console.log(ev);
  });
})

````

 #### 说明

  * 改变Ring属性时，触发ringchange事件
  * 在Ring实例上绑定ringchange事件，参数接收变化的cx,cy,r,ir

### 更多

  * 监听DOM的事件和自定义事件在后面的图形控件中有大量的使用，自定义事件是一种非常良好的扩展方式。


