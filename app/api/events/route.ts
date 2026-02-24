import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Event } from "../../../database";
import { v2 as cloudinary } from "cloudinary";
import { create } from "domain";

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
        
        // Make sure in mongodb we get tags,agenda as array of string not comma separated string like  tags :"['cloud', 'devops']"  we want :["cloud","devops"]

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);
        // above line converts the stringified array back to actual array of string

        // Overwrite the tags and agenda in event object with parsed array values

        event.tags = tags;
        event.agenda = agenda;

        // NO file presetn then return warning 
        if(!file)
        {
            return NextResponse.json({message:"Image File chahiey bhai kya kr raha tu 😎"}, {status:400})
        }

        // if File present 
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }).end(buffer);
        });

        event.image =(uploadResult as {secure_url: string}).secure_url; 

        const createdEvent = await Event.create(event);

        return NextResponse.json({message:'Event created successfully', event: createdEvent}, {status:201});
    }catch(error)
    {
        console.error("Error creating event:", error);
        return NextResponse.json({message:'Event creation failed', error:error instanceof Error ? error.message : 'Unknown error'}, {status:500});
    }
}

// We can also add GET method to fetch all events

export async function GET()
{
    try{
        await connectDB();
        const events = await Event.find().sort({createdAt:-1});
        return NextResponse.json({message:'Events fetched successfully', events}, {status:200});
        
    }catch(e){
        // Basic error : cleaner for client friendly error message
        // return NextResponse.json({message:'Failed to fetch events', error:e instanceof Error ? e.message : 'Unknown error'}, {status:500});

        //! But for debugging purpose we can also return the whole error object
        return NextResponse.json({message:'Failed to fetch events', error:e }, {status:500});
    }
}