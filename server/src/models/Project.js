const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['planning', 'active', 'on-hold', 'completed'], default: 'active' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    color: { type: String, default: '#1d4ed8' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
