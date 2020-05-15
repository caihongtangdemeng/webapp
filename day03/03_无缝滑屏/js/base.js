(function (w) {
  w.swiper={};
  function init(wrap) {
    //适配方案
    var styleNode=document.createElement("style");
    var w=document.documentElement.clientWidth/16;
    styleNode.innerHTML=`html{font-size:${w}px!important}`;
    document.head.appendChild(styleNode)
    //禁止移动端事件的默认行为
    wrap.addEventListener("touchstart",(ev)=>{
      ev=ev||event;
      ev.preventDefault();
    })
  };
  function slide(arr) {
    var swiperWrap=document.querySelector(".swiper-wrap")
    var ulNode=document.createElement("ul");
    var styleNode=document.createElement("style")
    var pointWrap=document.querySelector(".swiper-wrap .point-wrap")
    var liNode=document.querySelector(".swiper-wrap .list li");
    if(!swiperWrap){
      throw new Error("页面没有swiper-wrap这个滑屏区域");
      return;
    }
    ulNode.classList.add("list");
    for(var i=0;i<arr.length;i++){
      ulNode.innerHTML+="<li><img src="+(arr[i])+"></li>";
    }
    swiperWrap.appendChild(ulNode);

    styleNode.innerHTML=".swiper-wrap .list{width:"+(arr.length)+"00%}";
    styleNode.innerHTML+=".swiper-wrap .list li{width:"+(100/arr.length)+"%}";
    document.head.appendChild(styleNode);
    //小圆点
    if(pointWrap){
      for(var i=0;i<arr.length;i++){
        if(i==0){
          pointWrap.innerHTML+="<span class='active'></span>"
        }else{
          pointWrap.innerHTML+="<span></span>"
        }
      }
    }
  //重新渲染滑屏区域高度
  liNode=document.querySelector(".swiper-wrap .list li");
  setTimeout(() => {
    swiperWrap.style.height=liNode.offsetHeight+"px";
  }, 200);

  move(swiperWrap,ulNode,arr)
  }
  //滑屏方法move
  //1.拿到滑屏元素一开始位置
  //2.计算手滑动的距离
  //3.滑屏元素起始距离加上手滑动距离，得到滑屏元素滑动距离
  function move(wrap,node,arr) {
    var eleStartX=0;
    var touchStartX=0;
    var touchDisX=0;
    var index=0;
    node.style.transition="";
    wrap.addEventListener("touchstart",function (ev) {
      ev=ev||event;
      var touchC=ev.changedTouches[0];
      touchStartX=touchC.clientX;
      eleStartX=node.offsetLeft;
    })
    wrap.addEventListener("touchmove",function (ev) {
      ev=ev||event;
      var touchC=ev.changedTouches[0];
      var touchNowX=touchC.clientX;
      touchDisX=touchNowX-touchStartX;
      node.style.left=eleStartX+touchDisX+"px";
    })
    wrap.addEventListener("touchend",function () {
      if(touchDisX>0){
        //正值 向右划 下标减
        index--;
      }else if(touchDisX<0){
        //负值 向左划 下标加
        index++;
      }
      if(index<0){
        index=0;
      }else if(index>arr.length-1){
        index=arr.length-1;
      }
      node.style.transition=".5s left"; //过渡
      node.style.left=-index*document.documentElement.clientWidth+"px";

    })




  }

  w.swiper.init=init;
  w.swiper.slide=slide
})(window);
