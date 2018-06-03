import wepy from 'wepy'
import apis from './apis.js'
// import util from '../utils/base64.min.js'
const configs = {
  // 获取用户信息
  async getUserInfo() {
    const loginData = await wepy.login()
    let _this = this
    const userinfo = await wepy.getUserInfo()
    userinfo.code = loginData.code
    return userinfo
  },
  // 在index调用
  async getUser() {
    let userinfoRaw = {}
    let userinfo = {}
    let _this = this
    try {
      wepy.showNavigationBarLoading();
      userinfoRaw = await _this.getUserInfo()
      await _this.saveCache('userinfo', userinfoRaw.userInfo)
      // console.log(apis.cache)
      if(!userinfoRaw.encryptedData || !userinfoRaw.iv){
        apis.g_status = '无关联AppID';
        return;
      }
      userinfo = await wepy.request({
        url: `${apis._server}/learningsystem/WeChat/decodeUserInfo`,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        dataType: 'json',
        data: {
          code: userinfoRaw.code,
          key: userinfoRaw.encryptedData,
          iv: userinfoRaw.iv
        }
      })
      wepy.hideNavigationBarLoading()
      console.log(userinfo.data.data)

      // 将信息储存到apis里面

      // 用户基本信息 + 后台获取的数据
      apis._user = userinfo.data.data

      // 本地用户信息
      apis._user.wx = userinfoRaw.userInfo

      // 当前周数
      apis._time = userinfo.data.data.time
      // apis._user.wx.stuInfo = userinfo.data.data.stuInfo

      // 获取自己的绑定后的真实信息
      let uid = userinfo.data.data.openid
      if (apis._user.is_bind) {
        apis._user.myInfo = userinfo.data.data.stuInfo.filter((item, index, array)=>{return uid === item.tgOpenid})[0]
      }

      // apis._user.is_bind = userinfo.data.data.is_bind
      // console.log(userinfo.data)
      if(apis.cache.version !== apis.version || apis.cache.userdata !== userinfo.data){
        _this.saveCache('version', apis.version);
        _this.saveCache('userdata', userinfo.data);
        // console.log(apis)
        // _this.processData(userinfo.data);
      }
      if(!apis._user.is_bind){
        wepy.navigateTo({
          url: '/pages/more/login'
        })
      }
    } catch (e) {
      if (0) {
        _this.showErrorModal('提示', '获取用户信息失败，请关闭重新进入');
      } else {
        _this.showErrorModal('提示', '网络错误');
      }
    }
  },

  //保存缓存
  saveCache(key, value) {
    if(!key || !value){return;}
    apis.cache[key] = value;
    wepy.setStorage({
      key: key,
      data: value
    });
  },
  //清除缓存
  removeCache(key) {
    if(!key){return;}
    apis.cache[key] = '';
    apis.removeStorage({
      key: key
    });
  },
  // 显示错误提示
  showErrorModal(content, title) {
    wepy.showModal({
      title: title || '加载失败',
      content: content || '未知错误',
      showCancel: false
    })
  },
  // 显示转圈加载
  showLoadToast(title, duration){
    wepy.showToast({
      title: title || '加载中',
      icon: 'loading',
      mask: true,
      duration: duration || 10000
    });
  }

}

export default configs