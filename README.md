# NoteTrack

NoteTrack is a note-taking application built with Next.js 15, React 19, and Supabase.

## Deployment to Netlify

This project is configured for deployment to Netlify using the `netlify.toml` configuration file.

### Netlify Configuration

The `netlify.toml` file in the root directory contains all the necessary configuration for building and deploying the application:

- **Base directory**: `frontend`
- **Build command**: `next build`
- **Publish directory**: `.next`
- **Netlify Next.js plugin**: Automatically handles Next.js specific optimizations

### Environment Variables

Make sure to set the following environment variables in your Netlify project settings:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Deployment Steps

1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the `netlify.toml` file
3. The build will run automatically on each push to the main branch

### Local Development

To run the project locally:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at http://localhost:3000
