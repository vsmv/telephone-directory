# ACTREC Telephone Directory System

A comprehensive web application for managing employee contacts, learning plans, and patentable ideas at Advanced Centre for Treatment, Research and Education in Cancer (ACTREC).

## 🚀 Features

- **Contact Management**: Complete employee directory with search and filtering
- **Learning Plans**: Track employee development and training programs
- **Patentable Ideas**: Manage research innovations and patent submissions
- **User Management**: Role-based access control system
- **Bulk Operations**: CSV import/export functionality

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **UI**: Shadcn/ui components
- **Authentication**: Custom role-based system

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd telephone-directory
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration

Create environment files with your Supabase credentials:

**.env.local** (for development):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**.env.production** (for production):
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

### 4. Database Setup

Run the complete database schema in your Supabase SQL Editor:

```sql
-- Use the schema from: supabase/migrations/00000000000000_complete_database_schema.sql
```

This will create all necessary tables, indexes, triggers, and RLS policies.

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Run tests (optional)
```bash
npm test
```

This will run the Jest test suite to verify all functionality.

## 🗄 Database Schema

The system uses 5 main tables:

1. **contacts** - Employee directory information
2. **user_profiles** - User roles and permissions  
3. **user_credentials** - Authentication data
4. **learning_plans** - Development plans
5. **patentable_ideas** - Research submissions

## 👥 Default Users

**Admin User:**
- Email: `admin@actrec.gov.in`
- Role: Admin (full access to all features)

**Regular User:**
- Any other email
- Role: Regular (view-only access)

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 📁 Project Structure

```
telephone-directory/
├── app/                    # Next.js app router
│   ├── dashboard/         # Main dashboard
│   ├── auth/login/        # Authentication
│   └── search/            # Search functionality
├── components/            # React components
├── lib/                   # Core business logic
├── supabase/migrations/   # Database schema
└── public/               # Static assets
```

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Role-based Permissions**: Admin vs Regular user access
- **Input Validation**: Client and server-side validation
- **Secure Authentication**: Service role key protection

## 📊 Key Features

### Contact Management
- Add, edit, delete employee contacts
- Search by name, email, department
- Bulk CSV import/export
- Department and designation filtering

### Learning Plans
- Create development plans with target dates
- Track progress (Not Started, In Progress, Completed, Archived)
- Category-based organization
- Full CRUD operations

### Patentable Ideas
- Submit research ideas and innovations
- Status tracking (Draft, Submitted, Approved, Rejected)
- Category classification
- Full CRUD operations

### User Management (Admin Only)
- Manage user roles and permissions
- User profile administration
- Password management

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify Supabase URL and keys in environment files
   - Check if RLS policies are properly configured

2. **Permission Denied**
   - Ensure user has proper role in user_profiles table
   - Verify RLS policies are active

3. **Build Errors**
   - Run `npm run build` to check for TypeScript errors
   - Ensure all environment variables are set

## 📞 Support

For technical support or questions about the ACTREC Telephone Directory System, please contact the development team.

## 📄 License

This project is proprietary software developed for ACTREC.

---

**Last Updated**: October 24, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
