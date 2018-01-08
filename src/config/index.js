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
  // 在index调用
  async getUser() {
    let userinfoRaw = {}
    let userinfo = {}
    let _this = this
    try {
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
      console.log(userinfo)
      // await wepy.setStorage({
      //   key: '_session',
      //   data: userinfo.data.data.session
      // })
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