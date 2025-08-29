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

## Database Schema

### Tables
- `user_profiles`: User authentication and role management
- `contacts`: Main directory with all contact information
- `bioinformatics_ideas`: Patentable ideas and learning plans

### Sample Data
The schema includes sample contacts for testing:
- DR. PRASHANT BHAT (Medical Administration)
- MRS. PRAGATI (Medical Administration) 
- DR. RAJESH KUMAR (Oncology Research)
- MS. PRIYA SHARMA (IT Department)
- DR. ANITA DESAI (Bioinformatics)

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