import { prisma } from "@/lib/prisma";
import { DriveUser } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function getFolderFiles({ user, folderName, jsonBody }: { user: DriveUser, folderName: string, jsonBody: any }) {
    var result;
    var data;


    let chanages = jsonBody['entry'][0]['changes'][0];
    let waId = chanages['value']['contacts'][0]['wa_id'];
    let profileName = chanages['value']['contacts'][0]['profile']['name'];
    let messageId = chanages['value']['messages'][0]['id'];
    let message = chanages['value']['messages'][0]['text']['body'];
    let sections: any = [];

    const headers = {
        'Authorization': `Bearer ${process.env.accessToken}`,
        'Content-Type': 'application/json'
    };


    if (folderName == '') {
        result = await prisma.file.findMany(
            {
                where: {
                    userId: user.id,
                    parentId: 0
                }
            }
        );

        result.forEach(file => {
            sections.push({
                "title": file.mimeType,
                "rows": [
                    {
                        "id": file.fileId,
                        "title": file.fileName,
                        "description": `Last Updated : ${file.lastUpdated}`,
                    }
                ]
            });
        });

        data = {
            "messaging_product": "whatsapp",
            "to": waId,
            "recipient_type": "individual",
            "type": "interactive",
            "interactive": {
                "type": "list",
                "header": {
                    "type": "text",
                    "text": "Home",
                },
                "body": {
                    "text": "Select the file *or* Folder "
                },
                "footer": {
                    "text": "Click below to browse"
                },
                "action": {
                    "button": "Folders",
                    "sections": sections
                }
            }
        };
    }
    else {
        var folderData = await prisma.file.findFirst(
            {
                where: {
                    userId: user.id,
                    fileName: folderName,
                }
            }
        );

        if (!folderData) {
            return NextResponse.json({
                "message": "No folders found",
                userId: user.id
            });
        }

        result = await prisma.file.findMany(
            {
                where: {
                    userId: user.id,
                    parentId: folderData.id
                }
            }
        );


        result.forEach(file => {
            sections.push({
                "title": file.mimeType,
                "rows": [
                    {
                        "id": file.fileId,
                        "title": file.fileName,
                        "description": `Last Updated : ${file.lastUpdated}`,
                    }
                ]
            });
        });


        data = {
            "messaging_product": "whatsapp",
            "to": waId,
            "recipient_type": "individual",
            "type": "interactive",
            "interactive": {
                "type": "list",
                "header": {
                    "type": "text",
                    "text": folderData.fileName,
                },
                "body": {
                    "text": "Select the file *or* Folder "
                },
                "footer": {
                    "text": "Click below to browse"
                },
                "action": {
                    "button": "Folders",
                    "sections": sections
                }
            }
        };


    }


    await axios.post(process.env.WAURL!, data, { headers });
    return NextResponse.json(result);

}