import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import {}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("mode") == "subscribe" && searchParams.get("verify_token") == 'sharan@123') {

        return NextResponse.json({
            message: "Success",
            params: searchParams.get('verify_token'),
        });
    }
    else {
        return NextResponse.json({
            message: "Failed",

        }, { status: 401 });
    }
}

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const jsonBody = await req.json();

    if (searchParams.get('verify_token') == "sharan@123" && jsonBody['object'] == 'whatsapp_business_account') {
        let entry = jsonBody['entry'];

        let _e = entry[0];
        let changes = _e['changes'];
        const change = changes[0];
        if (change['field'] == 'messages') {
            let waId = change['value']['contacts'][0]['wa_id'];
            let profileName = change['value']['contacts'][0]['profile']['name'];
            let messageId = change['value']['messages'][0]['id'];
            let message = change['value']['messages'][0]['text']['body'];



            return NextResponse.json({
                message: "Success",
                params: searchParams.get('verify_token'),
                data: {
                    contact_number: waId,
                    message: message,
                }
            });
        }


    }


    return NextResponse.json({
        message: "Failed beacause of non whatsapp_business_account req",
        params: searchParams.get('verify_token'),
    });
}