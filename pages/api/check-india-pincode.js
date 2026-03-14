
import { indiaPincodes } from '@/india-pincodes';

export default function handler(req, res) {
  const { pincode } = req.query;

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: 'Please enter a valid 6-digit pincode.' });
  }

  const isServiceable = indiaPincodes.includes(pincode);

  if (isServiceable) {
    res.status(200).json({ serviceable: true, message: 'Yes, we deliver to this pincode.' });
  } else {
    res.status(200).json({ serviceable: false, message: 'Invalid pincode.' });
  }
}
