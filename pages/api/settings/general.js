import fs from 'fs';
import path from 'path';

const settingsFilePath = path.resolve(process.cwd(), 'data/settings.json');

// Default settings
const defaultSettings = {
  siteName: 'Tanish Logistic',
  logoUrl: '/icon.png',
  slogan: 'Driven by Trust, Powered by Roads',
  contactDetails: 'Vadodara, Gujarat, India',
  copyright: `© ${new Date().getFullYear()} Tanish Logistic. All rights reserved.`,
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
  paymentApiKey: '',
  defaultPostStatus: 'draft',
  commentModeration: 'manual',
  passwordPolicy: ''
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      if (fs.existsSync(settingsFilePath)) {
        const fileContent = fs.readFileSync(settingsFilePath, 'utf-8');
        const savedSettings = JSON.parse(fileContent);
        // Merge saved settings with defaults
        res.status(200).json({ ...defaultSettings, ...savedSettings });
      } else {
        // Return defaults if no settings file exists
        res.status(200).json(defaultSettings);
      }
    } catch (error) {
      res.status(200).json(defaultSettings);
    }
  } else if (req.method === 'POST') {
    try {
      // Ensure directory exists
      const dir = path.dirname(settingsFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(settingsFilePath, JSON.stringify(req.body, null, 2));
      res.status(200).json({ message: 'Settings saved successfully.' });
    }
    catch (error) {
      res.status(500).json({ message: 'Failed to save settings.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
