//创建自调用函数，模拟块及作用域，防止命名冲突
(function() {
  var divList = [];
  function Snake(options) {
    options = options || {};
    this.width = options.width || 25;
    this.height = options.height || 25;
    this.direction = options.direction || "r";
    this.snakeList = [
      { x: 3, y: 2, imgs: "url(img/tou.png)" },
      { x: 2, y: 2, imgs: "url(img/sheng.png)" },
      { x: 1, y: 2, imgs: "url(img/sheng.png)" }
    ];
  }
  //根据snakeList中每一节蛇节，在map上画出蛇
  Snake.prototype.produceSnake = function(map) {
    //每次重新绘制蛇的时候，先将已经绘制出的蛇清除掉
    if (divList.length != 0) {
      //判断是否有已经绘制的蛇节
      for (let i = 0; i < divList.length; i++) {
        //遍历出每一个绘制的蛇节
        map.removeChild(divList[i]); //从map中移除每一个蛇节
      }
      divList = []; //清空保存的已绘制蛇节div对象
    }
    //遍历所有蛇节坐标根据每一个蛇节坐标绘制蛇节添加到map上组成蛇
    for (let i = 0, len = this.snakeList.length; i < len; i++) {
      //根据每个蛇节对象的坐标大小颜色绘制蛇节
      var snakeDiv = document.createElement("div");
      snakeDiv.style.position = "absolute";
      snakeDiv.style.width = this.width + "px";
      snakeDiv.style.height = this.height + "px";
      snakeDiv.style.left = this.width * this.snakeList[i].x + "px";
      snakeDiv.style.top = this.height * this.snakeList[i].y + "px";
      snakeDiv.style.backgroundImage = this.snakeList[i].imgs;
      snakeDiv.style.backgroundSize = "100%";
      divList.push(snakeDiv); //保存好绘制的蛇节
      map.appendChild(snakeDiv); //将蛇节添加到map上
    }
  };
  //蛇移动函数
  Snake.prototype.move = function() {
    //从最后一个位置开始遍历除数组中第一位置蛇头外的所有蛇身位置，将前一个位置赋值给后一个位置
    //蛇移动中除蛇头外每一节移动的位置刚好就是上一节的位置
    for (var i = this.snakeList.length - 1; i > 0; i--) {
      this.snakeList[i].x = this.snakeList[i - 1].x;
      this.snakeList[i].y = this.snakeList[i - 1].y;
    }
    //获取蛇头位置对象
    var snakehead = this.snakeList[0];
    //判断蛇目前移动的方向，在对应的方向轴上+1；更新蛇头的位置
    switch (this.direction) {
      case "r":
        snakehead.x += 1;
        break;
      case "l":
        snakehead.x -= 1;
        break;
      case "t":
        snakehead.y -= 1;
        break;
      case "b":
        snakehead.y += 1;
        break;
      default:
        break;
    }
  };
  window.Snake = Snake;
})();
