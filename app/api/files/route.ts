import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, res: NextResponse) {


    return NextResponse.json({
        message: "Success",

    });
}