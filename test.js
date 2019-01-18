const EasyQueue = require('./EasyQueue');
const axios = require('axios');

const cookie = 'nts_mail_user=AlanderLt@163.com:-1:1; mail_psc_fingerprint=fca70241966414031d1d683aec7afc4f; _ntes_nnid=97ecca6848019e0f2454d19b029cb2d0,1544101245699; _ntes_nuid=97ecca6848019e0f2454d19b029cb2d0; usertrack=CrHti1wJ02qIhVC7AyOUAg==; __f_=1544954792991; _ga=GA1.2.276942404.1547112516; _gid=GA1.2.1133242394.1547641055; locale=zh; csrf_token=1429c03c2b22cc25d44e6d234a54e06eb090d5e8; game=dota2; NTES_YD_SESS=rtu7t0X9_nevHM2F80NjjGqdmuNbgOsDLyusE9wJNNtHZnqeiEjDRKdFLyGJ5rnDcW4C9z9RCfTysv3xRYFMFuzMxf0cMVmS9_pOdwevbotVGzzAQ1F732laRwD0eKPZ0QkHXetMuczv8YIKULgKIaeC7i07IQeTVH_hDzZvMvvXM8Omu85EGCibJiFc7FqGIf3M9fCjr.7YaS3uGwLMVBtZDa4b8x61N.c0caWixsL.S; S_INFO=1547795167|0|3&80##|13588737694; P_INFO=13588737694|1547795167|0|netease_buff|00&99|zhj&1547641075&netease_buff#zhj&330100#10#0#0|&0|null|13588737694; session=1-TxAHw9RpMBt1ePQoVCqKJdcZWGxw6P1B-xr2awVGMpeW2046469057';

function handleFn (number) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(number)
    }, Math.random())
  })
}

function resultFn (numberArr) {
  return new Promise(function (resolve, reject) {
    console.log(numberArr)
  })
}

let entities = []
for (let i = 0; i < 1000; i++) {
  entities.push(i)
}
console.log(entities.length)

let works = new EasyQueue({
  entities,
  handleFn,
  resultFn
})

works.start()
