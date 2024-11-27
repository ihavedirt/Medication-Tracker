import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// https://www.twilio.com/docs/messaging/tutorials/how-to-send-sms-messages/node
// ^ this has info if we need to modify to send to multiple people
// keep this async if we gonna access the backend here
export async function POST(req) {
    //if (req.method === 'POST') {
        // this needs to be integrated
        // const { number, body } = JSON.parse(req.body);
    try{
        client.messages
            .create({
            body: 'new message 2',
            from: '+16812400904',
            to: '+13062620223'
        })
        return NextResponse.json({ status: 200 });
    } 
    catch (error) {
        return NextResponse.json({ status: 500 });

    }
/*
        .then((message) => { // ok
            res.status(200).json({ messageSId: message.sid });
        })
        .catch((err) => { // bad :(
            res.status(500).json({ err: err.message });
        });*/
    //}
}