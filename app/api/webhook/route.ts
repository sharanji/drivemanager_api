import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { welcomeMessage } from "./components/welcome_message";
import { getFolderFiles } from "./components/folderfiles";


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
            let value = jsonBody['value'];

            let waId = value['contacts'][0]['wa_id'];
            let profileName = value['contacts'][0]['profile']['name'];
            let messageId = value['messages'][0]['id'];
            let message = value['messages'][0]['text']['body'];


            // find userId
            var user = await prisma.driveUser.findFirst(
                {
                    where: {
                        mobile: waId.substring(2)
                    }
                }
            );

            if (!user) return NextResponse.json({
                "message": "User Id Not found",
            });

            if (message.includes('/')) {
                return getFolderFiles({ user: user, folderName: message.substring(1), jsonBody })
            }
            return welcomeMessage(jsonBody);
        }

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