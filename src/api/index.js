import axios from 'axios';

const BASE_URL = 'http://landa.aosaiban.com';

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['token'] = '';
axios.defaults.headers.common['corpKey'] = '';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export function set_TOKEN(token) {
  window.localStorage.setItem('lan_token', token);
  axios.defaults.headers.common['token'] = token;
}
export function set_CORPKEY(corpkey) {
  window.localStorage.setItem('lan_corpkey', corpkey);
  axios.defaults.headers.common['corpKey'] = corpkey;
}

/**
 * 登陆接口 拿到token
 * @param  {[string/num]} account  [账户]
 * @param  {[string/num]} password [密码]
 * @return {[promise]}
 *         成功返回 {login, corp}这两个的状态对象
 *         失败两种 请求错误 返回请求错误对象
 *                  服务器错误 返回{code: 5000, errmsg: data.errmsg}
 */
export function login(account, password) {
  return new Promise((resolve, reject) => {
    axios.post('/api/sso/auth/login', { account: account, password: password })
    .then(({data}) => {
      if (data.success) {
        set_TOKEN(data.data.access_token);
        _getCorpList()
        .then(cresp => {
          resolve({
            login: data.errmsg,
            corp: cresp
          })
        })
        .catch(err => {
          resolve({
            login: data.errmsg,
            corp: err
          })
        })
      } else {
        data.errmsg && reject({code: 5000, errmsg: data.errmsg});
      }
    })
    .catch(err => {
      reject(err);
      console.error(err);
    })
  });
}

/**
 * 获取用户信息
 * @return {[promise]} 成功 -> 返回服务器的所有data信息
 *                  失败两种 请求错误 返回请求错误对象
 *                  服务器错误 返回{code: 5000, errmsg: data.errmsg}
 */
export function getSeverUserInfo() {
  return new Promise((resolve, reject) => {
    axios.get('/api/corp/oa/user/me')
    .then(({data}) => {
      if (data.success) {
        resolve(data.data)
      } else {
        reject({code: 5000, errmsg: data.errmsg})
      }
    })
    .catch(err => {
      reject(err);
      console.error(err);
    })
  })
}

/**
 * 检查token过期
 * 使用此方法之前需要调用set_TOKEN方法
 * @return {boolean}
 */
export function checkToken() {
  return new Promise((resolve, reject) => {
    _getCorpList()
    .then(res => {
      if (res === 'ok') {
        resolve(true);
      } else {
        resolve(false);
      }
    })
    .catch(err => {
      resolve(false);
    })
  })
}

/**
 * 获取corpkey
 * 在登陆时调用，内部方法
 * @return      {[promise]}
 *              成功返回成功信息
 *              失败两种 请求错误 返回请求错误对象
 *              服务器错误 返回{code: 5000, errmsg: data.errmsg}
 */
function _getCorpList() {
  const instance = new axios.create({
    baseURL: BASE_URL,
    headers: {
      'Accept': 'application/json',
      'token': window.localStorage.getItem("lan_token")
    }
  });
  return new Promise((resolve, reject) => {
    instance.get('/api/corp/oa/user/corp/simplelist')
    .then(({data}) => {
      if (data.success) {
        set_CORPKEY(data.data[0].id);
        resolve(data.errmsg);
      } else {
        data.errmsg && reject({code: 5000, errmsg: data.errmsg});
      }
    })
    .catch(err => {
      reject(err);
      console.error(err);
    })
  })
}
