import {NextRequest, NextResponse} from "next/server";

export async function GET (request){
    const greeting = "Hello World!!"
    const json = {
        greeting
    };

    return NextResponse.json(json);
}

const accountSid = 'ACadcdb09c6b02e545518ceab1492bf724';
const authToken = '[AuthToken]';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'hello',
        from: '+16812400904',
        to: '+13062620223'
    })
    .then(message => console.log(message.sid))
    .done();