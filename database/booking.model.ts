import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Pre-save hook to validate that the referenced event exists
 * Prevents bookings for non-existent events
 */
BookingSchema.pre('save', async function () {
  // Only validate eventId if it's modified or new
  if (this.isModified('eventId') || this.isNew) {
    try {
      // Dynamically import Event model to avoid circular dependency issues
      const Event = mongoose.models.Event || (await import('./event.model')).default;
      
      const eventExists = await Event.exists({ _id: this.eventId });
      
      if (!eventExists) {
        throw new Error('Referenced event does not exist');
      }
    } catch (error) {
      throw new Error('Failed to validate event reference');
    }
  }
});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Compound index for preventing duplicate bookings (optional but recommended)
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Export the model (reuse existing model if already compiled)
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
