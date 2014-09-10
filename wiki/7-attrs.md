# 属性

----

控件属性和绘制属性

----

## 目录

  * 简介
  * 控件属性
  * 绘制属性

### 简介

  * Canvas、Group和Shape是基础库提供的几个图形控件，这些图形控件存在很多属性，初始化时作为配置项传入控件
  * 控件创建后，可以通过get,set的方式来获取和设置控件属性
  * 图形控件 Shape 存在一些更图形绘制相关的属性，会直接影响绘制效果，为了方便组织和理解，所以放在了 控件的 attrs属性中统一配置和管理，称之为 `绘制属性`

### 控件属性

  * Canvas和Group 作为容器存在，不处理图形的绘制，所有的属性都是控件属性，所以通过 set,get处理即可
  * Shape控件除了控件属性外，还存在`绘制属性`
  * 当set(name,value) 时，控件会检测控件是否有 _onRenderName 方法，如果存在则调用，这是为了同步属性跟控件的状态提供的扩展方式
  * 如果 set(name,value) 没有对应的_onRenderName 方法，则仅仅是get(name)时可以返回设置的值，不会影响控件的其他状态 

```js
  var canvas = new Canvas({ //id,width,height都是控件属性
    id : 'id',
    width : 500,
    height : 500
  });
  
  canvas.get('id'); //id
  canvas.get('width'); //500

  canvas.set('width',1000); //由于canvas没有对应的_onRenderWidth方法，所以canvas对应的DOM的宽度不会发生改变

  
  var group = canvas.addGroup({ //id,elCls是控件属性
    id : 'g1',
    elCls : 'test'
  });

  group.get('node').className.value //test ，因为存在 _onRenderElCls的方法

  group.set('elCls','new'); //对应的DOM上的的class变成'new'

  group.addShape({ //添加矩形，id,type,attrs是控件属性，attrs内部是绘制属性
    id : 'r1',
    type : 'rect',
    attrs : {
      ....
    }
  });

```

### 绘制属性

  * Shape 作为显示图形的控件，需要一些图形相关的属性，为了跟基本的控件属性区别开来，所以防止在attrs中，通过attr(name)、attr(name,value)和 attr(obj)来进行操作
  * 添加图形时，可以通过attrs属性传入，也可以通过快捷的方式直接传入

    ```js
      group.addShape({ //添加矩形，id,type,attrs是控件属性，attrs内部是绘制属性
        id : 'r1',
        type : 'rect',
        attrs : {
          x :100,
          y : 100,
          width : 100,
          height : 100,
          stroke : 'red'
        }
      });

      group.addShape('rect',{ //通过快捷方式直接传入
        x :100,
        y : 100,
        width : 100,
        height : 100,
        stroke : 'red'
      });
    ```

  * Shape 设置、获取绘制属性时，往往直接设置到对应的DOM上或者直接从DOM上获取，但是当DOM上没有直接对应的属性时，则需要进行处理

    1. attr(name,value) 时，会检测是否存在__setName方法，如果存在则调用
    2. attr(name) 时则检测是否存在__getName方法，如果存在则调用

  下面是一个Ring的实例：

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