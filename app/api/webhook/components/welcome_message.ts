import axios from "axios";
import { NextResponse } from "next/server";

export async function welcomeMessage(jsonBody: any) {
    let chanages = jsonBody['entry'][0]['changes'][0];

    let waId = chanages['value']['contacts'][0]['wa_id'];
    let profileName = chanages['value']['contacts'][0]['profile']['name'];
    let messageId = chanages['value']['messages'][0]['id'];
    let message = chanages['value']['messages'][0]['text']['body'];

    const url = 'https://graph.facebook.com/v18.0/116480298220877/messages';
    const accessToken = 'EAAZCUOwGKlBMBO3N0cHjDz9JEhnzE0OcZB9nCPasALcoZBWArHsaYel8b0bTkGi8n4Vqa2Ss3gftDVX7YiuNzNpBurcX5m8LGiqnsSBH5tFVkpuWi9ZCSoDsCrMi6cnXaWUrjBuFGrZCqwiytr5uVC8GSAdQOHtg3zVbbZCIruRwZBsPwcGI2c6WDNh6y4Os7F3wSFNpslz1MmnkygZCjZCwZD';

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
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

    const response = await axios.post(url, data, { headers });

    return NextResponse.json({
        message: "Success",
        data: {
            contact_number: waId,
            message: message,
        },
        response: response.data,
    });

}