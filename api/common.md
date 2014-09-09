# common api

----

##[back](../)

## 共同的属性和方法

### 属性

* zIndex 层级，排序时决定生成的顺序，后面生成的覆盖在前面生成的上面
* node ： 只读属性，获取图形或者分组对应的DOM
* visible : 是否可见
* canvas ： 获取对应的画布对象
* autoRender ： 是否自动渲染，默认为true

### 方法

* get(name) : 获取属性值
* set(name,value) : 设置属性值
* show() ： 显示
* hide() ： 隐藏
* render() ： 渲染

* on(type,fn) : 绑定事件，可以是dom对应的事件，也可以是自定义事件
* off(type,fn) : 解除绑定，如果没有参数时全部去除事件
* remove(destroy) : 移除，参数决定是否调用析构函数

* destroy() ： 析构函数


##[back](../)
