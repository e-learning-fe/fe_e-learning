import wepy from 'wepy'

const apis = {
  version: 'v0.0.1',
  _server: 'http://studyonline.natapp4.cc'
}

const config = {
  // 获取用户信息
  async getUserInfo(cb) {
    const loginData = await wepy.login()
    let _this = this
    const userinfo = await wepy.getUserInfo({
      success: function(res) {
        typeof cb === "function" && cb(res)
      },
      fail: function(res) {
        _this.showErrorModal('拒绝授权将导致无法关联学校帐号并影响使用，请重新打开再点击允许授权！', '授权失败');
        _this.g_status = '未授权'
      }
    })
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
      userinfo = await wepy.request({
        url: _this._server + '',
        method: 'POST',
        header: {
          'x-wechat-code': userinfoRaw.code,
          'x-wechat-encrypted': userinfoRaw.encryptedData,
          'x-wechat-iv': userinfoRaw.iv
        },
        dataType: 'json',
        data: {}
      })
      await wepy.setStorage({
        key: '_session',
        data: userinfo.data.data.session
      })
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

export default {config, apis}