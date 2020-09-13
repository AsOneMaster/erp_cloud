const app = getApp();

Page({
  data: {
    showLable:false,
    show:false,
    radio: '',
    fileList: [],   // 预览图片用的数组      
    imgUrls:[],     // 上传图片用的数组
    title:'',
    formats: {},
    bottom: 0,
    readOnly: false,
    placeholder: '描述一下你的工作的问题吧...',
    _focus: false,
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {

  },
  // 编辑器初始化完成时触发
  onEditorReady() {
    const that = this;
    wx.createSelectorQuery().select('#editor').context(function(res) {
      that.editorCtx = res.context;
    }).exec();
  },
  undo() {
    this.editorCtx.undo();
  },
  redo() {
    this.editorCtx.redo();
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset;
    if (!name) return;
    // console.log('format', name, value)
    this.editorCtx.format(name, value);
  },
  // 通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式
  onStatusChange(e) {
    const formats = e.detail;
    this.setData({
      formats
    });
  },
  // 插入分割线
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function() {
        console.log('insert divider success')
      }
    });
  },
  // 清除
  clear() {
    this.editorCtx.clear({
      success: function(res) {
        console.log("clear success")
      }
    });
  },
  // 移除样式
  removeFormat() {
    this.editorCtx.removeFormat();
  },
  // 插入当前日期
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    });
  },

   // 插入图片
  afterRead(event) {
    console.log(event);
    const { file } = event.detail;
    const{fileList=[]} = this.data;
    fileList.push({url:file.path});
    this.setData({fileList})
    console.log(fileList)
  },
  //删除图片
  delete(event) {

    console.log(event)

    let imgDelIndex = event.detail.index

    let fileList = this.data.fileList

    fileList.splice(imgDelIndex,1)

    console.log('删除图片的',fileList)

    this.setData({
        fileList
    })
},
/**
  * 显示标签选择
  */
 onClickShow() {
  this.setData({ show: true });
},
getUserInfo(event) {
  console.log(event.detail.userInfo);
  this.setData({
    username:event.detail.userInfo.nickName
  })
},

onClose() {
  this.setData({ close: false });
},
/**
 * 选择分类标签
 */
onChange(event) {
  this.setData({
    radio: event.detail,
  });
   // console.log(this.data.radio)
   console.log(this.data.fileList)
},


  //查看详细页面 上传数据到云端
  toDeatil() {
    const db = wx.cloud.database();
    const date = new Date()
    const createTime = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getMinutes()}`
    this.editorCtx.getContents({
      success: (res) => {
        console.log(res.html)
        db.collection("experience").add({
          data:{
            issuer:this.data.username,//发布者
            title:this.data.title,//题目
            content:res.html,//发布内容
            label:this.data.radio,//问题所属标签
            imageUrl:this.data.imgUrls,//问题中所带图片地址
            createTime:createTime,//发布时间
            answer:'',//回答者
            ansTime:'',//回答时间
            ans_content:'',//回答内容
            status:0,//问题状态 0未回答 1已回答 2已评价
            evaluate:'',//评价内容
          },
          success:res1=>{
            console.log(res1._id);
            wx.navigateTo({
              url: '../details/details?id='+res1._id+'&show=0'+'&openid='+res1._openid
            })
          }
        })
        // app.globalData.title=this.data.title
        // app.globalData.html = res.html
     
      },
      fail: (res) => {
        console.log("fail：" , res);
      }
    });
  },
  /**
   * 上传图片并跳转页面
   */
  upLoad(){
    var count = 0;
    var h = this.data.fileList.length;
    wx.showLoading({
      title: '发布中...',
    })
    if(this.data.fileList.length!=0){
      for (var i = 0; i < h; i++) {
        //上传文件
        var cloupath = 'image/'+new Date().getTime();
        var imgUrls = this.data.imgUrls;
        wx.cloud.uploadFile({
          cloudPath: cloupath,     //自定义云存储路径
          filePath: this.data.fileList[i].url,
          success: res => {
            imgUrls.push(res.fileID);
            this.setData({
              imgUrls: imgUrls         //更新data中的 fileID
            })
            count++
            console.log(this.data.imgUrls)
                                     //图片fileID全部获取后跳转页面
             if(count==h){
              wx.hideLoading({
                success: (res) => {
                  this.toDeatil()    //上传数据并 跳转页面
                },
              })
            }
          },
          fail: res => {
            count++;
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        })
       
      }
    }else{
      wx.hideLoading({
        success: (res) => {
          this.toDeatil()    //上传数据并 跳转页面
        },
      })
    }    
  }
  
})