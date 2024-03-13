import axios from "axios";
import { NextResponse } from "next/server";

export async function welcomeMessage(jsonBody: any) {
    let value = jsonBody['value'];

    let waId = value['contacts'][0]['wa_id'];
    let profileName = value['contacts'][0]['profile']['name'];
    let messageId = value['messages'][0]['id'];
    let message = value['messages'][0]['text']['body'];


    const headers = {
        'Authorization': `Bearer ${process.env.accessToken}`,
        'Content-Type': 'application/json'
    };

    const data = {
        messaging_product: 'whatsapp',
        to: waId,
        type: 'text',
        text: {
            body: `Hi thanks for choosing drive manager ${profileName} .\r Stay connected`
        }
    };

    const response = await axios.post(process.env.WAURL!, data, { headers });

    return NextResponse.json({
        message: "Success",
        data: {
            contact_number: waId,
            message: message,
        },
        response: response.data,
    });

}