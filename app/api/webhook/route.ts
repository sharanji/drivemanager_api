import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { welcomeMessage } from "./components/welcome_message";


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

        if (jsonBody['object'] == 'whatsapp_business_account') {
            let message: String = jsonBody['entry'][0]['changes'][0]['value']['messages'][0]['text']['body'];
            if (message.includes('/')) {
                return 
            }
            return welcomeMessage(jsonBody);
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
            message: `${error}`,
        }, { status: 500 });
    }

}