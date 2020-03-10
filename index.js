/**
 * Created by rob on 1/24/2017.
 */
const path = require("path")
    , koa = require('koa')
    , serve = require("koa-static")
    , port = 4008
    , compress = require('koa-compress')
    , router = require("./routes/router.js")
    , bodyParser = require('koa-bodyparser')
    , session = require('koa-generic-session')
    , mount = require('koa-mount')
    ,  cors = require('kcors');


var app = new koa();
    app.use(cors());

//Centralized Error handler
function *errorHandler (next){
    try {
        yield next;
    } catch(err){
        this.status = err.status || 500;
        err.message = err.message || "Unknown Error";

        if(!this.state.xhr) {
            this.type = 'text/html';
            this.body = { serverErr: err.message };
        } else {
            this.body = err.message;
        }

        this.app.emit('error', err, this)
    }
}


//Trust proxy
app.proxy = true;

//Session key
app.keys = ["secret secret 111"];

app.use(function *(next){
    if(this.request.url === "/api/status"){
        this.status = 200;
    } else {
        return yield next;
    }
});




app
    .use(errorHandler)		//error handler goes at the top. It catches errors from all the middleware below it.
    .use(compress())
    .use(bodyParser())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());



app.listen(port, err => {
    if(err){
        console.error(err);
    } else {
        console.info("Main server listening on port %s", port);
    }
});
