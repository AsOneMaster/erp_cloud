// pages/application/fileManagement/fileManagement.js
const db = wx.cloud.database()
const document = db.collection('document')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中。。。',
    })
    document.get().then(res=>{
      console.log(res.data)
      this.setData({
        document:res.data
      },res=>{wx.hideLoading()}
      )
    })
  },

  /**
   * 进入指定id文件页面
   */
  gotodoc(e){
    let id=e.currentTarget.id;
    console.log(id+'---------')
    wx.navigateTo({
      url: '/pages/application/fileManagement/document/document?id='+id,
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  navigaTo:function(event) {
    wx.navigateTo({
      url: './add/add',
    })
  }
})