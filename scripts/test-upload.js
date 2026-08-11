const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// Load .env.local if present (simple parser)
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const m = line.match(/^([^#=]+)=([\s\S]*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
}

// sanitize values (strip surrounding quotes)
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '').replace(/^\"|\"$/g, '');
const apiKey = (process.env.CLOUDINARY_API_KEY || '').replace(/^\"|\"$/g, '');
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').replace(/^\"|\"$/g, '');

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

async function run() {
  try {
    const filePath = path.resolve(process.cwd(), 'tmp', 'test.png');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64'));
    }

    console.log('Uploading', filePath);
    const res = await cloudinary.uploader.upload(filePath, { folder: 'frames', resource_type: 'image' });
    console.log('Upload success:', res.secure_url);
  } catch (err) {
    console.error('Upload failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

run();
