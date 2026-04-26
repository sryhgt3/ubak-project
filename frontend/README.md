# UBAK Frontend

This is the frontend for the UBAK Web Application, built with React 19, TypeScript, and Tailwind CSS.

## Tech Stack
- **React 19:** Functional components and hooks.
- **TypeScript:** Strong typing for reliable code.
- **Tailwind CSS:** Modern utility-first CSS framework.
- **Lucide React:** Beautiful and consistent icon set.
- **Axios:** Promise-based HTTP client for API calls.

## Local Setup (without Docker)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Setup environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `VITE_API_URL` in `.env` with your backend URL (e.g., your ngrok URL).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```
