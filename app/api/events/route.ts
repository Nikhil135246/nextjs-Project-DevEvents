import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import { Event } from "../../../database";
import { v2 as cloudinary } from "cloudinary";
import { create } from "domain";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest)
{
    try{
        await connectDB();

        const formData = await req.formData();
        
        let event: Record<string, unknown>;

        try {
            event = Object.fromEntries(formData.entries()) as Record<string, unknown>;
        }catch (e) {
            return NextResponse.json({message:'Invalid form data'}, {status:400});
        }
        // Now as we setup Cloudinary , we can handle image uploads here
        const file = formData.get('image') as File | null;
        
        // Parse and validate tags and agenda arrays
        let tags: string[];
        let agenda: string[];

        try {
            const tagsRaw = formData.get('tags');
            const agendaRaw = formData.get('agenda');

            if (!tagsRaw || !agendaRaw) {
                return NextResponse.json({ message: 'Tags and agenda are required' }, { status: 400 });
            }

            tags = JSON.parse(tagsRaw as string);
            agenda = JSON.parse(agendaRaw as string);
        } catch {
            return NextResponse.json({ message: 'Invalid tags or agenda format. Must be valid JSON arrays.' }, { status: 400 });
        }

        // Validate parsed values are arrays of strings
        if (!Array.isArray(tags) || !tags.every((t) => typeof t === 'string')) {
            return NextResponse.json({ message: 'Tags must be an array of strings' }, { status: 400 });
        }

        if (!Array.isArray(agenda) || !agenda.every((a) => typeof a === 'string')) {
            return NextResponse.json({ message: 'Agenda must be an array of strings' }, { status: 400 });
        }

        // Assign validated arrays to event object
        event.tags = tags;
        event.agenda = agenda;

        // Validate file exists
        if (!file) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ message: 'File must be an image (e.g., JPEG, PNG, GIF)' }, { status: 400 });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ message: `Image size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB` }, { status: 400 });
        }

        // Process file after validation
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image',folder:'DevEvent' }, (error, result) => {
                if (error) reject(error);
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
        return NextResponse.json({success: true, data: events, message:'Events fetched successfully'}, {status:200});
        
    }catch(e){
        console.error('Error fetching events:', e);
        
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        const response: Record<string, unknown> = {
            success: false,
            message: 'Failed to fetch events',
        };

        // Include detailed error info only in development
        if (process.env.NODE_ENV === 'development') {
            response.error = errorMessage;
            response.stack = e instanceof Error ? e.stack : undefined;
        }

        return NextResponse.json(response, { status: 500 });
    }
}