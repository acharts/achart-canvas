# container

----

##[back](../)

## 属性

* children 子控件

## 方法

### 添加

* addShape(cfg) 添加图形,一般用于增加基本属性之外的一些属性如id,zIndex,visible等属性 

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
  ```
* addShape(type,attrs) 添加图形的重载方法,快速创建图形 

  ```js
  var shape = canvas.addShape('rect',{
      width : 100,
      height : 100,
      x : 100,
      y : 100,
      stroke : 'red'
  });
  ```
* addGroup(C,cfg) 或者 addGroup(cfg) 创建分组 

  ```js
  var group = canvas.addGroup({id : 'g1'});

  group.addShape(...);

  group.addGroup();
  ```

### 查找

* getChildAt(index) 根据索引获取子控件
* getFirst() 获取第一个
* getLast() 获取最后一个
* getCount() 获取子控件的个数
* find(id) 根据id获取子控件
* findByNode(node) 根据DOM节点查找对应的子控件
* findBy(fn) 根据匹配函数获取一个子控件

  ```js
  canvas.findBy(function(item){
      return item.get('name') === 'n1';
  });
  ```

### 其他

* sort() 排序子控件，根据zIndex排序
* clear() 清除子控件

##[back](../)
