!(function(){
  var setScrollTop=function(dom,pos){dom.scrollTop=document.body.scrollTop=document.documentElement.scrollTop=pos||0};
  var getScrollTop=function(dom){return dom.scrollTop||document.body.scrollTop||document.documentElement.scrollTop};
  window.ss__moving=window.requestAnimationFrame||function(cb){return window.setTimeout(cb,1000/60)}; //优先使用时钟，其次使用延时器
  window.ss__clearMoving=window.cancelAnimationFrame||window.clearTimeout;
  window.ss__scrollTo=function(dom,pos){
    dom=dom||document.body;
    pos=pos||0;
    var scrollTop=getScrollTop(dom);
    var space;
    switch(typeof pos){
      case "string":
        if(pos==="bottom"){
          pos=dom.scrollHeight-dom.clientHeight;
          if(scrollTop>=pos) return;
        }else{
          if(scrollTop===0) return;
          pos=0;
        }
      break;
      case "object":
        pos=pos.offsetTop;
      break;
      default:break;
    }
    space=Math.round((pos-scrollTop)/(Math.abs(pos-scrollTop)>window.innerHeight?36:18));
    var timer;
    (function run(){
      scrollTop+=space;
      var prevTop=getScrollTop(dom);
      setScrollTop(dom,scrollTop);
      if(prevTop===getScrollTop(dom)||(space>0?scrollTop>=pos:scrollTop<=pos)){
        setScrollTop(dom,pos);
        window.ss__clearMoving(timer);
        return;
      }
      timer=window.ss__moving(run);
    })();
  };
  window.ss__onscroll=function(dom,cb){
    dom=dom||document.body;
    dom.onscroll=window.onscroll=function(){
      var scrollTop=getScrollTop(dom);
      cb&&cb({
        top:scrollTop,
        bottom:dom.scrollHeight-scrollTop-dom.clientHeight,
        isTop: scrollTop===0,
        isBottom: scrollTop+dom.clientHeight===dom.scrollHeight
      })
    }
  }
  //------------------------以上是对滚动方法的兼容封装，以下是对苹果流畅滚动的解决方案----------------------------
  if (!/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(window.navigator.userAgent)) return;//如果是不是ios系统，直接退出
  document.body.style.WebkitOverflowScrolling="touch";//添加流畅滚动css
  //监听手势事件
  var startY,isfind;//记录位置，判断向下滑动还是向上滑动,是否已经找到目标滚动容器
  var supportPassive=false;
  window.addEventListener("",null,Object.defineProperty({},"passive",{get:function(){supportPassive=true}}));//判断浏览器是否默认开启了流畅滚动从而导致无法阻止事件
  function handleStart(e){
    startY=e.touches[0].screenY;//起点位置
  }
  function handleMove(e){
    var ele=e.target;
    while(ele!==document.body&&ele!==document&&!isfind){//找到最终冒泡到具有滚动能力的容器
      if(ele.nodeName==="INPUT"&&ele.getAttribute("type")==="range") return;//屏蔽原生滑竿
      var style=window.getComputedStyle(ele);
      if(!style){//如果不是正经元素继续向上寻找
        ele=ele.parentNode;
        continue;
      }
      var overflowY=style.getPropertyValue("overflow-y");
      if(overflowY!=="auto"&&overflowY!=="scroll"){//溢出隐藏，继续向上寻找
        ele=ele.parentNode;
        continue;
      }
      var canScroll=ele.scrollHeight>ele.clientHeight;//此元素具有滚动能力，继续判断能否触发滚动
      if(canScroll){
        var curY=e.touches[0].screenY;
        var isAtTop=(curY>=startY&&ele.scrollTop<=0);//已经在最顶部又向下滑
        var isAtBottom=(curY<=startY&&ele.scrollHeight<=ele.scrollTop+ele.clientHeight);//已经在最底部又向上滑
        if(isAtTop||isAtBottom){//如果是这两种情况，继续向上寻找
          ele=ele.parentNode;
          continue;
        }else{//找到了元素，下次不必再重新寻找，不阻止滚动
          isfind=true;
          return;
        }
      }
      ele=ele.parentNode;
    }
    !isfind&&e.preventDefault();//如果最终也没有发现可滚动容器，阻止事件,如果发现了滚动容器，在此次触摸滑动中不用再重新寻找元素不阻止事件
    startY=e.touches[0].screenY;//重置起点位置
  }
  function handleEnd(){
    isfind=false;//一次操作之后，要重新寻找元素
  }
  window.addEventListener("touchstart",handleStart,supportPassive?{passive:false}:false);
  window.addEventListener("touchmove",handleMove,supportPassive?{passive:false}:false);
  window.addEventListener("touchend",handleEnd,supportPassive?{passive:false}:false);
})();