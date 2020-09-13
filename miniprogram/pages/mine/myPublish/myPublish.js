const db = wx.cloud.database()
const experience = db.collection('experience')
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
    var openid=options.openid;
    var that=this;
    wx.showLoading({
      title: '缓存中...',
    })
    experience.where({
      _openid:openid
    }).get({
      success(res){
        console.log('_openid的数据成功查到',res.data)
        that.setData({
          openid:openid,
          list:res.data
        })
         wx.hideLoading()   
      },
      fail(res){
        console.log('查询失败',res)
      }
    })
  },
  /**
   * 如果已经回答就可以静茹评价页面
   */
  gotoEvalute(e){
    let id=e.currentTarget.id;
    let status=e.currentTarget.dataset.status;
    console.log(id+'---------'+status)
    if(status==0){
      wx.showToast({
        title: '回答者还未回答无法查看',
        // duration: 0,//提示的延迟时间，单位毫秒，默认：1500
         icon: 'fail', //图标，支持"success"、"loading"
        // image: 'image',//自定义图标的本地路径，image 的优先级高于 icon
        mask: false,//是否显示透明蒙层，防止触摸穿透，默认：false 
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }else{
      wx.navigateTo({
        url: '/pages/application/experienceBase/details/details?id='+id+'&show=3'+'&openid='+this.data.openid,
        success: (result) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }
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

  }
})