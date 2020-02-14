(function() {
  var foodList = [];
  var foodEffectively = false;
  function Food(options) {
    options = options || {};
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 25;
    this.higth = options.higth || 25;
    this.color = options.color || "url(img/food.png)";
  }

  Food.prototype.produceFood = function(map, snakeList) {
    foodEffectively = false;
    var food_div = document.createElement("div");
    this.x = Tools.getRandom(0, map.offsetWidth / this.width - 1);
    this.y = Tools.getRandom(0, map.offsetHeight / this.higth - 1);
    while (!foodEffectively) {
      foodEffectively = true;
      for (var i = snakeList.length - 1; i > 0; i--) {
        console.log("检查食物");

        //遍历蛇节
        //将蛇节对象与产生的食物对象对比
        if (snakeList[i].x == this.x && snakeList[i].y == this.y) {
          //当有蛇节与食物重合时删除该食物重新产生食物
          console.log("产生了作废食物");
          this.x = Tools.getRandom(0, map.offsetWidth / this.width - 1);
          this.y = Tools.getRandom(0, map.offsetHeight / this.higth - 1);
          foodEffectively = false;
        }
      }
    }

    food_div.style.width = this.width + "px";
    food_div.style.height = this.higth + "px";
    food_div.style.left = this.x * this.width + "px";
    food_div.style.top = this.y * this.higth + "px";
    food_div.style.backgroundImage = this.color;
    food_div.style.backgroundSize = "100%";
    food_div.style.position = "absolute";
    map.appendChild(food_div);
    foodList.push(food_div);
  };
  Food.prototype.delFood = function() {
    if (foodList.length != 0) {
      foodList[0].parentNode.removeChild(foodList[0]);
      foodList.pop();
    }
  };

  window.Food = Food;
})();
