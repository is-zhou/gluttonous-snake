(function() {
  var food = new Food();
  var snake = new Snake();
  var settings = new Setting();
  var map = document.getElementById("map");
  var start = document.getElementById("start");
  var score = document.getElementById("score");
  var difficultyOptions = document.getElementById("difficultyOptions");
  var eatenFood = null; //新吃到的食物对象
  var pause = null; //游戏状态是否暂停
  var gameInterval = null; //游戏循环定时器对象
  var count = 0; //吃到的食物计数
  /* ============首先在map上绘制基本图形================ */
  food.produceFood(map, snake.snakeList); //绘制产生的食物
  snake.produceSnake(map); //绘制蛇

  /* ==============获取或设置游戏难度=================== */
  //获取难度选择列表
  var sapnList = difficultyOptions.getElementsByTagName("span");
  //设置默认选择难度1
  sapnList[0].style.background = "red";
  //遍历难度列表sapnList
  for (let i = 0; i < sapnList.length; i++) {
    //为列表每一项设置点击事件
    sapnList[i].onclick = function() {
      //点击当前项时先清空原有选择项样式
      for (let j = 0; j < sapnList.length; j++) {
        sapnList[j].style.background = "lightslategray";
      }
      //根据选择项设置游戏难度
      settings.difficulty = i + settings.degreeOfDifficulty;
      //设置选中样式
      sapnList[i].style.background = "red";
    };
  }
  /* ===============监听开始按钮单击事件==================== */
  //单击开始按钮开始游戏
  start.onclick = function(params) {
    pause = false; //把停止状态设置为false为不停止
    start.style.display = "none"; //设置开始按钮不可见
    startGame(); //开始游戏
  };
  /* ===============开始游戏函数==================== */
  function startGame() {
    gameInterval = setInterval(
      updatePicture,
      settings.speed / settings.difficulty
    );
  }
  //更新画面函数
  function updatePicture() {
    snake.move();
    snake.produceSnake(map);
    var list = snake.snakeList;

    if (
      -1 >= list[0].x ||
      list[0].x >= map.offsetWidth / snake.width ||
      -1 >= list[0].y ||
      list[0].y >= map.offsetHeight / snake.height
    ) {
      clearInterval(gameInterval);
      eatenFood = null;
      snake.snakeList = [
        { x: 3, y: 2, imgs: "url(img/tou.png)" },
        { x: 2, y: 2, imgs: "url(img/sheng.png)" },
        { x: 1, y: 2, imgs: "url(img/sheng.png)" }
      ];
      food.delFood();
      food.produceFood(map, snake.snakeList);
      snake.direction = "r";
      score.innerText = 0;
      snake.produceSnake(map);
      if (confirm("游戏结束，点击确定重新开始")) {
        pause = false;
        startGame();
      } else {
        pause = true;
        start.style.display = "block";
      }
    }
    /*判断是否有新吃到的食物有的话就将食物添加到snake.snakeList蛇身数组对象再清空eatenFood对象
     */
    if (eatenFood != null) {
      snake.snakeList.push(eatenFood); //
      score.innerText = ++count * settings.difficulty;
      eatenFood = null;
    }
    /* 判断当食物的位置与蛇头的位置相同时
    删除当前食物
    保存当前蛇身最后一节的位置存在eatenFood吃到的食物对象中
    每吃到一个食物就在蛇尾增加一节即新的蛇尾
    */

    if (food.x == list[0].x && food.y == list[0].y) {
      food.delFood(); //删除食物对象
      var ophiurid = list[list.length - 1]; //取得当前蛇尾位置对象
      eatenFood = { x: ophiurid.x, y: ophiurid.y, imgs: ophiurid.imgs }; //取得当前蛇尾位置对象保存到新吃到的食物对象。
      food.produceFood(map, snake.snakeList); //产生新的食物
    }
  }
  /* ==============设置监听键盘按下操作事件改编蛇的方向==================== */
  document.onkeydown = function(params) {
    if (params.keyCode === 40 && snake.direction != "t") {
      //按下键盘下并且蛇正在运行方向不是上
      snake.direction = "b";
    } else if (params.keyCode === 37 && snake.direction != "r") {
      //左
      snake.direction = "l";
    } else if (params.keyCode === 39 && snake.direction != "l") {
      //右
      snake.direction = "r";
    } else if (params.keyCode === 38 && snake.direction != "b") {
      //上
      snake.direction = "t";
    } else if (params.keyCode === 32) {
      //空格
      pause = pause == false ? true : false;
      if (pause) {
        clearInterval(gameInterval);
        console.log("暂停游戏");
        start.style.display = "block";
      } else {
        startGame();
        start.style.display = "none";
      }
    }
  };
})();
