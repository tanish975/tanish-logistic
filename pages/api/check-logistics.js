import axios from 'axios';
import { indiaPincodes } from '@/src/india-pincodes';

export default async function handler(req, res) {
  const { pincode } = req.query;

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: 'Please enter a valid 6-digit pincode.' });
  }

  try {
    // Use local pincodes for better performance and reliability
    const isServiceable = indiaPincodes.includes(pincode);
    
    if (isServiceable) {
      res.status(200).json({
        serviceable: true,
        message: `Yes, we deliver to this pincode.`,
        deliveryTime: '2-3 business days',
        codAvailable: Math.random() > 0.5, // Mocking COD availability
      });
    } else {
      res.status(404).json({
        serviceable: false,
        message: 'Sorry, this area is not covered yet.',
      });
    }
  } catch (error) {
    console.error('Error checking logistics:', error);
    res.status(500).json({
      serviceable: false,
      message: 'Could not check serviceability at this time.',
    });
  }
}