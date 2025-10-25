import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  capital: {
    type: String,
    trim: true
  },
  region: {
    type: String,
    trim: true
  },
  population: {
    type: Number,
    required: true
  },
  currency_code: {
    type: String,
    required: true
  },
  exchange_rate: {
    type: Number
  },
  estimated_gdp: {
    type: Number,
    default: 0
  },
  flag_url: {
    type: String,
    trim: true
  },
  last_refreshed_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
// countrySchema.index({ name: 1 });
// countrySchema.index({ region: 1 });
// countrySchema.index({ currency_code: 1 });
// countrySchema.index({ estimated_gdp: -1 });

const Country = mongoose.model('Country', countrySchema);

export default Country;
