import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';
import geocoder from '../utils/geocoder.js';

const halqahSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: { type: String },
  stars: {
    type: Number,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formattedAddress: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipcode: { type: String },
    country: { type: String },
  },

  time: {
    start: {
      type: String,
    },
    end: {
      type: String,
      required: true,
    },
  },
  occurrence: { type: String, enum: ['weekly', 'biweekly', 'monthly'] },
  categories: [
    {
      type: String,
      enum: [
        'Tawhid',
        'Fiqh',
        'Hadith',
        'Tajweed',
        'Arabiyyah',
        'Yoruba',
        'Hausa',
        'Igbo',
        'Irab',
      ],
    },
  ],
});

halqahSchema.plugin(URLSlugs('name'));
halqahSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[1].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    country: loc[0].countryCode,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
  };

  next();
});

const Halqah = mongoose.model('Halqah', halqahSchema);

export default Halqah;
