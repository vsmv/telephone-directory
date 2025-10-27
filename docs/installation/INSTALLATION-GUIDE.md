# ACTREC Telephone Directory - Installation Guide

## System Requirements

### Development Environment
- Node.js 18.x or higher
- npm 9.x or higher (comes with Node.js)
- Git 2.30 or higher
- Code editor (VS Code recommended)

### Production Environment
- Node.js 18.x or higher
- npm 9.x or higher
- Web server (Nginx, Apache, or similar)
- SSL certificate (recommended)

### Database Requirements
- Supabase account
- PostgreSQL database (provided by Supabase)

## Prerequisites

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Create a Supabase account at [supabase.com](https://supabase.com/)
3. Clone the repository:
   ```bash
   git clone <repository-url>
   cd telephone-directory
   ```

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

To obtain these values:
1. Log in to your Supabase account
2. Create a new project or select an existing one
3. Go to Project Settings > API
4. Copy the Project URL, anon key, and service role key

### 3. Database Setup

The application requires the following tables in your Supabase database:

1. **contacts** - Stores contact information
2. **user_profiles** - Stores user account information
3. **user_credentials** - Stores user authentication credentials
4. **learning_plans** - Stores user learning plans
5. **patentable_ideas** - Stores patentable ideas

Run the database migration scripts located in `supabase/migrations/`:

```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### 5. Build for Production

```bash
npm run build
```

### 6. Start Production Server

```bash
npm start
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | Yes |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anonymous key | Yes |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key | Yes |

### Port Configuration

The application runs on port 3001 by default. To change the port, modify the dev script in `package.json`:

```json
"scripts": {
  "dev": "next dev --turbo -p YOUR_PORT_NUMBER"
}
```

## Database Schema

The application requires the following database schema. For detailed schema information, see [Database Schema](../database/schema.sql).

### Contacts Table
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department TEXT,
  designation TEXT,
  phone_number TEXT,
  extension TEXT,
  email TEXT UNIQUE,
  location TEXT,
  institution TEXT DEFAULT 'ACTREC',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'regular',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Credentials Table
```sql
CREATE TABLE user_credentials (
  email TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Learning Plans Table
```sql
CREATE TABLE learning_plans (
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'not-started',
  target_completion_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (email, title)
);
```

### Patentable Ideas Table
```sql
CREATE TABLE patentable_ideas (
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (email, title)
);
```

## Testing the Installation

After installation, verify that the application is working correctly:

1. Navigate to `http://localhost:3001`
2. You should see the login page
3. Try logging in with the default admin account:
   - Email: `admin@actrec.gov.in`
   - Password: `admin123`
4. Verify that you can access the admin dashboard
5. Test regular user functionality with a test account

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Solution: Change the port in package.json or kill the process using the port

2. **Supabase connection failed**
   - Solution: Verify environment variables and Supabase project settings

3. **Database tables missing**
   - Solution: Run the database migration scripts

4. **Build errors**
   - Solution: Ensure all dependencies are installed with `npm install`

### Logs

Check the console output for error messages during development. For production, check your web server logs.

## Next Steps

After successful installation:

1. Configure user accounts
2. Import existing contact data
3. Set up regular backups
4. Configure SSL for production deployment
5. Review security settings

For deployment instructions, see [Deployment Guide](DEPLOYMENT.md).