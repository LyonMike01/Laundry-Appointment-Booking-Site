const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
}, {
        timestamps: true
    
});

const Bookings = mongoose.model('Booking', bookingSchema)

module.exports = {
    Bookings
}