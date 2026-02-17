import mongoose, { Document, Schema, Model } from 'mongoose';
import { parseISO, isValid } from 'date-fns';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
      maxlength: [500, 'Overview cannot exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be online, offline, or hybrid',
      },
      trim: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Pre-save hook to generate slug and normalize date/time
 * - Generates URL-friendly slug from title (only if title changed)
 * - Normalizes date to ISO format
 * - Ensures time is in consistent HH:MM format
 */
EventSchema.pre('save', function () {
  // Generate slug only if title is modified or new document
  if (this.isModified('title') || this.isNew) {
    const baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    // Append short unique suffix to prevent collisions
    this.slug = `${baseSlug}-${this._id.toString().slice(-6)}`;
  }
  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified('date') || this.isNew) {
    // Validate strict ISO date format (YYYY-MM-DD)
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(this.date)) {
      throw new Error('Date must be in YYYY-MM-DD format');
    }
    
    // Use strict parser to validate the date without timezone conversion
    const dateObj = parseISO(this.date);
    if (!isValid(dateObj)) {
      throw new Error('Invalid date: please provide a valid date in YYYY-MM-DD format');
    }
    
    // Store the normalized YYYY-MM-DD string (already validated)
    this.date = this.date;
  }

  // Normalize time to HH:MM format
  if (this.isModified('time') || this.isNew) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(this.time)) {
      throw new Error('Time must be in HH:MM format');
    }
    // Ensure leading zeros (e.g., "9:00" becomes "09:00")
    const [hours, minutes] = this.time.split(':');
    this.time = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }
});

// Create unique index on slug for faster lookups
EventSchema.index({ slug: 1 }, { unique: true });

// Export the model (reuse existing model if already compiled)
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
