import { prisma } from "@/lib/prisma";
import { DriveUser } from "@prisma/client";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function getFolderFiles({ user, folderName, jsonBody }: { user: DriveUser, folderName: string, jsonBody: any }) {
    try {
        var result;
        var data;


        let value = jsonBody['value'];

        let waId = value['contacts'][0]['wa_id'];
        let profileName = value['contacts'][0]['profile']['name'];
        let messageId = value['messages'][0]['id'];
        let message = value['messages'][0]['text']['body'];


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

            if (result.length == 0) {
                data = {
                    messaging_product: 'whatsapp',
                    to: waId,
                    type: 'text',
                    text: {
                        body: `Hi thanks for choosing drive manager ${profileName} .\r No files Found in the folder`
                    }
                };
                await axios.post(process.env.WAURL!, JSON.stringify(data), { headers });
                return NextResponse.json({ 'message': "no sub files found" });
            }

            result.forEach(file => {
                // sections.push({
                //     "title": file.mimeType,
                //     "rows": [
                //         {
                //             "id": file.fileId,
                //             "title": file.fileName,
                //             "description": `Last Updated : ${file.lastUpdated}`,
                //         }
                //     ]
                // });
                sections.push({
                    "title": file.mimeType,
                    "rows": [
                        {
                            "id": file.fileId,
                            "title": "/" + (file.fileName.length > 10 ? file.fileName.substring(0, 8) : file.fileName),
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
            await axios.post(process.env.WAURL!, JSON.stringify(data), { headers });
            return NextResponse.json(data);
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


            if (folderData.mimeType != 'folder') {
                var mediaData = {
                    'messaging_product': 'whatsapp',
                    "recipient_type": "individual",
                    "to": waId,
                    "type": "document",
                    "document": {
                        "link": "https://drivemanager-api.vercel.app/uploads/files/" + folderData.fileId + "." + folderData.mimeType
                        // "link": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                        // "link": "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress"
                    },
                }
                await axios.post(process.env.WAURL!, JSON.stringify(mediaData), { headers });
                return NextResponse.json({ 'message': "file send", file: mediaData });
            }

            result = await prisma.file.findMany(
                {
                    where: {
                        userId: user.id,
                        parentId: folderData.id
                    }
                }
            );


            if (result.length == 0) {
                data = {
                    messaging_product: 'whatsapp',
                    to: waId,
                    type: 'text',
                    text: {
                        body: `Hi thanks for choosing drive manager ${profileName} .\r No files Found in the folder`
                    }
                };
                await axios.post(process.env.WAURL!, JSON.stringify(data), { headers });
                return NextResponse.json({ 'message': "no sub files found" });
            }

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


        await axios.post(process.env.WAURL!, JSON.stringify(data), { headers });
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({
            message: error,
            data: data
        }, { status: 500 });
    }

}