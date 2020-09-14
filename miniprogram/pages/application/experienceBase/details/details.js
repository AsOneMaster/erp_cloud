const app = getApp();
const db = wx.cloud.database();
const userInfo = db.collection('userInfo')
const experience=db.collection('experience')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      ans_content:'',
      radio: '工作',
  },

  /**
   * 生命周期函数--监听页面加载
   * 获取刚刚发布的问题数据
   */
  onLoad: function (options) {
    var show=options.show //获取传递参数值
    var id=options.id;
    var openid=options.openid;
    var that=this;
    console.log(openid)

    userInfo.where({      //获取发布者头像地址
      _openid:openid
    }).get({
      success(res){
        console.log(res.data)
        that.setData({
          avatarUrl:res.data[0].avatarUrl
        })
      }
    })

  
    /**
     * 注意小程序中if()只要之中有数值都会识别为真
     */
    if(show==0){
      this.setData({         //显示发布者页面
        openid:openid,     
        _id:id,
        iss_show:'block',
        ans_show:'none',
        eva_show:'none'
      })
    }else if(show==1){

          /**
       * 云函数调用获取回答者用户openid
       * 插入用户数据至云数据库(并判断数据库是否有该用户)
       */
      wx.cloud.callFunction({
        name: 'getOpenid',
        complete: res => {
          app.globalData.openid = res.result.openid;
          console.log('callFunction test result: ', res)

        }
      })

      this.setData({         //显示回答者页面
        openid:openid,      
        _id:id,
        iss_show:'none',
        ans_show:'block',
        eva_show:'none'
      })
    }else{
    

      this.setData({         //准备评价页面
        openid:openid,      
        _id:id,
        iss_show:'none',
        ans_show:'none',
        eva_show:'block'
      })
    }
    console.log('发布者：'+this.data.iss_show+'回答者：'+this.data.ans_show)
    experience.where({_id:id}).get({
      success: res => {
        /**
         * 获取数据要给res.data[]加数组数值
         */
        console.log(res.data[0].createTime)
   
        this.setData({
          _id:id,
          label:res.data[0].label,
          title:res.data[0].title,
          content: res.data[0].content,
          imageUrls:res.data[0].imageUrl,
          issuer:res.data[0].issuer,
          createTime:res.data[0].createTime,
          answer:res.data[0].answer,
          ans_content:res.data[0].ans_content,
          ansTime:res.data[0].ansTime,
        })
        /**
         * 获取回答者头像地址
         */
        userInfo.where({_openid:res.data[0].ans_openid}).get({
          success(res1){
            that.setData({
              ans_avatarUrl:res1.data[0].avatarUrl
            })
            console.log(res1.data[0]._openid)
          }
          
        })
        
     

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
  },
 // 返回0
 back(){
   wx.navigateBack({
     delta: 1,
   })
 },
 /**
  * 指派员工微信,并分享参数传递
  */
 onShareAppMessage() {
  return {

        title: '需要你完成这个来自'+ this.data.issuer+'的问题',
        desc:'任务指派',
        path: '/pages/application/experienceBase/details/details?id='+this.data._id+'&show=1'+'&openid='+this.data.openid // 路径，传递参数到指定页面。
   }
},
  /**
   * 回答者完成回答,上传至云端
   */
  ans_success(){
    const date = new Date()
    const ansTime = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getMinutes()}`
    console.log(this.data.ans_content+app.globalData.openid)
    //上传回答,更新数据库 doc()中填写_id
    experience.doc(this.data._id).update({
     data:{
      ansTime:ansTime,
      ans_content:this.data.ans_content,
      answer: app.globalData.userInfo.nickName,
      ans_openid:app.globalData.openid,
      status:1
     },
    }).then(res=>{
      wx.showToast({
        title: '成功回答',
      })
      console.log(res)
    })

  },

  /**
   * 进入评价页面
   */
  eva_success(){
    wx.navigateTo({
      url: '../evaluate/evaluate?id='+this.data._id,
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

})