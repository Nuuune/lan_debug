import { login } from '../api/index.js'

export default class Modal {
  constructor(props) {
    this.props = props || {};
    this.template = `
      <div class="modal-content">
        <div class="modal-title">登陆</div>
        <label for="landAcc">账号:</label>
        <input id="landAcc">
        <label for="landPsw">密码:</label>
        <input id="landPsw">
        <div id="modalBtn" class="modal-btn">登陆</div>
      </div>
    `;
    this.wrap = window.document.createElement('div');
    this.wrap.setAttribute("class", "modal");
    this.wrap.id = 'modal';
    this.wrap.innerHTML = this.template;


    this._modalClick = this._modalClick.bind(this);
    this._close = this._close.bind(this);
    this._show = this._show.bind(this);
    this.show = this.show.bind(this);
    this.btnCallback = this.btnCallback.bind(this);
  }

  _modalClick(e) {
    switch (e.target.id) {
      case 'modal':
        this._close();
        break;
      case 'modalBtn':
        this.btnCallback();
        break;
      default: ;
    }
  }

  _close() {
    this.wrap.removeEventListener('click', this._modalClick, false);
    window.document.body.removeChild(this.wrap);
  }

  _show() {
    window.document.body.appendChild(this.wrap);
    this.wrap.addEventListener('click', this._modalClick, false);
  }

  btnCallback() {
    const account = window.document.getElementById('landAcc').value;
    const password = window.document.getElementById('landPsw').value;

    if (account && password) {
      if (this.props.btnCallback) {
        return this.props.btnCallback({account, password});
      }
      login(account, password)
      .then(({login, corp}) => {
        if (login === 'ok' && corp === 'ok') {
          alert(`登陆成功`);
          this._close();
          this.callback(true);
        } else {
          alert(`登陆失败：--- {login: ${login}, corp: ${corp}}`);
        }
      })
      .catch(err => {
        alert(`登陆失败: --- ${JSON.stringify(err)}`);
      });
    } else {
      alert(`请完成表单`);
    }

  }

  show(callback) {
    this.callback = callback;
    this._show();
  }

}
