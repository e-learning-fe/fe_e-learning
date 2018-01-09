import util from '../uitls/util'
const apis = {
  version: 'v0.0.1',
  _server: 'https://studyonline.natapp4.cc',
  _user: {
    //微信数据
    wx: {},
    //学生\老师数据
    we: {}
  },
  cache: {},
  key (data) {
    return util.key(data)
  }
}
export default apis