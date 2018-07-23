import {login} from './api/index.js'

function init() {
  login(14500000000, 123456)
}

window.load = init();
