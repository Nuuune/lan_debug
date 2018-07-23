import axios from 'axios';

const BASE_URL = 'http://landa.aosaiban.com';

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['token'] = '';
axios.defaults.headers.common['corpKey'] = '';
axios.defaults.headers.post['Content-Type'] = 'application/json';

let AUTH_TOKEN = '';

export function set_TOKEN(token) {
  window.localStorage.setItem('lan_token', token);
  axios.defaults.headers.common['token'] = token;
}

/**
 * 登陆接口 拿到token
 * @param  {[string/num]} account  [账户]
 * @param  {[string/num]} password [密码]
 * @return {[promise]}
 */
export function login(account, password) {
  const instance = new axios.create({
    baseURL: BASE_URL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  return new Promise((resolve, reject) => {
    instance.post('/api/sso/auth/login', { account: account, password: password })
    .then(resp => {
      if (resp.errmsg === 'ok') {
        set_TOKEN(resp.data.access_token)
        resolve(resp.errmsg)
      } else {
        reject({code: 5000, errmsg: resp.errmsg})
      }
    })
    .catch(err => {
      reject(err)
      console.error(err);
    })
  });
}

function _getCorpList() {
  axios.get('/api/corp/oa/user/corp/simplelist')
  .then(resp)

    return this.validate(Api.getinit(`${API_URL}/api/corp/oa/user/corp/simplelist`))
        .then(resp => {
            return resp.data;
        });
}
