(function() {
  function Setting(optins) {
    optins = optins || {};
    //游戏难度为难度选项的i（注：i从0开始）+难度系数，难度默认值为2
    this.difficulty = optins.difficulty || 2;
    //游戏难度系数
    this.degreeOfDifficulty = optins.degreeOfDifficulty || 2;
    //速度基数
    this.speed = optins.speed || 500;
  }
  window.Setting = Setting;
})();
