//实现防抖动
//判断用户上来的首次滑屏方向 如果是y轴方向 那以后不管怎么滑动都不会触发滑屏逻辑
//判断用户上来的首次滑屏方向 如果是x轴方向 那以后不管怎么滑动都会触发滑屏逻辑

(function (w) {
  w.swiper={};
  function init(wrap,arr) {
    var styleNode=document.createElement("style");
    var w=document.documentElement.clientWidth/16;
    styleNode.innerHTML=`html{font-size:${w}px !important}`;
    document.head.appendChild(styleNode)
    wrap.addEventListener("touchstart",(ev)=>{
      ev=ev||event;
      ev.preventDefault();
    })
    slide(arr);
  }
  function slide(arr) {
    var swiperWrap=document.querySelector(".swiper-wrap");
    var ulNode=document.createElement("ul");
    css(ulNode,"translateZ",0);
    var styleNode=document.createElement("style");
    var pointWrap=document.querySelector(".swiper-wrap .point-wrap");
    if(!swiperWrap){
      throw new Error("页面缺少swiper-wrap这个滑屏区域");
      return;
    }
    //小圆点逻辑
    if(pointWrap){
      pointWrap.size=arr.length;
      for(var i=0;i<arr.length;i++){
        if(i===0){
          pointWrap.innerHTML+="<span class='active'></span>"
        }else{
          pointWrap.innerHTML+="<span></span>"
        }
      }
    }

    //是否需要无缝
    var needWF=swiperWrap.getAttribute("needWF");
    if(needWF!==null){
      arr=arr.concat(arr);
    }
    //创建滑屏元素
    ulNode.classList.add("list");
    for(var i=0;i<arr.length;i++){
      ulNode.innerHTML+="<li><img src="+(arr[i])+"></li>"
    }
    swiperWrap.appendChild(ulNode);
    styleNode.innerHTML=".swiper-wrap .list{width:"+(arr.length)+"00%}";
    styleNode.innerHTML+=".swiper-wrap .list li{width:"+(100/arr.length)+"%}";
    document.head.appendChild(styleNode);

    var needAuto=swiperWrap.getAttribute("needAuto");
    move(swiperWrap,ulNode,pointWrap,arr,needWF,needAuto);

    if(needAuto!==null&&needWF!==null){
      autoMove(ulNode,pointWrap,0,arr)
    }
  };
  function move(wrap,node,pWrap,arr,needWF,needAuto) {
    var eleStartX=0;
    var eleStartY=0;
    var touchStartX=0;
    var touchStartY=0;
    var touchDisX=0;
    var touchDisY=0;
    var index=0;
    //防抖动需要的变量
    var isFirst=true;//让一段逻辑只执行一次需要的变量
    var isX=true;//用户的滑屏方向是否是x轴


    wrap.addEventListener("touchstart",function(ev){
      ev=ev||event;
      node.style.transition="";
       //停掉自动滑屏
      clearInterval(node.timer)
      //手指一开始位置
      var touchC=ev.changedTouches[0];
      touchStartX=touchC.clientX;
      touchStartY=touchC.clientY;
      //无缝逻辑
      if(needWF!==null){
        var whichPic=css(node,"translateX")/document.documentElement.clientWidth;
        if(whichPic===0){
          whichPic=-pWrap.size;
        }else if(whichPic===1-arr.length){
          whichPic=1-pWrap.size;
        }
        css(node,"translateX",whichPic*document.documentElement.clientWidth);
      }

      //元素一开始位置要在无缝后
      eleStartX=css(node,"translateX");
      eleStartY=css(node,"translateY");

      isFirst=true;
      isX=true;

    })

    wrap.addEventListener("touchmove",function (ev) {
      if(!isX){
        return;
      }

      ev=ev||event;
      var touchC=ev.changedTouches[0];
      var touchNowX=touchC.clientX;
      var touchNowY=touchC.clientY;

      touchDisX=touchNowX-touchStartX;
      touchDisY=touchNowY-touchStartY;
      if(isFirst){
        isFirst=false
        if(Math.abs(touchDisY)>Math.abs(touchNowX)){
          isX=false;
          return;
        }
      }


      css(node,"translateX",eleStartX+touchDisX)
    })
    wrap.addEventListener("touchend",function () {
      index=Math.round(css(node,"translateX")/document.documentElement.clientWidth);
      if(index>0){
        index=0
      }else if(index < (1-arr.length)){
        index=1-arr.length
      }
      if(pWrap){
        var points=pWrap.querySelectorAll("span");
        for(var i=0;i<points.length;i++){
          points[i].classList.remove("active");
        }
        points[-index%pWrap.size].classList.add("active");
      }
      node.style.transition=".5s transform";
      css(node,"translateX",index*document.documentElement.clientWidth);
      if(needAuto!==null&&needWF!==null){
        autoMove(node,pWrap,index)
      }
    })
  };
  function autoMove(node,pWrap,autoFlag,arr) {
    clearInterval(node.timer);
    node.timer=setInterval(function(){
      node.style.transition=".5s transform linear"
      autoFlag--;
      css(node,"translateX",autoFlag*document.documentElement.clientWidth);

      if(pWrap){
        var points=pWrap.querySelectorAll("span");
        for(var i=0;i<points.length;i++){
          points[i].classList.remove("active");
        }
        points[-autoFlag%pWrap.size].classList.add("active");
      }
    }, 2000);
     //代码的执行是非常快的 界面的渲染是滞后的
     node.addEventListener("transitionend",function() {
       if(autoFlag===1-arr.length){
         autoFlag=1-arr.length/2;
         node.style.transition=""
         css(node,"translateX",autoFlag*document.documentElement.clientWidth);
       }
     })
  }

  w.swiper.init=init
})(window)