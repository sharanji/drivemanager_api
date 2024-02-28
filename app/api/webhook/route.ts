import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import axios from 'axios';
import { headers } from "next/headers";


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("hub.mode") == "subscribe" && searchParams.get("hub.verify_token") == 'sharan@123') {

        return new NextResponse(
            searchParams.get('hub.challenge'),
        );
    }
    else {
        return NextResponse.json({
            message: "Failed",

        }, { status: 401 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const jsonBody = await req.json();

        if (jsonBody['field'] == 'messages') {

            let waId = jsonBody['value']['contacts'][0]['wa_id'];
            let profileName = jsonBody['value']['contacts'][0]['profile']['name'];
            let messageId = jsonBody['value']['messages'][0]['id'];
            let message = jsonBody['value']['messages'][0]['text']['body'];

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
                params: searchParams.get('verify_token'),
                data: {
                    contact_number: waId,
                    message: message,
                },
                response: response.data,
            });

        }
        console.log(jsonBody);
        console.log('Failed beacause of non whatsapp_business_account req');

        return NextResponse.json({
            message: "Failed beacause of non whatsapp_business_account req",
            params: searchParams.get('verify_token'),
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: error,
        }, { status: 500 });
    }

}