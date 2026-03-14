import axios from 'axios';

export default async function handler(req, res) {
  const { pincode } = req.query;

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: 'Please enter a valid 6-digit pincode.' });
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/pincode/${pincode}?country=IN`);
    
    if (response.data.success) {
      res.status(200).json({
        serviceable: true,
        message: `Yes, we deliver to ${response.data.data[0].city}, ${response.data.data[0].state}.`,
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
    console.error('Error fetching from pincode API:', error);
    res.status(500).json({
      serviceable: false,
      message: 'Could not check serviceability at this time.',
    });
  }
}