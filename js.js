(function(){
  var pinterest_doing = 0,//是否正在排列
      pinterest_current = 0,//当前排列到第几个
      pinterest_done = 0,//是否全部加在完毕
      pinterestObj = document.getElementById('pinterestList');

  function pinterestInit(obj,add){
    var perBlock = 16,//每次加载数量
        gapWidth = 25,//快间距
        containerPadding = 5,//外边距
        columns = 4;//最大列数

    pinterest_doing = 1;//开始排列
    obj.style.transition = "height 1s";//高度缓动
    var totalWidth = obj.offsetWidth;
    if (totalWidth <= 720) {
      columns --;
      if (totalWidth <= 552) {
        columns --;
        if (totalWidth <= 312) {
          columns --;
        }
      }
    }
    obj.className = 'pinterestUl';
    addClass(obj,'col'+columns);

    var singleWidth = totalWidth/columns - gapWidth,
        column = new Array();//存储每个列的高度
    for(var i = 0 ; i < columns ; i++){
      if (!column[i]) {
        column[i] = 0; //初始化，每个数组高度为0
      };
    }

    function findMaxHeight(){//查询最大高度
      var maxHeight = column[0],
          maxColumn = 0;
      for(var i = 0 ; i < column.length ; i ++){
        if (maxHeight <= column[i]) {
          maxHeight = column[i];
          maxColumn = i;
        };
      }

      return {"maxHeight":maxHeight,"maxColumn":maxColumn};//返回最高高度对象
    }

    function findMinHeight(){//查询最小高度
      var minHeight = column[0],
          minColumn = 0;
      for(var i = 0 ; i < column.length ; i++){
        if (minHeight > column[i]) {
          minHeight = column[i];
          minColumn = i;
        };
      }
      return {"minHeight":minHeight,"minColumn":minColumn}
    }

    var totalItem = obj.children.length;
    if (add) {
      pinterest_current += perBlock;
    };

    for(var num = 0 ; num < totalItem ; num++){//开始排列每块的位置
      if (num >= Math.max(pinterest_current,perBlock)) break;
      obj.children[num].style.display = "block";

      var atColum = findMinHeight().minColumn,
          atHeight = findMinHeight().minHeight;

      obj.children[num].style.left = atColum * (singleWidth + gapWidth) +containerPadding +'px';
      obj.children[num].style.top = gapWidth + atHeight +'px';
      column[atColum] += obj.children[num].offsetHeight +gapWidth;

      pinterest_current = num;//排列到第几块
    }

    if ((pinterest_current + 1) >= totalItem) {//全部加载完
      pinterest_done = 1;
      document.getElementById('pinterestDone').style.display = "block";
    };

    obj.style.height = (findMaxHeight().maxHeight + 30) +'px';
    setTimeout(function(){//防止浏览器崩溃
      pinterest_doing = 0;
    },500)
  }

  function getPic () {
    $.ajax({
      url: '',
      type: "GET",
      dataType: 'json',
      data: '',
      success: function(data) {
        var li = '';
        for(var i = 0 ; i < data.list.length ; i++){
          li += '<li class="pinterestLi"><img src="'+ data.list[i].cover_imgurl +'"/></li>';
        }
        pinterestObj.innerHTML = li;
        imagesLoaded('#pinterestList', function() {
          pinterestInit(pinterestObj)
        });
      }
    });
  }

  addEvent(window,"resize",function(){//窗口变化
    setTimeout(function(){
      if (pinterest_doing == 0) {
        pinterest_doing = 1;
        pinterestInit(pinterestObj);
      };
    },500);
  });

  /*addEvent(window,"scroll",function(){//滚动监听
    if (document.body.scrollHeight - getViewPortSize().y <= getScrollOffsets().y +2) {
      if(!pinterest_done){//没有完全加载完毕
        addClass(pinterestObj,"pinterestUl_loading");
      }else{//加载完毕显示提示语
        document.getElementById("pinterestDone").style.display = "block";
      }
      setTimeout(function(){
        if(pinterest_doing == 0){
          pinterest_doing = 1;
          pinterestInit(pinterestObj,true);
        }
      },500);
    };
  });*/

  getPic();

  function addEvent (el,name,fn) {
    if (el.addEventListener) return el.addEventListener(name,fn,false);
    return el.attachEvent('on'+name,fn);
  }

  function addClass(obj, cls) {
    obj.className += " " + cls;
  }

  function addDOMLoadEvent (init) {
    document.addEventListener("DOMContentLoaded",init,false)
  }
}())