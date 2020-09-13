// pages/user/user.js
const app = getApp()
const db = wx.cloud.database()
const userInfos = db.collection('userInfo')
let userInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onLoad: function (options) {
    var that = this;
    //获得设备信息
    wx.getSystemInfo({
      success (res) {
        console.log(res.windowHeight);
        that.setData({
          phoneHeight: res.windowHeight,
        })
      }
    })
    // 查看是否授权
    if (app.globalData.userInfo === null) {
      that.setData({
        login: true
      })
    } else {
      that.setData({
        login: false,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName
      })
    }
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        app.globalData.openid = res.result.openid;
        console.log('callFunction test result: ', res)
        userInfos.where({
          _openid:res.result.openid
        }).count().then(res=>{
          console.log(res.total)
          if(res.total==0){
            userInfos.add({
              data:e.detail.userInfo
            }).then(res => {
              console.log(res)
            }).catch(err=>{
              console.log(err)
            })
          }
        })
      }
    })
  },
  // 回调用户的头像和昵称信息
  bindGetUserInfo:function(e) {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        console.log(e.detail.userInfo);
        app.globalData.userInfo = e.detail.userInfo;
        that.setData({
          login: false,
          avatarUrl: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName
        })

      /**
       * 云函数调用获取用户openid
       * 插入用户数据至云数据库(并判断数据库是否有该用户)
       */
    // wx.cloud.callFunction({
    //   name: 'getOpenid',
    //   complete: res => {
    //     app.globalData.openid = res.result.openid;
    //     console.log('callFunction test result: ', res)
    //     userInfos.where({
    //       _openid:res.result.openid
    //     }).count().then(res=>{
    //       console.log(res.total)
    //       if(res.total==0){
    //         userInfos.add({
    //           data:e.detail.userInfo
    //         }).then(res => {
    //           console.log(res)
    //         }).catch(err=>{
    //           console.log(err)
    //         })
    //       }
    //     })
    //   }
    // })
       
      }
    })

  },
  /**
   * 来到我的发布页面
   */
  goTomyPublish(){
    wx.navigateTo({
      url: './myPublish/myPublish?openid='+app.globalData.openid
    })
  },

})