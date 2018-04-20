# koa-wechat-body

> a module to parse wechat xml message to json for Koa

## Install

npm install koa-wechat-body

## Usage

```
const koa = require('koa');
const koaWechatBody = require('koa-wechat-body');
const bodyParser = require('koa-bodyparser');

const app = koa();

app.use(koaWechatBody(options));
app.use(bodyParser());

app.use(async (ctx) {
    ctx.body = ctx.request.body;
});
```

## Example

http request raw body:

```
<xml>   
  <return_code><![CDATA[SUCCESS]]></return_code>  
  <return_msg><![CDATA[OK]]></return_msg> 
</xml>
```

parse result, ctx.request.body:

```
{
  "return_code": "SUCCESS",
  "return_msg": "OK"
}
```


## Options

Please refer to [koa-xml-body](https://www.npmjs.com/package/koa-xml-body#options)

- **encoding**: requested encoding. Default is `utf8`. If not set, the lib will retrive it from `content-type`(such as `content-type:application/xml;charset=gb2312`).
- **limit**: limit of the body. If the body ends up being larger than this limit, a 413 error code is returned. Default is `1mb`.
- **length**: length of the body. When `content-length` is found, it will be overwritten automatically.
- **onerror**: error handler. Default is a `noop` function. It means it will **eat** the error silently. You can config it to customize the response.
- **xmlOptions**: the options of [xml2js](https://www.npmjs.com/package/xml2js#options)


```js
app.use(koaWechatBody({
    limit: 128,
    length: 200, // '1mb'|1024... If not sure about the effect, just leave it unspecified
    encoding: 'utf8', // lib will detect it from `content-type`
    onerror: (err, ctx) => {
      ctx.throw(err.status, err.message);
    },
    xmlOptions: {
      explicitArray: false
    }
}));
```


## Licences

[MIT](LICENSE)