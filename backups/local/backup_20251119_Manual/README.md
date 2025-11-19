# ACTREC Consolidated Telephone Directory

A comprehensive telephone directory application built for ACTREC (Advanced Centre for Treatment, Research and Education in Cancer) to facilitate oncology and dementia research collaboration.

## Features

### Core Functionality
- **Role-based Authentication**: Admin and Regular user profiles
- **Advanced Search**: Search across all contact fields with partial matching
- **Contact Management**: Full CRUD operations for administrators
- **Bulk Operations**: CSV upload/download with duplicate handling
- **Bioinformatics Extension**: Store patentable ideas and learning plans

### User Roles
- **Regular Users**: Search contacts, change password
- **Admin Users**: Full access including contact management, bulk operations, and bioinformatics extension

### Bioinformatics Integration
- Store patentable ideas for AI-driven semantic search
- Learning plans for research collaboration workflows
- Support for oncology and dementia research partnerships
- Protein analysis collaboration features

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **File Processing**: PapaParse for CSV handling
- **Testing**: Jest, React Testing Library
- **Code Quality**: Codacy integration for static analysis

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd telephone-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy the SQL from `supabase/schema.sql` and run it in your Supabase SQL editor
   - Create your environment variables file:
   ```bash
   cp .env.local.example .env.local
   ```
   - Fill in your Supabase credentials in `.env.local`

4. **Create Admin User**
   - Sign up through the application (creates regular user by default)
   - In Supabase dashboard, update the user's role to 'admin' in the `user_profiles` table

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Code Quality with Codacy

This project is integrated with Codacy for automated code quality analysis:

### Features
- **Static Analysis**: ESLint, PMD, Semgrep for code quality
- **Security Scanning**: Trivy for vulnerability detection
- **Code Complexity**: Lizard for complexity metrics
- **CI/CD Integration**: GitHub Actions workflow
- **Pre-commit Hooks**: Local analysis before committing

### Running Analysis Locally
```bash
# Run Codacy analysis on the entire project
npm run codacy:analyze

# Install Codacy CLI (if not already installed)
npm run codacy:install

# Run pre-commit analysis (staged files only)
npm run codacy:precommit
```

### GitHub Actions
The project includes a GitHub Actions workflow that automatically runs Codacy analysis:
- On every push to main/master branch
- On every pull request
- Daily scheduled runs

### Configuration
- `.codacy.yml` - Main Codacy configuration
- `.github/workflows/codacy-analysis.yml` - CI/CD workflow
- Pre-commit hooks in `.git/hooks/pre-commit`

## Database Schema

### Tables
- `user_profiles`: User authentication and role management
- `contacts`: Main directory with all contact information
- `bioinformatics_ideas`: Patentable ideas and learning plans

### Sample Data
The schema includes a single sample contact for testing:
- DR. PRASHANT BHAT (Medical Administration)

## CSV Format

For bulk operations, use this exact header format:
```csv
Name,Department,Designation,Phone Number,Extension,Email,Location,Institution
```

Example:
```csv
Name,Department,Designation,Phone Number,Extension,Email,Location,Institution
DR. PRASHANT BHAT,Medical Administration,Doctor,-7671,5042,prashant.bhat@actrec.gov.in,Second Floor,ACTREC
```

## Testing

Run the test suite:
```bash
npm test
# or
pnpm test
```

For watch mode:
```bash
npm run test:watch
# or
pnpm test:watch
```

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Security Features

- Row Level Security (RLS) policies
- Role-based access control
- Password hashing with bcrypt
- HTTPS enforcement
- SQL injection protection
- XSS protection

## API Endpoints

The application uses Supabase's auto-generated REST API:
- `GET /rest/v1/contacts` - Search contacts
- `POST /rest/v1/contacts` - Add contact (admin only)
- `PATCH /rest/v1/contacts` - Update contact (admin only)
- `DELETE /rest/v1/contacts` - Delete contact (admin only)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software developed for ACTREC research purposes.

## Support

For technical support or questions about the application, please contact the development team.

## Roadmap

- This is a demo change.

### Phase 2 (Mobile Apps)
- React Native Android app
- React Native iOS app
- Shared codebase with web application
- Platform-specific optimizations

### Phase 3 (Advanced Features)
- Real-time notifications
- Advanced analytics
- External API integrations
- Enhanced bioinformatics features

## Acknowledgments

Built to support ACTREC's mission in oncology and dementia research, facilitating collaboration between researchers, medical professionals, and bioinformatics teams in drug discovery and protein analysis workflows.

## Developer: Local Quality Tools

This repository includes a GitHub Actions workflow for quality checks (`.github/workflows/quality.yml`) that runs ESLint, Semgrep, Lizard, and Trivy on pull requests. For local development, you can install minimal developer tooling to run the same checks locally.

Quick local setup (recommended)

- Install Node dependencies:

```cmd
cd "c:\D\Jeyarish Projects\Telephone Directory\telephone-directory-old"
npm ci
```

- Install Python dev requirements (Semgrep + Lizard):

```cmd
python -m pip install --user -r requirements-dev.txt
```

- Run ESLint (existing script):

```cmd
npm run lint
```

- Run Semgrep checks:

```cmd
semgrep --config=p/ci .
```

- Run Lizard complexity check (threshold 8):

```cmd
python -m lizard app -C 8
```

- Run Trivy (using Docker):

```cmd
docker run --rm -v "%cd%":/project aquasec/trivy fs --security-checks vuln,secret /project
```

Notes
- If you prefer Python virtual environments:

```cmd
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements-dev.txt
```

- Using WSL (Ubuntu) often simplifies native toolchain compatibility for Semgrep/Lizard installs.
- The GitHub Actions workflow already runs these checks on PRs; adding local checks ensures fast feedback before push/PR.
