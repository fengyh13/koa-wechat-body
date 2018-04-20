const request = require('supertest');
const Koa = require('koa');
const should = require('should');
const parseXMLBody = require('../lib/parse');

describe('koa-wechat-body', () => {
  let xml = `<xml>
<appid><![CDATA[wx2421b1c4370ec43b]]></appid>
<attach><![CDATA[支付测试]]></attach>
<bank_type><![CDATA[CFT]]></bank_type>
<fee_type><![CDATA[CNY]]></fee_type>
<is_subscribe><![CDATA[Y]]></is_subscribe>
<mch_id><![CDATA[10000100]]></mch_id>
<nonce_str><![CDATA[5d2b6c2a8db53831f7eda20af46e531c]]></nonce_str>
<openid><![CDATA[oUpF8uMEb4qRXf22hE3X68TekukE]]></openid>
<out_trade_no><![CDATA[1409811653]]></out_trade_no>
<result_code><![CDATA[SUCCESS]]></result_code>
<return_code><![CDATA[SUCCESS]]></return_code>
<sign><![CDATA[B552ED6B279343CB493C5DD0D78AB241]]></sign>
<sub_mch_id><![CDATA[10000100]]></sub_mch_id>
<time_end><![CDATA[20140903131540]]></time_end>
<total_fee>1</total_fee>
<coupon_fee><![CDATA[10]]></coupon_fee>
<coupon_count><![CDATA[1]]></coupon_count>
<coupon_type><![CDATA[CASH]]></coupon_type>
<coupon_id><![CDATA[10000]]></coupon_id>
<trade_type><![CDATA[JSAPI]]></trade_type>
<transaction_id><![CDATA[1004400740201409030005092168]]></transaction_id>
</xml>`;
  const expected = {
    appid: 'wx2421b1c4370ec43b',
    attach: '支付测试',
    bank_type: 'CFT',
    fee_type: 'CNY',
    is_subscribe: 'Y',
    mch_id: '10000100',
    nonce_str: '5d2b6c2a8db53831f7eda20af46e531c',
    openid: 'oUpF8uMEb4qRXf22hE3X68TekukE',
    out_trade_no: '1409811653',
    result_code: 'SUCCESS',
    return_code: 'SUCCESS',
    sign: 'B552ED6B279343CB493C5DD0D78AB241',
    sub_mch_id: '10000100',
    time_end: '20140903131540',
    total_fee: '1',
    coupon_fee: '10',
    coupon_count: '1',
    coupon_type: 'CASH',
    coupon_id: '10000',
    trade_type: 'JSAPI',
    transaction_id: '1004400740201409030005092168'
  }
  function createApp(options) {
    const app = new Koa()

    app.use(parseXMLBody(options))

    app.use(function (ctx, next) {
      ctx.request.body.should.eql(expected);
      ctx.status = 200;
      return next()
    })
    return app
  }

  describe('with a valid xml body', () => {
    it('should parse body when type is text/xml', done => {
      const app = createApp()
      request(app.listen())
        .post('/')
        .set('Content-Type', 'text/xml')
        .send(xml)
        .expect(200, done)
    })
  })
})