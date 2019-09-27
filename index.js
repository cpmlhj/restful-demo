const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-body');
const routing = require('./routes');
const createJsonErrorMiddleware = require('koa-json-error');
const parameter = require('koa-parameter');
const path = require('path');
const KoaStatic = require('koa-static');
const mongoose = require('mongoose');
const { connectionStr } = require('./config');

mongoose.connect(connectionStr, { useNewUrlParser: true, useFindAndModify: false } , () => console.log('mongoose start'));
mongoose.connection.on('error', () => console.error);
app.use(KoaStatic(path.join(__dirname, 'app/public')));
app.use(createJsonErrorMiddleware({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}));
app.use(parameter(app));
app.use(bodyParser({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, './app/public/upload'),
        keepExtensions: true
    }
}));
routing(app);
app.listen(3010, () => console.log('6666'));
