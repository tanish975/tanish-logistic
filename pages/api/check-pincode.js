import { serviceablePincodes } from '../../src/pincodes';
import { withRateLimit } from '@/lib/rate-limit';

const lookup = withRateLimit(async function handler(req, res) {
  const { pincode } = req.query;

  if (typeof pincode !== 'string' || !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: 'Please enter a valid 6-digit pincode.' });
  }

  const isServiceable = serviceablePincodes.includes(pincode);

  if (isServiceable) {
    try {
      const apiRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, { signal: AbortSignal.timeout(3000) });
      const data = await apiRes.json();

      if (data && data[0] && data[0].Status === 'Success') {
        res.status(200).json({ serviceable: true, message: `Yes, we deliver to ${data[0].PostOffice[0].Name}, ${data[0].PostOffice[0].District}.` });
      } else {
        // Pincode is in our list, but the external API failed. Return a generic success message.
        res.status(200).json({ serviceable: true, message: 'Yes, we deliver to this pincode.' });
      }
    } catch {
      // External API failed, but we know it's serviceable.
      res.status(200).json({ serviceable: true, message: 'Yes, we deliver to this pincode.' });
    }
  } else {
    res.status(200).json({ serviceable: false, message: 'Sorry, this area is not covered yet.' });
  }
}, { limit: 30, windowMs: 60_000, name: 'pincode lookup' });

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  return lookup(req, res);
}
