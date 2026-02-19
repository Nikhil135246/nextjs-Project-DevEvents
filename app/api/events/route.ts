import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Event } from "../../../database";

export async function POST(req: NextRequest)
{
    try{
        await connectDB();

        const formData = await req.formData();
        
        let event ; 

        try {
            event = Object.fromEntries(formData.entries());
        }catch (e) {
            return NextResponse.json({message:'Invalid form data'}, {status:400});
        }
        // Now as we setup Cloudinary , we can handle image uploads here
        const file = formData.get('image') as File | null;

        // NO file presetn then return warning 
        if(!file)
        {
            return NextResponse.json({message:"Image File chahiey bhai kya kr raha tu 😎"}, {status:400})
        }

        // if File present 
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise
        const createdEvent = await Event.create(event);

        return NextResponse.json({message:'Event created successfully', event: createdEvent}, {status:201});
    }catch(error)
    {
        console.error("Error creating event:", error);
        return NextResponse.json({message:'Event creation failed', error:error instanceof Error ? error.message : 'Unknown error'}, {status:500});
    }
}