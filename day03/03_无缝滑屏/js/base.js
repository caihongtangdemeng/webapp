(function (w) {
  w.swiper={};
  function init(wrap) {
    //适配方案
    var styleNode=document.createElement("style");
    var w=document.documentElement.clientWidth/16;
    styleNode.innerHTML=`html{font-size:${w}px !important}`;
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
    var liNode=document.createElement(".swiper-wrap .list li");
    var styleNode=document.createElement("style")
    



  }

  w.swiper.init=init;
  w.swiper.slide=slide
})(window);
