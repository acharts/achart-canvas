var  Util = require('achart-util');

var Raphael = require('achart-raphael'),
  HANDLERS = {

  },
  TIMES = {},//动画的事件校验
  NAN = NaN,
  PRE_HAND = 'h',
  objectPrototype = Object.prototype,
  toString = objectPrototype.toString;
  
//分步动画
function animTime(duration,fn,callback){
    var baseTime = new Date().getTime(),
      baseInterval = 16,
      uid = Util.guid(PRE_HAND);

    next(0,fn,duration,callback);
    function next(num,fn,duration,callback){
      var nowTime = new Date().getTime();
      var durTime = nowTime - baseTime;
      if(durTime >= duration){
        fn(1,num);
        callback && callback();
        return ;
      }

      var factor = Math.pow(durTime/duration, 1.7);
      fn(factor,num);
      HANDLERS[uid] =  Util.requestAnimationFrame(function(){
        next(num+1,fn,duration,callback);
      });
    }
    return uid;
  } 

function stopStep(uid){
  if(HANDLERS[uid]){
      Util.cancelAnimationFrame(HANDLERS[uid]);
    delete HANDLERS[uid];
    //delete TIMES[uid];
  }
}


var ARR_EV = ['srcElement','toElement','clientX','clientY','keyCode'];

function getEventObj(ev){
  var  rst = {};
  rst.target = ev.srcElement;
  rst.pageX = ev.clientX + document.body.scrollLeft - document.body.clientLeft;
  rst.pageY = ev.clientY + document.body.scrollTop - document.body.clientTop;
  Util.each(ARR_EV,function(key){
    rst[key] = ev[key];
  });
  rst.stopPropagation = function(){
    window.event.cancelBubble = true;  
  }
  return rst;
}

var fragmentRE = /^\s*<(\w+|!)[^>]*>/,
  table = document.createElement('table'),
  tableRow = document.createElement('tr'),
  containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
  };


