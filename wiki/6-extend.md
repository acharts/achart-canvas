# 扩展

----

扩展分组和扩展图形

----

## 目录
  
  * 简介
  * 分组扩展
  * 图形扩展

### 简介

  * 本模块提供了3个可实例化的类 ： Canvas、Group和Shape，对于这3个类的扩展方式不尽相同
  * Canvas类，是画布，对于画布的扩展不建议进行类的继承，而是使用引用方式即可，例如一个图表Chart类，其中包含一个Canvas对象，是一种has-A的关系，并非 is-A
  * Group 和 Shape建议使用继承方式来扩展
  * 可以写一些代码片段（mixins)，需要时复制到控件的原型链上提供低耦合的共享和扩展


### 分组扩展

  * 分组扩展使用继承的方式来实现扩展，多个分组类共享的代码可以通过mixin引入到prototype上
  * 渲染的入口文件是 renderUI，必要时覆写 remove方法处理移除时的逻辑
  * 分组创建时传入addGroup方法中构造函数，即可创建分组
  * 默认属性可以声明在类的静态属性 ATTRS 上，通过getDefaultCfg 引入，这个过程在后面的图表控件中会自动处理，这里为了简化，所以并未子Group类上自动实现
  * 通过 _onRenderName 来处理 属性（name)变化时的逻辑

通过下面的Demo 来熟悉上面的过程：

  * 点击canvas一起移动
  * 点击变色按钮，颜色一起变化

````html
<button id="btnColor">变色</button>
<div id="c1"></div>
````

````js
seajs.use(['index','achart-util','jquery'], function(Canvas,Util,$) {

  var C = function(cfg){  //声明构造函数
    C.superclass.constructor.call(this,cfg); //调用父类构造函数
  };

  C.ATTRS = {
    circle : null,
    rect : null,
    color : null //设置color时，circle和 rect的填充颜色跟随变化
  };

  Util.extend(C,Canvas.Group); //继承自Group

  Util.augment(C,{  //在C类的prototype上附加方法
    
    //获取默认属性
    getDefaultCfg : function(){
      return Util.mix({},C.ATTRS);
    },
    //覆写入口函数
    renderUI : function(){
      C.superclass.renderUI.call(this);
      //TODO
      this._initC();
    },
    _onRenderColor : function(color){
      var _self = this;

      if(color){
        var rectShape = _self.get('rectShape'),
          circleShape = _self.get('circleShape');
        rectShape.attr('fill',color);
        circleShape.attr('fill',color);
      }
    },
    // 初始化
    _initC : function(){

      var _self = this,
        circle = _self.get('circle'),
        rect = _self.get('rect');

      if(circle){
        var c = _self.addShape('circle',circle);
        _self.set('circleShape',c);
      }

      if(rect){
        var r = _self.addShape('rect',rect);
        _self.set('rectShape',r);
      }

      if(circle && rect){
        _self.addShape('line',{
          x1 : circle.cx,
          y1 : circle.cy,
          x2 : rect.x,
          y2 : rect.y,
          stroke : 'green'
        });
      }
    },
    //覆写remove函数
    remove : function(){
      C.superclass.remove.call(this);
    }
  });
  
  var canvas = new Canvas({
    id : 'c1',
    width : 500,
    height : 200
  });

  var group = canvas.addGroup(C,{
    circle : {
      cx : 10,
      cy : 10,
      r : 40,
      stroke : 'red'
    },
    rect : {
      x : 40,
      y : 40,
      width : 40,
      height : 40,
      stroke : 'blue'
    },
    color : '#4092CC'
  });

  var colors = [ '#ff6600','#b01111','#ac5724','#572d8a','#333333','#7bab12','#c25e5e','#a6c96a','#133960','#2586e7'],
    index = 0;

  //更改颜色
  $('#btnColor').on('click',function(){
    var color = colors[index % colors.length];
    group.set('color',color);
    index = index + 1;
  });
  canvas.on('click',function(ev){

    var point = canvas.getPoint(ev.clientX,ev.clientY);

    group.move(point.x,point.y);
  });
});
````


### 代码片段

  * 多个分组共享一些逻辑时，需要提供一种共享代码的方案，继承耦合度太高，更简单的一种方式是单独实现一个模块，将模块的代码复制到分组的prototype上即可
  * 在后面图表的章节中我们提供了一种更为易用的方式来共享方法和属性，但是基本的思路是一致的
  * 下面是一个actived状态的共享代码片段，来判断是否有激活状态，设置、取消激活

    #### 代码片段声明

    ```js
    var Actived = function(){

    };

    Actived.ATTRS = {

      /**
       * 是否激活
       * @type {Boolean}
       */
      actived : false

    }; 

    Util.augment(Actived,{
      /**
       * 是否处于激活状态
       * @return {Boolean} 激活状态
       */
      isActived : function(){
        return this.get('actived');
      },
      /**
       * 设置激活
       */
      setActived : function(){
        this.setActiveStatus(true);
        this.set('actived',true);
      },
      /**
       * @protected
       * 设置图形的激活状态，提供模板方法
       * @param {Boolean} actived 是否激活
       */
      setActiveStatus : function(actived){
        
      },
      /**
       * 清除激活
       */
      clearActived : function(){
        this.setActiveStatus(false);
        this.set('actived',false);
        if(this.clearActivedItem){
          this.clearActivedItem();
        }
      }
    });

    ```

    #### 代码片段使用

    ```js

    var  C = function(cfg){
      C.superclass.constructor.call(this,cfg)
    };

    Util.extend(C,Group);

    Util.mixin(C,[Actived]); //可以引用多个代码片段

    Util.augment(C,{

      ...
      //覆写 setActiveStatus的模板方法
      setActiveStatus : function(actived){
        
      },
      ...

    });

    ```



### 图形扩展

  * 图形的扩展一般使用类的继承方式
  * 图形扩展的核心在于绘制属性如何转换成DOM上的属性，Shape 类提供了 parseElCfg(attrs) 方法来处理属性的变换
  * attr(name,value) 时会触发 __setName方法
  * attr(name) 时会触发 __getName方法
  * 扩展出来的类需要注册到Canvas.Shape类上，使用时小写类的首写字母作为类型传入 addShape方法

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

#### 说明

  * Ring 类继承自Canvas.Shape.Path类
  * 使用`__setCx、__setCy、__setR、__setIr` 来处理设置绘制属性逻辑
  * 使用`__getCx、__getCy、__getR、__getIr`来处理获取绘制属性逻辑
  * Canvas.Shape.Ring = Ring 将Ring 注册到Canvas.Shape上
  * addShape('ring',attrs) 来添加Ring



