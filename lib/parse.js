'use strict'
const xmlParser = require('koa-xml-body');

module.exports = (options) => {
  return async (ctx, next) => {
    if (isBodyParsed(ctx.request.body)) {
      return next();
    }
    delete ctx.request.body;
    await xmlParser(options).call(this, ctx, formater);

    function isBodyParsed(body) {
      return body && Object.keys(body).length > 0;
    }
  
    function formater(){
      if (ctx.request.body && ctx.request.body.xml) {
        ctx.request.body = formatBody(ctx.request.body.xml);
      }
      return next();
    }

    function formatBody(body) {
      const result = {};
      if (typeof body != 'object') {
        return result;
      }
      for (let key in body) {
        if (Array.isArray(body[key]) && body[key].length > 0) {
          if (body[key].length === 1) {
            let item = body[key][0];
            if (typeof item === 'object') {
              result[key] = formatBody(item);
            } else {
              result[key] = item || "";
            }
          } else {
            result[key] = [];
            result[key].forEach((item) => {
              result[key].push(formatBody(item));
            })
          }
        }
      }
  
      return result;
    }
  }
}