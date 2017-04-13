require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

intents.onBegin(
    function(session, args, next) {
        session.send("Hi! I’m DeloitteBot -- I can tell you whatever you want to know about Deloitte and its initiative with the Manufacturing Institute on helping women in the manufacturing industry and promoting diversity! I’d like to know a little about you, what’s your name? ");
    }
);

intents.matches('introductions', [
    function (session, args, next) {
        var name = builder.EntityRecognizer.findEntity(args.entities, 'name');
        if (!name) {
            builder.Prompts.text(session, "Sorry, something went wrong. What's your name?");
        } else {
            var firstLetter = name.entity.charAt(0).toUpperCase();
            var restOfName = name.entity.slice(1);
            var completeName = firstLetter + restOfName;
            session.userData.name = completeName;
            session.send("Hi " + session.userData.name + "! Just one more question. Are you an employer or employee in the manufacturing industry?");
        }
    },
]);

intents.matches('is_employee', [
    function(session, args, next) {
        session.userData.status = "employee";
        session.send("Thanks " + session.userData.name + "! You can ask me things like, “what is STEP?” or “tell me more about mentoring”.");
    }
]);

intents.matches('is_employer', [
    function(session, args, next) {
        session.userData.status = "employer";
        session.send("Thanks " + session.userData.name + "! You can ask me things like, 'tell me more about the Manufacturing Institute' or 'How do I foster employee retention?'");
    }
]);

intents.matches('step_description', [
    function(session, args, next) {
        session.send("The STEP Ahead Initiative mentors and recognizes women in the manufacturing industry. It also leads research in promoting diversity. STEP Ahead is motivating women to choose careers in manufacturing and also helping promote their advancement. It's raising the visibility of opportunities for women in both the industry and within companies.");
    }
]);

intents.matches('mentoring', [
    function(session, args, next) {
        session.send("Mentorship is an important way to promote diversity and reduce the gender gap in manufacturing. It helps to foster belief in one's self and strengthens self-confidence. Both factors that help women make strides in the industry. Sponsorship and mentorship also improves employee retention.");
    }
]);

intents.matches('manufacturing_institute', [
    function(session, args, next) {
        session.send("The Manufacturing Institute is the authority on the attraction, qualification, and development of world-class manufacturing talent. The Institute exceeds expectations and delivers results to help close the skills gap. In partnership with some of the leading consulting firms in the country, the Institute studies the critical issues facing manufacturing and then applies that research to develop and identify solutions that are implemented by companies, schools, governments, and organizations across the country.");
    }
]);

intents.matches('retention', [
    function(session, args, next) {
        session.send("Employee retention starts with attracting certified/degreed people early. From their it's important to customize retention strategies for varying experience levels. These strategies can include aligning recent graduates with mentors, raising visibility of these key mentors within the company and promoting flexible work practices. Provide support for work/life balance, taking into account women at career points where this balance becomes more complex.");
    }
]);

intents.matches('worklife_balance', [
    function(session, args, next) {
        session.send("Work-life balance is still one of the biggest challenges especially in production / assembly line manufacturing. Creative approaches, like providing schedules even a few weeks in advance, are needed. It’s not just about maternity leave, for example, but companies should consider how to develop this group after their initial career success to challenge them and/or create opportunities when careers plateau. This work life balance is especially important for women in Gen Y.");
    }
]);

intents.matches('visibility', [
    function(session, args, next) {
        session.send("It's important to increase visibility of female leaders. They need to be visible throughout all levels. It is easier to aspire to what you can see. STEP Award Honorees have increased visibility of opportunities for women and helped engaged with efforts for women's development.");
    }
]);

intents.matches('attracting_talent', [
    function(session, args, next) {
        session.send("Organizations can unleash the full potential of their female workforce and decrease the perceived gap by creating a culture where unique strengths thrive. Culture can’t change without women in the room, so companies must incorporate strategies to attract high-performing women. It is also important to take into account generational differences. Most Gen Y potential employees are looking for attractive salaries and work life balance. While Gen X and above are interested in challenging work.");
    }
]);

intents.matches('perceived_gap', [
    function(session, args, next) {
        session.send("Less than 15% of women believe that their industry is very accepting of family/personal commitments and allows them to meet these commitments without impairing their career. More than 4 out of 10 women surveyed are either responsible for the majority of household duties or share home duties equally with their spouse or partner. Nearly three quarters of women believe they are underrepresented in their organization's leadership team, with a significantly higher share of junior management (78 percent) believing they are underrepresented when compared to senior management.");
    }
]);

intents.matches('diversity', [
    function(session, args, next) {
        session.send("Employee diversity makes good business sense. There is a direct correlation between diversity / inclusion and profitability, including the speed and type of innovation, and diversity of thought. Gender diverse leadership group encourages broader strategic thinking, and together, these teams can tackle issues more effectively.");
    }
]);

function createCard(img, session) {
    return new builder.HeroCard(session)
        .images([
            builder.CardImage.create(session, img)
        ]);
}
