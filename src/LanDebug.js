import { login, getSeverUserInfo, set_TOKEN, set_CORPKEY, checkToken } from './api/index.js';


export default class __Landa {
  constructor(props) {
    this.props = props || {};
    this.user = null;
    this.token = '';

    this.init = this.init.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this._getUserInfo = this._getUserInfo.bind(this);
  }

  init() {
    const token = window.localStorage.getItem('lan_token');
    if (token) {
      set_TOKEN(token);
      checkToken()
      .then(isTrue => {
        if (isTrue) {
          window.__LandaJS = this;
          this._getUserInfo();
        } else {
          window.lan_modal.show((isSuccess) => {
            if (isSuccess) {
              window.__LandaJS = this;
              this._getUserInfo();
              window.location.reload();
            }
          });
        }
      });
    } else {
      window.lan_modal.show((isSuccess) => {
        if (isSuccess) {
          window.__LandaJS = this;
          this._getUserInfo();
          window.location.reload();
        }
      });
    }
  }

  _getUserInfo() {
    getSeverUserInfo()
    .then(data => {
      this.user = data;
    })
    .catch(err => {
      alert(`请求错误: ${JSON.stringify(err)}`)
    })
  }

  getUserInfo() {
    return this.user;
  }

  getAccessToken() {
    return  window.localStorage.getItem('lan_token');
  }

}
