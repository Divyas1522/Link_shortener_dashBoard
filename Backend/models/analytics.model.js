const { Schema, model } = require('mongoose');

const analyticsSchema = new Schema({

  linkId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Link', 
    required: true 
  },
  userEmail: {
     type: String, 
     required: 
     true 
  },
  device: {
     type: String,
      default: 'Desktop' 
  },
  browser: {
     type: String,
      default: 'Unknown'
  },
  os: {
     type: String,
      default: 'Unknown'
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },

},
  {
    timestamps: true ,
  }
);

module.exports = model('Analytics', analyticsSchema);
