import util from '../utils/util'
const apis = {
  version: 'v0.0.1',
  _server: 'https://studyonline.natapp4.cc',
  _user: {
    //微信数据
    wx: {},
    //学生\老师数据
    we: {},
    stuInfo: {},
    subjectListTags: {},
    subjectList: {},
    myInfo: {},
    getReplyLists: {}
  },
  cache: {},
  key (data) {
    return util.key(data)
  },
  _time: {}, // 当前学期周数
  globalData : {
    refreshFlag : false
  }
}
export default apis