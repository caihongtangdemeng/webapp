(function (w) {
  w.nav = {};

  function init({wrap,start,move,end,over}){

      //挑选一个适配方案
      var styleNode = document.createElement("style");
      var w = document.documentElement.clientWidth/16;
      styleNode.innerHTML = `html{font-size:${w}px!important}`;
      document.head.appendChild(styleNode)
      //禁止移动端事件的默认行为
      wrap.addEventListener("touchstart",(ev)=>{
          ev = ev || event;
          ev.preventDefault();
      })

     szmove(wrap,start,move,end,over)
  }
 
  function szmove(wrap,start,move,end,over){
      var node=wrap.children[0];
      var minY = wrap.clientHeight - node.offsetHeight;

      //滑屏元素一开始的位置 ; 手指一开始的位置
      var eleStartX = 0;
      var eleStartY = 0;
      var szStartX =0;
      var szStartY =0;

      // 手指上一次touchmove完成时的位置 手指上一次touchmove完成时的时间点
      // 每一次toucmove真正移动的距离 每一次toucmove完成的时间
      var lastPoint = 0;
      var lastTime = 0;
      var pointDisY = 0;
      var timeDisY = 0;
      //防抖动需要的变量n
      var isFirst=true;
      var isY=true;
      //即点即停需要的变量
      var clearTimer=0;

      wrap.addEventListener("touchstart",(ev)=>{
          ev = ev || event;
          // 防止minY在外部拿的不准确
          var minY = wrap.clientHeight - node.offsetHeight;

          var touchC = ev.changedTouches[0];

          eleStartY = transform.css(node,"translateY");
          eleStartX = transform.css(node,"translateX");
          szStartY  = touchC.clientY;
          szStartX  = touchC.clientX;

          //touchstart时手指的位置
          lastPoint =  touchC.clientY;
          lastTime = new Date().getTime();

          //正常滑屏时取消动画 清除手动橡皮筋效果的标识
          //重置pointDisX timeDisX 避免每次单纯点击导航时有意料之外的移动
          node.style.transition="";
          node.handMove = false;
          pointDisY =0;
          timeDisY=1; //避免出现nan 导致意想不到的bug

           //防抖动的值得重新置回来
           isFirst = true;
           isY = true;

           //实现即点即停
           clearInterval(clearTimer)
           //定义touchstart的钩子函数
           start&&(typeof start==="function")&&start.call(node)
      })
      wrap.addEventListener("touchmove",(ev)=>{
        
          if(!isY){
            return;
          }
          ev = ev || event;
          var touchC = ev.changedTouches[0];

          var nowPoint = touchC.clientY; //当次touchmove时 手指的位置
          var nowTime = new Date().getTime();
          pointDisY = nowPoint - lastPoint //当次touchmove 距离 上一次touchmove 我们手指移动的距离
          timeDisY = nowTime - lastTime;
          lastPoint = nowPoint;
          lastTime = nowTime;

          var szNowY = touchC.clientY;
          var szNowX = touchC.clientX;
          var szDisY = szNowY - szStartY;
          var szDisX = szNowX - szStartX;
          var translateY= eleStartY + szDisY;

          var scale = 1;
          if(translateY > 0){
              //上侧橡皮筋效果的逻辑
              node.handMove = true; //如果为true代表了进行了手动橡皮筋效果的
              scale = document.documentElement.clientHeight / ((document.documentElement.clientHeight + translateY)*2.5);
          }else if (translateY < minY) {
              //下侧橡皮筋效果的逻辑
              node.handMove = true;
              var over = minY - translateY;
              scale = document.documentElement.clientHeight / ((document.documentElement.clientHeight + over)*2.5);
          }
          translateY = transform.css(node,"translateY")+(pointDisY*scale);

          //判断首次滑屏方向
          if(isFirst){
            isFirst=false;
            if(Math.abs(szDisX)>Math.abs(szDisY)){
              isY=false;
              return;
            }
          }
          transform.css(node,"translateY",translateY)
          move&&(typeof move==="function")&&move.call(node);
      })
      wrap.addEventListener("touchend",()=>{


          if(node.handMove){
              //説明touchend事件触发时 是处于手动橡皮筋效果中的  --> 正常的回到边界位置即可
              var translateY = transform.css(node,"translateY");
              if(translateY > 0){
                  
                  translateY = 0;
              }else if (translateY < minY) {
                 
                  translateY = minY;
              }
              node.style.transition = ".5s transform"
              transform.css(node,"translateY",translateY);
          }else{
              //説明touchend事件触发时 手动橡皮筋效果没有被触发  --> 进行带橡皮筋效果的快速滑屏
              fast()
          }

          end&&(typeof end==="function")&&end.call(node);
          function fast() {
              //Tween算法相关的函数
              var Tween ={
                Linear: function(t,b,c,d){ return c*t/d + b; },
                Back: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                }
            }
              function tweenMove(type,translateY,time) {
                clearInterval(clearTimer);
                var t=0;//代表的是当前是哪一次
                var b=transform.css(node,"translateY")//快速滑屏的初始位置
                var c=translateY-b;
                var d=(time*1000)/(1000/60) //总次数
                clearTimer=setInterval(() => {
                  t++;
                  if(t>d){
                    clearInterval(clearTimer);
                    //快速滑屏结束
                    over&&(typeof over==="function")&&over.call(node);
                    return;
                  }
                     //为快速滑屏添加move钩子
                     move && (typeof move === "function") && move.call(node)
                     transform.css(node,"translateY",Tween[type](t,b,c,d))
                }, 1000/60)
              }
              var time = 1; //快速滑屏的总时间
              var speed = pointDisY / timeDisY;
              speed = Math.abs(speed) < 0.5 ? 0 : speed;
              var translateY = transform.css(node,"translateY");
              translateY = translateY + speed*200;
              var type = "Linear"
              if(translateY > 0){
                  translateY = 0;
                  type="Back";
              }else if (translateY < minY) {
                  translateY = minY;
                  type="Back";
              }
             tweenMove(type,translateY,time)
          }
      })
  }

  w.scroll.init = init;
})(window)