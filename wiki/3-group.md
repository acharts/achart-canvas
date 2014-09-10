# 分组

----

分组的功能使用

----


## 目录

 * 分组简介
 * 分组创建
 * 组织图形
 * 分组扩展


### 分组简介

 * 分组用于组织图形，将所有的图形组合到一个标签中便于理解和调试
 * 移动分组时可以同时移动内部的所有图形

### 分组创建

#### 分组有3种创建方式：

 * 不配置任何参数：

   ```js

   var group = canvas.addGroup();

   ```
 * 配置属性

   ```js

   canvas.addGroup({
      id : 'g1',
      elCls : 'my-group'
   });

   var group = canvas.find('g1');

   ```

 * 指定构造函数

   ```js
   canvas.addGroup(C,{  //C 是继承自Group的子类
      id : 'g2',
      elCls : 'my-group',
      ... //自定义属性
   });

   ```

### 组织图形

  * 分组中可以添加任意图形和分组
  * 可以方便查找、删除图形

    ```js

    var group = canvas.addGroup();

    group.addShape('circle',{...});  //圆形

    group.addShape({ //矩形
      id : 'r1',
      type : 'rect',
      attrs : {...}
    });

    group.translate(50,50); //移动到50，50

    group.translate(50,50); //移动到 100,100

    group.move(200,200); //移动到200，200

    var rect = group.find('r1'); //查找

    rect.attr({...}) //更改属性

    group.clear(); //清空

    group.remove(true);//移除并且destroy

    ```

### 分组扩展

 * 通常使用继承的方式扩展分组
 * 创建分组后的入口文件是 renderUI
 * 如果有需要重写 remove 方法
 * 通过将构造函数传入addGroup方法创建分组
 
下面是一个扩展分组的实例，内部包含一个圆，一个矩形，2者存在一个连线,点击canvas一起移动

````html

<div id="c1"></div>
````

````js
seajs.use(['index','achart-util'], function(Canvas,Util) {

  var C = function(cfg){  //声明构造函数
    C.superclass.constructor.call(this,cfg); //调用父类构造函数
  };

  C.ATTRS = {
    circle : null,
    rect : null
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
    }
  });

  canvas.on('click',function(ev){

    var point = canvas.getPoint(ev.clientX,ev.clientY);

    group.move(point.x,point.y);
  });
});
````

更复杂的扩展参看 ： [分组与图形扩展](6-extend.md)

### [API](../#Group)









 