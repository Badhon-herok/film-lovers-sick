# Film Lovers Are Sick People 🎬

A curated digital shrine to cinema's most captivating moments. A modern web application for film enthusiasts to collect, organize, and showcase their favorite film frames and scenes.

## Features ✨

- **Film Collection** - Add and manage films with posters, ratings, and metadata
- **Frame Gallery** - Upload and organize cinematic frames from your favorite films
- **Dark Gothic UI** - Immersive, atmospheric interface inspired by cinema
- **Explicit Content Filter** - Toggle explicit content visibility
- **Admin Dashboard** - Complete management system for content
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Real-time Database** - Firebase Firestore integration

## Tech Stack 🛠️

- **Frontend:** Next.js 14, React, TypeScript
- **Backend:** Firebase (Firestore, Authentication)
- **Storage:** Cloudinary
- **Deployment:** Vercel
- **Styling:** Tailwind CSS, Inline Styles

## Installation 📦

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account
- Cloudinary account

### Setup

1. **Clone the repository:**
git clone https://github.com/yourusername/film-lovers-sick.git
cd film-lovers-sick

text

2. **Install dependencies:**
npm install

text

3. **Set up environment variables:**

Create `.env.local` in the root directory:

Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

text

4. **Run development server:**
npm run dev

text

Visit `http://localhost:3000` in your browser.

## Usage 🎥

### For Admin Users

1. **Add Films:**
   - Navigate to `/admin/upload-film`
   - Enter film details (name, rating, Letterboxd link, poster)
   - Optional: Add director, genre, cast, plot
   - Submit to add to collection

2. **Upload Frames:**
   - Go to `/admin/upload-frames`
   - Select a film
   - Upload frame images
   - Set explicit content flag if needed
   - Organize frames by order

3. **Manage Content:**
   - View all films at `/admin/manage-films`
   - Edit film details
   - View frame statistics

### For Public Users

1. **Browse Films:**
   - View latest films on homepage
   - See all films at `/films`
   - Filter by explicit content

2. **View Frames:**
   - Click any film to view all frames
   - Click frames to open lightbox view
   - View film details and Letterboxd link

## Project Structure 📁

src/
├── app/
│ ├── (auth)/ # Authentication pages
│ ├── admin/ # Admin dashboard
│ │ ├── upload-film/ # Film upload page
│ │ ├── upload-frames/ # Frame upload page
│ │ └── manage-films/ # Film management
│ ├── api/ # API routes
│ ├── films/ # Public film pages
│ │ ├── [filmId]/ # Film details page
│ │ └── page.tsx # Films list
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Homepage
│ └── globals.css # Global styles
├── components/ # Reusable components
│ ├── Header.tsx
│ ├── Footer.tsx
│ └── ...
├── lib/ # Utilities & helpers
│ ├── firebase.ts # Firebase config
│ ├── firebaseHelpers.ts # Database functions
│ ├── firestoreSchema.ts # Type definitions
│ └── ...
└── hooks/ # Custom React hooks
└── useAuth.ts

text

## Environment Variables 🔐

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |

## Deployment 🚀

This project is optimized for **Vercel** deployment:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Add environment variables
6. Click "Deploy"

**Your site will be live in 2-3 minutes!**

## Features Roadmap 🗺️

- [ ] User authentication for visitors
- [ ] Film ratings/reviews system
- [ ] Advanced search and filtering
- [ ] User favorites collection
- [ ] Social sharing (Twitter, Facebook)
- [ ] Analytics dashboard
- [ ] API for external integrations

## Legal Notice ⚖️

This project is created for personal entertainment and educational purposes. Film posters are property of their respective studios. This is a fan appreciation site.

**Attribution:**
- Film data: [Letterboxd](https://letterboxd.com)
- Film information: [IMDb](https://www.imdb.com)

## Contributing 🤝

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License 📄

This project is open source and available under the MIT License.

## Credits 👏

- Built with [Next.js](https://nextjs.org)
- Powered by [Firebase](https://firebase.google.com)
- Media hosting by [Cloudinary](https://cloudinary.com)
- Deployed on [Vercel](https://vercel.com)

## Contact 📧

For questions or feedback, feel free to reach out!

---

**Happy cinema collecting! 🎬🍿**
