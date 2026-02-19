import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import mongoose from 'mongoose';

// Define the params type for the dynamic route
type Params = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    // Await params before accessing slug (required in Next.js 15+)
    const { slug } = await params;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Slug parameter is required and must be a string' },
        { status: 400 }
      );
    }

    // Sanitize slug: trim whitespace and convert to lowercase
    const sanitizedSlug = slug.trim().toLowerCase();

    if (sanitizedSlug.length === 0) {
      return NextResponse.json(
        { error: 'Slug cannot be empty' },
        { status: 400 }
      );
    }

    // Validate slug format (URL-friendly)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(sanitizedSlug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Must be URL-friendly (lowercase alphanumeric with hyphens)' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle Mongoose/MongoDB errors
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Log unexpected errors for debugging
    console.error('Error fetching event:', error);

    // Return generic error message to client
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