Util.mix(Util,{


  /**
   * 是否是vml
   * @member Chart.Util
   * @type {Boolean}
   */
  vml : Raphael.vml,
  /**
   * 是否是svg
   * @member Chart.Util
   * @type {Boolean}
   */
  svg : Raphael.svg,
  /**
   * 创建DOM 节点
   * @member Chart.Util
   * @param  {String} str Dom 字符串
   * @return {HTMLElement}  DOM 节点
   */
  createDom : function(str){
    var name = fragmentRE.test(str) && RegExp.$1;

    if (!(name in containers)){
      name = '*'
    }
    container = containers[name];
    str = str.replace(/(^\s*)|(\s*$)/g, "");
    container.innerHTML = '' + str;
    return container.childNodes[0];
  },
  getOffset : function(o){
    var rst = {},
      left = 0,
      top = 0;
    while (o!=null && o!=document.body){
    
        left += (o.offsetLeft || 0);
        top += (o.offsetTop || 0);
        o = o.offsetParent;
    };
    rst.top = top;
    rst.left = left;
    return rst;
  },
  /**
   * 是否包含指定节点
   * @member Chart.Util
   * @param  {HTMLElement} node    节点
   * @param  {HTMLElement} subNode 子节点
   * @return {HTMLElement} 是否包含在节点中
   */
  contains : function(node,subNode){
      if(!node || !subNode){
        return false;
      }
      var rst = false,
        parent = subNode.parentNode;
      while(parent!=null && parent!=document.body){
        if(parent == node){
          rst = true;
          break;
        }
        parent = parent.parentNode;
      }

      return rst;
  },
  /**
   * 获取宽度
   * @member Chart.Util
   * @param  {HTMLElement} el  dom节点
   * @return {Number} 宽度
   */
  getWidth : function(el){
    var width = Util.getStyle(el,'width');
    if(width == 'auto'){
      width = el.offsetWidth;
    }
    return parseFloat(width);
  },
   /**
   * 获取高度
   * @member Chart.Util
   * @param  {HTMLElement} el  dom节点
   * @return {Number} 高度
   */
  getHeight : function(el){
    var height = Util.getStyle(el,'height');
    if(height == 'auto'){
      height = el.offsetHeight;
    }
    return parseFloat(height);
  },
  /**
   * 获取外层宽度
   * @member Chart.Util
   * @param  {HTMLElement} el  dom节点
   * @return {Number} 宽度
   */
  getOuterWidth : function(el){
    var width = Util.getWidth(el),
      bLeft = parseFloat(Util.getStyle(el,'borderLeftWidth')) || 0,
      pLeft = parseFloat(Util.getStyle(el,'paddingLeft')),
      pRight = parseFloat(Util.getStyle(el,'paddingRight')),
      bRight = parseFloat(Util.getStyle(el,'borderRightWidth')) || 0;

    return width + bLeft + bRight + pLeft + pRight;
  },
  /**
   * 获取外城高度
   * @member Chart.Util
   * @param  {HTMLElement} el  dom节点
   * @return {Number} 高度
   */
  getOuterHeight : function(el){
     var height = Util.getHeight(el),
      bTop = parseFloat(Util.getStyle(el,'borderTopWidth')) || 0,
      pTop = parseFloat(Util.getStyle(el,'paddingTop')),
      pBottom = parseFloat(Util.getStyle(el,'paddingBottom')),
      bBottom = parseFloat(Util.getStyle(el,'borderBottomWidth')) || 0;

    return height + bTop + bBottom + pTop + pBottom;
  },
  /**
   * 获取样式
   * @member Chart.Util
   * @param  {HTMLElement} el  dom节点
   * @param  {String} name 样式名
   * @return {String} 属性值
   */
  getStyle : function(el,name){
    if(window.getComputedStyle){
      return window.getComputedStyle(el,null)[name];
    }
    return el.currentStyle[name];
  },
  /**
   * 添加事件
   * @member Chart.Util
   * @param {HTMLElement}   node  节点
   * @param {String}   type 事件名称
   * @param {Function} fn   回调函数
   */
  addEvent : function( obj, type, fn ) {
    if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){
          window.event.target = window.event.srcElement;
          obj['e'+type+fn]( getEventObj(window.event) );
        }
        obj.attachEvent( 'on'+type, obj[type+fn] );
    } else
        obj.addEventListener( type, fn, false );
  },
  /**
   * 移除事件
   * @member Chart.Util
   * @param {HTMLElement}   node  节点
   * @param {String}   type 事件名称
   * @param {Function} fn   回调函数
   */
  removeEvent : function( obj, type, fn ) {
      if ( obj.detachEvent ) {
          obj.detachEvent( 'on'+type, obj[type+fn] );
          obj[type+fn] = null;
      } else
          obj.removeEventListener( type, fn, false );
  },
  angle : function(x1, y1, x2, y2){
    return Raphael.angle(x1, y1, x2, y2);
  },
  /**
   * 分步执行动画
   * @member Chart.Util
   * @param  {Number}   duration 执行时间
   * @param  {Function} fn  每一步执行的回调函数，function(step,total){}
   * @param  {Function} callback 回调函数
   * @return {String} 动画的handler用于终止动画
   */
  animStep : function(duration,fn,callback){
    return  animTime(duration,fn,callback);
  },
  /**
   * 终止分步执行的动画
   * @member Chart.Util
   * @param  {String} handler 句柄
   */
  stopStep : function(handler){
    stopStep(handler);
  },
  /**
   * path执行动画
   * @member Chart.Util
   * @param  {Chart.Canvas.Shape.Path}   pathShape path图形
   * @param  {String|Array}   toPath  变换的path
   * @param  {Number}   reserve   附加几个节点
   * @param  {Number}   duration  执行时间
   * @param  {String}   easing    方法
   * @param  {Function} callback  回调函数
   */
  animPath : function(pathShape,toPath,reserve,duration,easing,callback){
    //vml阻止动画执行
    /**/
    if(Util.vml){
      after();
      return;
    }
    reserve = reserve || 0;
    duration = duration || 400;

    if(!toPath){
      after();
      return;
    }

    var curPath = pathShape.getPath(),
      endPath = Util.parsePathString(toPath),
      tempPath,
      last = curPath.slice(reserve * -1);

    if(curPath.length > endPath.length){
      tempPath = curPath.slice(0,endPath.length);
    }else{
      tempPath = curPath.concat([]);
      if(reserve){
        for(var i = tempPath.length; i < endPath.length;i ++){
          tempPath = tempPath.concat(last);
        }
      }
    }
    pathShape.attr('path',tempPath);

    pathShape.animate({path : endPath},duration,easing,after);

    function after(){
      pathShape.attr('path',toPath);
      callback && callback();
    }
  },
  /**
   * 获取path上的点
   * @member Chart.Util
   * @param  {String} path 路径
   * @param  {Number} length 长度
   * @return {Object}  {x: x-axis ,y: y-axis}
   */
  getPointAtLength : function(path, length){
    return Raphael.getPointAtLength(path,length);
  },
  /**
   * 节点是否在指定的Path中
   * @member Chart.Util
   * @param  {String} path 路径
   * @param {Number} x x坐标
   * @param {Number} y y坐标
   * @return {Boolean} 是否在path中
   */
  isPointInsidePath : function(path, x, y){
    return Raphael.isPointInsidePath(path,x,y);
  },
  /**
   * 获取子path
   * @member Chart.Util
   * @param  {String} path 路径字符串
   * @param  {Number} from 开始的节点
   * @param  {Number} to   结束的节点
   * @return {String} 子路径
   */
  getSubpath : function(path, from, to){
    return Raphael.getSubpath(path,from,to);
  },
  /**
   * 将path字符串转换成数组
   * @member Chart.Util
   * @param  {String} str 字符串
   * @return {Array}  数组
   */
  parsePathString : function(str){
    return Raphael.parsePathString(str);
  },

  /**
   * 将path数组转换成字符串
   * @member Chart.Util
   * @param  {Array} array 数组
   * @return {String}  字符串
   */
  parsePathArray : function(array){
    if(Util.isArray(array)){
      var path = Util.map(array,function(item){
        var str = item.join(' ');
        return str.replace(/([a-z,A-Z])\s+/,'$1');
      });
      return path.join(' ');
    }
    return array;
  },

  /**
   * 平移path
   * @member Chart.Util
   * @param  {String} path 路径
   * @param  {Array|String|Object} transform 平移路径
   * @return {Array} path数组
   */
  transformPath : function(path,transform){
    return Raphael.transformPath(path,transform);
  },
  
  /**
   * 设置值，仅当对象上没有此属性时
   * @member Chart.Util
   * @param  {Object} obj 对象
   * @param  {String} name  字段名
   * @param  {*} value 值
   */
  trySet : function(obj,name,value){
    if(obj && !obj[name]){
      obj[name] = value;
    }
    return obj[name];
  },
  /**
   * 将颜色变亮
   * @member Chart.Util
   * @param  {String} c  颜色
   * @param  {Number} percent 变亮的比例 0 - 1
   * @return {String} 变亮的颜色
   */
  highlight : function(c,percent){
    var color = Raphael.color(c),
      l = color.l * (1 + percent);
    return Raphael.hsl2rgb(color.h,color.s,l).hex;
  },
  /**
   * 将颜色变暗
   * @member Chart.Util
   * @param  {String} c  颜色
   * @param  {Number} percent 变暗的比例 0 - 1
   * @return {String} 变暗的颜色
   */
  dark : function(c,percent){
    var color = Raphael.color(c),
      l = color.l * (1 - percent);
    return Raphael.hsl2rgb(color.h,color.s,l).hex;
  }
});


module.exports = Util;