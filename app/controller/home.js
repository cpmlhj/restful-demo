const path = require('path');

class HomeController {
    index(ctx) {
        ctx.body = '1111111'
    }
    upload(ctx) {
        const file = ctx.request.files.file;
        const baseName = path.basename(file.path);
        ctx.body = { url: `${ctx.origin}/upload/${baseName}` }
    }
}

module.exports = new HomeController()
