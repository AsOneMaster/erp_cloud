// miniprogram/pages/application/experienceBase/experienceBase.js
const app = getApp();
var utils = require('../../../utils/utils.js')
// 定义一个全局变量保存从接口获取到的数据，以免重复请求接口
var resut; 
const db = wx.cloud.database()
const experience = db.collection('experience')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCover:false,
    currentTab:0,
    navTitle:[
      {title:'工作'},
      {title:'管理'},
      {title:'营销'},
      {title:'运营'},
      {title:'创新'},
      {title:'发现问题'},
      {title:'发现问题'},
      {title:'发现问题'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    experience.get().then(res=>{
      console.log(res.data)
      that.setData({
        list:res.data,
        currentTab:'工作'
      })

    })
  },

  // 实现每一个tabbar切换对应内容的原理，根据每一个tabbar的index对应数组中的数据
  handleClick(e) {
    let currentTab = e.currentTarget.id;
    var that = this;
    experience.get().then(res=>{
      console.log(res.data+currentTab)
      that.setData({
        currentTab,
        list:res.data
      })

    })
  },
  pullDown:function(){
    var that = this;
    that.setData({
      showCover:true
    })
  },
  closeCover:function(){
    var that = this;
    that.setData({
      showCover:false
    })
  },

 // 悬浮时,实现每一个tabbar切换对应内容的原理，根据每一个tabbar的index对应数组中的数据
  CoverCheck:function(e){
    let currentTab = e.currentTarget.id;

    this.setData({
      currentTab,
      list: null
    })
    this.closeCover()
  },
 //跳转经验贴发布页面
  addExper:function(){
    wx.navigateTo({
      url: './releases/releases',
    })
  }
})