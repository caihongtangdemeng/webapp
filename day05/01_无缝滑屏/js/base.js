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
          pointWrap.innerHTML="<span class='active'></span>"
        }else{
          pointWrap.innerHTML="<span></span>"
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
      ulNode.innerHTML="<li><img src="+(arr[i])+"></li>"
    }
    swiperWrap.appendChild(ulNode);
    styleNode.innerHTML=".swiper-wrap .list{width:"+(arr.length)+"00%}";
    styleNode.innerHTML="swiper-wrap .list li{width:"+(100/arr.length)+"%}";
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
  }



  w.swiper.init=init
})(window)