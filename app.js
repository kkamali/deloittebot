var restify = require('restify');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));

function createCard(img, session) {
    return new builder.HeroCard(session)
        .images([
            builder.CardImage.create(session, img)
        ]);
}
