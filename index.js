const express = require('express');
const app = express();
const dialogflow = require('dialogflow');
const uuid = require('uuid');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */


app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

const server = app.listen(5000);

const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log('connected to the AI bot');
});

async function runSample(msg, projectId = 'chat-agent-qdgosh') {
        console.log('something');
        // A unique identifier for the given session
        const sessionId = uuid.v4();

        // Create a new session
        const sessionClient = new dialogflow.SessionsClient({
            keyFilename: __dirname + '/chat-agent-32f56c3d259d.json'
        });
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);

        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: msg,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
            },
        };

        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
            console.log(`  Intent: ${result.intent.displayName}`);
            io.emit('bot message', result.fulfillmentText);
        } else {
            console.log(`  No intent matched.`);
        }
}

io.on('connection', socket => {
    socket.on('bot message', msg => {
        console.log(msg);
        runSample(msg);
        
    })
});
