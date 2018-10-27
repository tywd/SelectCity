const app = getApp()

Page({
  data: {
    winHeight: 0
  },
  //监听传值，后面自己做处理了
  cityTap(e) {
    console.log(e);
    const cityName = e.detail.cityname;
    console.log('选择城市为：' + cityName);
    console.log('此处选择后，跳转页面，将城市名传过去你需要的页面就行了');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const win = wx.getSystemInfoSync();
    console.log(win);
    this.setData({
      winHeight: win.windowHeight
    });

  }
})
