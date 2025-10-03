# AI Math Problem Generator

An intelligent math problem generator built with Next.js that creates personalized Primary 5 level math problems using Google's Gemini AI and stores data in Supabase.

## Features

- **AI-Powered Problem Generation**: Uses Google Gemini AI to create diverse Primary 5 level math problems
- **Interactive Problem Solving**: Clean, user-friendly interface for solving math problems
- **Intelligent Feedback**: Personalized feedback based on user answers using AI
- **Data Persistence**: Stores problems and submissions in Supabase database
- **Real-time Validation**: Instant answer checking and feedback generation

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI**: Google Generative AI (Gemini)
- **Deployment**: Vercel-ready

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Google AI API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ottodot-coding-task-full-stack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your actual credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google Generative AI Configuration
   GOOGLE_API_KEY=your_google_api_key
   ```

4. **Set up the database**
   
   Run the SQL commands in `database.sql` in your Supabase SQL editor to create the required tables:
   - `math_problem_sessions`
   - `math_problem_submissions`

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### `math_problem_sessions`
- `id` (UUID, Primary Key)
- `problem_text` (Text) - The generated math problem
- `correct_answer` (Text) - The correct answer to the problem
- `created_at` (Timestamp)

### `math_problem_submissions`
- `id` (UUID, Primary Key)
- `session_id` (UUID, Foreign Key) - References math_problem_sessions
- `user_answer` (Text) - The user's submitted answer
- `is_correct` (Boolean) - Whether the answer was correct
- `feedback_text` (Text) - AI-generated personalized feedback
- `created_at` (Timestamp)

## API Endpoints

### `POST /api/math-problem`
Generates a new Primary 5 level math problem using Gemini AI.

**Response:**
```json
{
  "sessionId": "uuid",
  "problem": "What is 245 + 178?"
}
```

### `POST /api/math-problem/submit`
Submits an answer and receives AI-generated feedback.

**Request:**
```json
{
  "sessionId": "uuid",
  "answer": "423"
}
```

**Response:**
```json
{
  "isCorrect": true,
  "feedback": "Excellent work! You correctly added 245 + 178 = 423..."
}
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── math-problem/
│   │       ├── route.ts          # Problem generation endpoint
│   │       └── submit/
│   │           └── route.ts      # Answer submission endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application page
├── lib/
│   └── supabaseClient.ts        # Supabase configuration
├── database.sql                 # Database schema
├── .env.local.example          # Environment variables template
└── package.json                # Dependencies and scripts
```

## Usage

1. **Generate a Problem**: Click "Generate New Problem" to get a fresh Primary 5 math problem
2. **Solve the Problem**: Enter your answer in the input field
3. **Submit Answer**: Click "Submit Answer" to check your solution
4. **Get Feedback**: Receive personalized AI-generated feedback on your answer
5. **Try Again**: Generate new problems to continue practicing

## Deployment

### Deploy to Vercel

This project is ready for deployment on Vercel with zero configuration:

1. **Quick Deploy**: 
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo)

2. **Manual Deployment**:
   - Push your code to GitHub/GitLab/Bitbucket
   - Connect your repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables Required**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_API_KEY=your_google_ai_api_key
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run vercel-build` - Build for Vercel deployment

### Environment Setup

Make sure to configure your environment variables properly:

1. **Supabase Setup**:
   - Create a new Supabase project
   - Get your project URL and anon key from the API settings
   - Run the SQL schema from `database.sql`

2. **Google AI Setup**:
   - Get an API key from Google AI Studio
   - Enable the Generative AI API

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.
