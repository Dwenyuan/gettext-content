const { MD5 } = require('./md5')
const { stringify } = require('querystring')
const { baiduUrl } = require('./config')
const Axios = require('axios')
function translatorByBaidu(param) {
    // FIXME: 这里APPID写死了，应该改动一下的，不过无所谓了
    const appid = "20200308000394792";
    const key = "_0Tw6r0QjfHnVLcp63hR";
    const salt = new Date().getTime();
    const { query, from, to } = param;
    const str1 = appid + query + salt + key;
    const sign = MD5(str1);
    const urlParam = stringify({
        q: query,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign
    });
    return Axios.get(baiduUrl + "?" + urlParam);
}
module.exports = { translatorByBaidu }