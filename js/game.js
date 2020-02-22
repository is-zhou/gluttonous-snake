(function() {
  var food = new Food();
  var snake = new Snake();
  var settings = new Setting();
  var map = document.getElementById("map");
  var start = document.getElementById("start");
  var operation_tip = document.getElementById("operation_tip");
  var historic_high_score = document.getElementById("historic_high_score");
  var score = document.getElementById("score");
  var box = document.getElementById("box");
  var difficultyOptions = document.getElementById("difficultyOptions");
  var eatenFood = null; //新吃到的食物对象
  var pause = true; //游戏状态是否暂停
  var gameInterval = null; //游戏循环定时器对象
  var count = 0; //吃到的食物计数
  var max_x = map.offsetWidth / snake.width,
    max_y = map.offsetHeight / snake.height,
    min_x = -1,
    min_y = -1;
  var newDifficulty = 0;
  var historicHighScore = [
    { difficulty: 0, score: 0 },
    { difficulty: 1, score: 0 },
    { difficulty: 2, score: 0 }
  ]; //存储历史最高成绩

  /* ============首先在map上绘制基本图形================ */
  food.produceFood(map, snake.snakeList); //绘制产生的食物
  snake.produceSnake(map); //绘制蛇

  /* ==============获取或设置游戏难度=================== */
  //获取难度选择列表
  var sapnList = difficultyOptions.getElementsByTagName("span");
  //获取操作按钮
  var operationBoxList = box.getElementsByTagName("span");
  for (var i = 0; i < operationBoxList.length; i++) {
    operationBoxList[i].onclick = function() {
      if (pause == true) {
        return;
      }
      perationDirection(this.innerText);
    };
  }
  sapnList[0].style.background = "red"; //设置默认选择难度1
  //遍历难度列表sapnList
  for (let i = 0; i < sapnList.length; i++) {
    //为列表每一项设置点击事件
    sapnList[i].onclick = function() {
      //点击当前项时先清空原有选择项样式
      for (let j = 0; j < sapnList.length; j++) {
        sapnList[j].style.background = "lightslategray";
      }
      //记录选择的难度项
      newDifficulty = i;
      getHistoricHighScore();
      //根据选择项设置游戏难度
      settings.difficulty = i + settings.degreeOfDifficulty;
      //设置选中样式
      sapnList[i].style.background = "red";
    };
  }

  /* ===============监听开始按钮单击事件==================== */
  //单击开始按钮开始游戏
  start.onclick = function(params) {
    startGame(); //开始游戏
  };

  /* ===============开始游戏函数==================== */
  function startGame() {
    pause = false; //把停止状态设置为false为不停止
    start.style.display = "none"; //设置开始按钮不可见
    operation_tip.style.display = "none";
    gameInterval = setInterval(
      updatePicture,
      settings.speed / settings.difficulty
    );
  }

  /* ===============暂停游戏函数==================== */
  function pauseGame() {
    pause = true;
    clearInterval(gameInterval);
    console.log("暂停游戏");
    start.style.display = "block";
    operation_tip.style.display = "block";
  }
  //更新画面函数
  function updatePicture() {
    snake.move();
    snake.produceSnake(map);
    var list = snake.snakeList;
    if (
      min_x >= list[0].x ||
      list[0].x >= max_x ||
      min_y >= list[0].y ||
      list[0].y >= max_y
    ) {
      pauseGame();
      eatenFood = null;
      count = 0;
      snake.snakeList = [
        { x: 3, y: 2, imgs: "url(img/tou.png)" },
        { x: 2, y: 2, imgs: "url(img/sheng.png)" },
        { x: 1, y: 2, imgs: "url(img/sheng.png)" }
      ];
      food.delFood();
      food.produceFood(map, snake.snakeList);
      snake.direction = "r";
      snake.produceSnake(map);
      setHistoricHighScore();
      getHistoricHighScore();
      score.innerText = 0;
      if (confirm("游戏结束，点击确定重新开始")) {
        startGame();
      }
    } else {
      /*判断是否有新吃到的食物有的话就将食物添加到snake.snakeList蛇身数组对象再清空eatenFood对象
       */
      if (eatenFood != null) {
        list.push(eatenFood);
        score.innerText = ++count * settings.difficulty;
        eatenFood = null;
      }
      /* 判断当食物的位置与蛇头的位置相同时,删除当前食物,保存当前蛇身最后一节的位置存在eatenFood吃到的食物对象中,每吃到一个食物就在蛇尾增加一节即新的蛇尾
       */
      if (food.x == list[0].x && food.y == list[0].y) {
        food.delFood(); //删除食物对象
        var ophiurid = list[list.length - 1]; //取得当前蛇尾位置对象
        eatenFood = { x: ophiurid.x, y: ophiurid.y, imgs: ophiurid.imgs }; //取得当前蛇尾位置对象保存到新吃到的食物对象。
        food.produceFood(map, list); //产生新的食物
      }
    }
  }

  /* ==============设置监听键盘按下操作事件改编蛇的方向==================== */
  document.onkeydown = function(params) {
    perationDirection(params.keyCode);
  };
  /* ==============存储最高成绩==================== */
  function setHistoricHighScore() {
    var new_score = parseInt(score.innerText); //获取当前得分
    var historic_score = 0; //获取当前难度历史得分
    var scoreDate = JSON.parse(localStorage.getItem("scoreDate"));
    if (scoreDate != null) {
      historic_score = scoreDate[newDifficulty].score;
    } else {
      historic_score = historicHighScore[newDifficulty].score;
    }
    new_score > historic_score
      ? (historicHighScore[newDifficulty].score = new_score)
      : (historicHighScore[newDifficulty].score = historic_score);

    localStorage.setItem("scoreDate", JSON.stringify(historicHighScore));
  }

  /* ==============获取最高成绩==================== */
  getHistoricHighScore();
  function getHistoricHighScore() {
    var scoreDate = JSON.parse(localStorage.getItem("scoreDate"));
    if (scoreDate != null) {
      historic_high_score.innerText = scoreDate[newDifficulty].score;
    }
  }
  /* ==============运行方向操作函数==================== */
  function perationDirection(params) {
    this.params = params.toString();
    var movingDirection = snake.direction,
      negativeDirection = "",
      newDirection = "";
    if (this.params === "40" || this.params === "下") {
      //按下键盘下并且蛇正在运行方向不是上
      newDirection = "b";
      negativeDirection = "t";
    } else if (this.params === "37" || this.params === "左") {
      //左
      newDirection = "l";
      negativeDirection = "r";
    } else if (this.params === "39" || this.params === "右") {
      //右
      newDirection = "r";
      negativeDirection = "l";
    } else if (this.params === "38" || this.params === "上") {
      //上
      newDirection = "t";
      negativeDirection = "b";
    } else if (this.params === "32" || this.params === "暂停") {
      //空格
      pause ? startGame() : pauseGame();
      return;
    }
    movingDirection !== negativeDirection
      ? (snake.direction = newDirection)
      : (snake.direction = negativeDirection);
  }
})();
