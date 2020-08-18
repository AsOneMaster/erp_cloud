// pages/application/fileManagement/fileManagement/add/add.js
const db = wx.cloud.database()
const document = db.collection('document')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [
      // Uploader 根据文件后缀来判断是否为图片文件
      // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  upload:function(event){
    wx.chooseMessageFile({
      count: 1,//能选择文件的数量
      type: 'file',//能选择文件的类型,我这里只允许上传文件.还有视频,图片,或者都可以
      success(res) {
        //文件临时路径
        const tempFilePaths = res.tempFiles[0].path
		//后缀名的获取
        const houzhui = tempFilePaths.match(/\.[^.]+?$/)[0];
		//存储在云存储的地址
        const cloudpath = 'word/' + new Date().getTime() + houzhui;
        //获取fileID
        wx.cloud.uploadFile({
          cloudPath: cloudpath,
          filePath: tempFilePaths,
          success: res => {
            //存储fileID，之后用的到
            // that.setData({
            //   fileid:res.fileID
            // })
            document.add( {
              data:{
                fileid:res.fileID 
              }
            }).then(res=>{
              console.log(res)
            })
            console.log(res)
          },
          fail: err => {
            console.log(err)
          },
        })
      }
    })
  }
})