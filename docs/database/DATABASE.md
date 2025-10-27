# ACTREC Telephone Directory - Database Documentation

## Overview

The ACTREC Telephone Directory System uses Supabase PostgreSQL as its database backend. This document describes the database schema, relationships, and management procedures.

## Database Schema

### Contacts Table

Stores contact information for all directory entries.

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

**Fields:**
- `id`: Unique identifier (UUID)
- `name`: Full name of the contact (required)
- `department`: Department or division
- `designation`: Job title or position
- `phone_number`: Primary phone number
- `extension`: Internal extension number
- `email`: Email address (unique)
- `location`: Physical location or office
- `institution`: Organization (defaults to ACTREC)
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

### User Profiles Table

Stores user account information and roles.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'regular',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields:**
- `id`: User ID (references Supabase auth.users)
- `email`: User email address (unique, required)
- `role`: User role ('admin' or 'regular')
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

### User Credentials Table

Stores user authentication credentials.

```sql
CREATE TABLE user_credentials (
  email TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Fields:**
- `email`: User email address (primary key)
- `password`: User password (plaintext - should be hashed in production)
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

### Learning Plans Table

Stores user learning and development plans.

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

**Fields:**
- `email`: User email address (part of composite primary key)
- `title`: Plan title (part of composite primary key)
- `description`: Detailed plan description
- `category`: Plan category (e.g., Professional, Technical)
- `status`: Plan status ('not-started', 'in-progress', 'completed', 'archived')
- `target_completion_date`: Planned completion date
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

### Patentable Ideas Table

Stores user-submitted patentable ideas.

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

**Fields:**
- `email`: User email address (part of composite primary key)
- `title`: Idea title (part of composite primary key)
- `description`: Detailed idea description
- `category`: Idea category (e.g., Technology, Process)
- `status`: Idea status ('draft', 'submitted', 'approved', 'rejected')
- `created_at`: Record creation timestamp
- `updated_at`: Record last update timestamp

## Relationships

### Entity Relationship Diagram

```
contacts 1-----1 user_profiles
    |
    |--(email)--> user_credentials
    |--(email)--> learning_plans
    |--(email)--> patentable_ideas
```

### Key Relationships

1. **Contacts to User Profiles**: One-to-one relationship based on email
2. **Contacts to User Credentials**: One-to-one relationship based on email
3. **Contacts to Learning Plans**: One-to-many relationship based on email
4. **Contacts to Patentable Ideas**: One-to-many relationship based on email

## Row Level Security (RLS)

RLS policies ensure that users can only access appropriate data:

### Contacts Table Policies
- Authenticated users can view all contacts (directory nature)
- Admin users can insert, update, and delete contacts
- Regular users have read-only access

### Learning Plans Table Policies
- Users can view their own learning plans
- Admin users can view all learning plans
- Users can insert and update their own learning plans
- Admin users can insert and update all learning plans

### Patentable Ideas Table Policies
- Users can view their own patentable ideas
- Admin users can view all patentable ideas
- Users can insert and update their own patentable ideas
- Admin users can insert and update all patentable ideas

## Database Operations

### Initialization

To initialize the database:

1. Create a new Supabase project
2. Run the migration scripts in `supabase/migrations/`
3. Configure RLS policies
4. Set up authentication

### Backup and Recovery

1. **Automated Backups**
   - Supabase provides automated daily backups
   - Backups are retained for 7 days
   - Point-in-time recovery is available

2. **Manual Backups**
   ```bash
   pg_dump -h [host] -U [user] -d [database] > backup.sql
   ```

3. **Restore**
   ```bash
   psql -h [host] -U [user] -d [database] < backup.sql
   ```

### Maintenance

1. **Index Optimization**
   - Indexes on email fields for faster lookups
   - Composite indexes on learning plans and patentable ideas tables

2. **Vacuum Operations**
   - Regular vacuuming to reclaim storage
   - Analyze operations to update statistics

## Migration Scripts

Migration scripts are located in `supabase/migrations/` and should be applied in order:

1. `20240101000000_create_contacts_table.sql` - Create contacts table
2. `20240101000001_create_user_profiles_table.sql` - Create user profiles table
3. `20240101000002_create_user_credentials_table.sql` - Create user credentials table
4. `20240101000003_create_learning_plans_table.sql` - Create learning plans table
5. `20240101000004_create_patentable_ideas_table.sql` - Create patentable ideas table
6. `20240101000005_add_rls_policies.sql` - Add RLS policies

## Sample Data

### Admin User
```sql
-- Insert admin user profile
INSERT INTO user_profiles (id, email, role) 
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@actrec.gov.in', 'admin');

-- Insert admin credentials
INSERT INTO user_credentials (email, password) 
VALUES ('admin@actrec.gov.in', 'admin123');
```

### Sample Contact
```sql
-- Insert sample contact
INSERT INTO contacts (name, department, designation, phone_number, extension, email, location)
VALUES ('Dr. John Smith', 'Medical Administration', 'Chief Medical Officer', '23456789', '1001', 'john.smith@actrec.gov.in', 'Main Building');
```

## Troubleshooting

### Common Issues

1. **RLS Policy Violations**
   - Check that users have proper authentication
   - Verify that RLS policies are correctly applied
   - Ensure service role key is used for admin operations

2. **Connection Errors**
   - Verify Supabase URL and keys in environment variables
   - Check network connectivity to Supabase
   - Confirm Supabase project is not paused

3. **Data Integrity Issues**
   - Check for constraint violations
   - Verify foreign key relationships
   - Ensure unique constraints are not violated

### Monitoring

1. **Query Performance**
   - Monitor slow-running queries
   - Add indexes for frequently queried fields
   - Optimize complex queries

2. **Storage Usage**
   - Monitor database size growth
   - Archive old data if necessary
   - Optimize data types for storage efficiency

## Best Practices

### Data Modeling

1. **Normalization**
   - Use appropriate data types
   - Normalize data to reduce redundancy
   - Maintain referential integrity

2. **Indexing**
   - Create indexes on frequently queried fields
   - Use composite indexes for multi-column queries
   - Monitor index usage and remove unused indexes

### Security

1. **Access Control**
   - Regularly review RLS policies
   - Limit database user privileges
   - Use parameterized queries to prevent SQL injection

2. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS for data in transit
   - Implement proper backup encryption

## Future Considerations

### Scalability

1. **Horizontal Scaling**
   - Consider partitioning large tables
   - Implement read replicas for read-heavy workloads
   - Use connection pooling for better performance

2. **Performance Optimization**
   - Implement caching strategies
   - Optimize query execution plans
   - Use database connection pooling

### Advanced Features

1. **Audit Logging**
   - Implement triggers for audit trails
   - Track data changes with timestamps
   - Maintain user activity logs

2. **Data Archiving**
   - Archive old records to reduce table size
   - Implement data retention policies
   - Create archive tables for historical data