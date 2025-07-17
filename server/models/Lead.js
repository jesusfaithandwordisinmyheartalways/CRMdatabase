import mongoose from 'mongoose';



const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  status: { type: String, enum: ['HOT', 'COLD', 'PROSPECT', 'NATURE'], default: 'HOT' },
  notes: { type: String, default: '' },
}, { timestamps: true });



export default  mongoose.model('leads', LeadSchema);