import wepy from 'wepy'
import apis from './apis.js'

const configs = {
  // 获取用户信息
  async getUserInfo() {
    const loginData = await wepy.login()
    let _this = this
    const userinfo = await wepy.getUserInfo()
    userinfo.code = loginData.code
    return userinfo
  },
  hehe() {
    return Promise.resolve().then(() => cons/o1e.log(hehe)).catch(() => console.log('sb'))
  },
  // 在index调用
  async getUser() {
    let userinfoRaw = {}
    let userinfo = {}
    let _this = this
    try {
      wepy.showNavigationBarLoading();
      userinfoRaw = await _this.getUserInfo()
      apis._user.wx = userinfoRaw.userInfo
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
      // console.log(userinfo)
      // await _this.hehe()
      await wepy.setStorage({
        key: '_session',
        data: userinfo.data.data.session
      })
      // console.log(userinfo.data.data.is_bind)
      apis._user.wx = userinfoRaw.userInfo
      apis._user.is_bind = userinfo.data.data.is_bind
      console.log(wepy.getStorageInfoSync('_session'))
      if(!apis._user.is_bind){
        wepy.navigateTo({
          url: '/pages/more/login'
        })
      }
    } catch (e) {
      _this.showErrorModal('提示', `获取用户信息失败，请关闭重新进入。`);
    }
  },

  showErrorModal(content, title) {
    wepy.showModal({
      title: title || '加载失败',
      content: content || '未知错误',
      showCancel: false
    })
  }
  // version: 'v0.0.1', // 版本号
  // globalData = {
  //   version: 'v0.0.1',
  //   _server: 'http://studyonline.natapp4.cc',
  //   key (data) {
  //     return this.util.key(data)
  //   },
  //   cache: {}
  // }
}

export default configs