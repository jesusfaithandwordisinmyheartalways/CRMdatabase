

import express from  'express'
import Lead from '../models/Lead.js'




const router = express.Router();




// GET all leads
router.get('/retrieve/all', async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// POST create new lead
router.post('/create-lead', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const saved = await newLead.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// PUT update a lead
router.put('/update-lead/:id', async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




// DELETE lead
router.delete('/delete-lead/:id', async (req, res) => {
  try {
    const deleted = await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted', id: deleted._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});





export default router