# EngiNet Database Schema & Rules

## Supabase PostgreSQL Integration

EngiNet uses Supabase as the primary backend-as-a-service provider for database, authentication, and file storage.

## Database Configuration

### Connection Details
- Located in: `backend/src/config/supabase.js`
- Uses Service Role Key for server-side operations
- Auth auto-refresh disabled (backend context)
- Session persistence disabled

### Environment Variables Required
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-for-client
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Core Table Structure

Based on the 25+ active services, the following tables are essential:

### User & Authentication
```
profiles
├── id (UUID, PK) - Supabase user ID
├── full_name (TEXT)
├── email (TEXT)
├── account_type (TEXT) - 'individual' | 'company'
├── avatar_url (TEXT)
├── bio (TEXT)
├── location (TEXT)
├── phone (TEXT)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── RLS: Users can read their own profile
```

### Social Features
```
posts
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── title (TEXT)
├── content (TEXT)
├── image_url (TEXT)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── RLS: Anyone can read; authors can modify own posts

comments
├── id (UUID, PK)
├── post_id (UUID, FK → posts)
├── user_id (UUID, FK → profiles)
├── content (TEXT)
├── created_at (TIMESTAMP)
└── RLS: Anyone can read; authors can modify

likes
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── post_id (UUID, FK → posts)
├── comment_id (UUID, FK → comments, nullable)
├── created_at (TIMESTAMP)
└── RLS: Users can read all; create/delete own

bookmarks
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── post_id (UUID, FK → posts)
├── created_at (TIMESTAMP)
└── RLS: Users can only manage own bookmarks
```

### Job Board
```
jobs
├── id (UUID, PK)
├── company_id (UUID, FK → companies)
├── posted_by (UUID, FK → profiles)
├── title (TEXT)
├── description (TEXT)
├── location (TEXT)
├── salary_min (DECIMAL)
├── salary_max (DECIMAL)
├── job_type (TEXT) - 'full-time' | 'contract' | 'part-time'
├── status (TEXT) - 'open' | 'closed' | 'archived'
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── RLS: Anyone can read open jobs; employers manage own

job_applications
├── id (UUID, PK)
├── job_id (UUID, FK → jobs)
├── applicant_id (UUID, FK → profiles)
├── status (TEXT) - 'applied' | 'reviewing' | 'rejected' | 'accepted'
├── cover_letter (TEXT)
├── applied_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── RLS: Applicants see own; employers see applications for their jobs
```

### Messaging
```
messages
├── id (UUID, PK)
├── sender_id (UUID, FK → profiles)
├── recipient_id (UUID, FK → profiles)
├── content (TEXT)
├── is_read (BOOLEAN)
├── created_at (TIMESTAMP)
└── RLS: Users can read sent/received messages

chats
├── id (UUID, PK)
├── created_by (UUID, FK → profiles)
├── name (TEXT)
├── description (TEXT)
├── created_at (TIMESTAMP)
└── RLS: Members can read; creator can manage

notifications
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── type (TEXT) - 'message' | 'like' | 'comment' | 'job_update'
├── related_id (UUID) - ID of related entity
├── content (TEXT)
├── is_read (BOOLEAN)
├── created_at (TIMESTAMP)
└── RLS: Users can only read own notifications
```

### Professional Profile
```
skills
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── name (TEXT)
├── endorsements (INTEGER)
├── created_at (TIMESTAMP)
└── RLS: Anyone can read; users manage own

experiences
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── company (TEXT)
├── title (TEXT)
├── description (TEXT)
├── start_date (DATE)
├── end_date (DATE, nullable)
├── current (BOOLEAN)
├── created_at (TIMESTAMP)
└── RLS: Anyone can read; users manage own

education
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── school (TEXT)
├── degree (TEXT)
├── field (TEXT)
├── start_date (DATE)
├── end_date (DATE, nullable)
├── grade (TEXT)
├── created_at (TIMESTAMP)
└── RLS: Anyone can read; users manage own

certifications
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── name (TEXT)
├── issuer (TEXT)
├── issue_date (DATE)
├── expiry_date (DATE, nullable)
├── credential_id (TEXT)
├── credential_url (TEXT)
├── created_at (TIMESTAMP)
└── RLS: Anyone can read; users manage own

achievements
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── title (TEXT)
├── description (TEXT)
├── badge_icon (TEXT)
├── created_at (TIMESTAMP)
└── RLS: Anyone can read
```

### Company & Community
```
companies
├── id (UUID, PK)
├── name (TEXT, UNIQUE)
├── created_by (UUID, FK → profiles)
├── description (TEXT)
├── logo_url (TEXT)
├── website (TEXT)
├── industry (TEXT)
├── size (TEXT) - 'startup' | 'small' | 'medium' | 'large'
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── RLS: Anyone can read; company members can edit

communities
├── id (UUID, PK)
├── name (TEXT)
├── created_by (UUID, FK → profiles)
├── description (TEXT)
├── category (TEXT)
├── member_count (INTEGER)
├── created_at (TIMESTAMP)
└── RLS: Anyone can read; members can participate
```

### File Management
```
uploads
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── file_name (TEXT)
├── file_path (TEXT)
├── file_type (TEXT) - 'image' | 'document' | 'video'
├── file_size (INTEGER)
├── bucket_name (TEXT) - 'resumes' | 'avatars' | 'portfolios'
├── created_at (TIMESTAMP)
└── RLS: Users can manage own uploads; admins can see all
```

## Row Level Security (RLS) Policies

Located in: `database/policies/`

### Standard RLS Patterns

#### User Profile Access
```sql
-- Users can read all public profiles
CREATE POLICY "Public profile access" ON profiles
    FOR SELECT USING (true);

-- Users can update only their own profile
CREATE POLICY "Users update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
```

#### Private Content
```sql
-- Users can read messages addressed to them or sent by them
CREATE POLICY "Users can read own messages" ON messages
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = recipient_id
    );
```

#### Moderation Access
```sql
-- Admins can access all data
CREATE POLICY "Admins access all" ON posts
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    );
```

## Database Migrations

Located in: `database/migrations/`

Naming convention: `YYYYMMDD_feature_name.sql`

Example structure:
```sql
-- Migration: 20240715_create_profiles_table.sql
BEGIN;

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    account_type TEXT DEFAULT 'individual',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);

COMMIT;
```

## Data Seeding

Located in: `database/seeds/`

For development testing, populate test data:
- Test users with various roles
- Sample posts, jobs, messages
- Company and community data

## Query Patterns in Services

### Fetch with Filters
```javascript
const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, user_id, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(20)
    .offset(0);
```

### Create with Response
```javascript
const { data, error } = await supabase
    .from('posts')
    .insert([{
        user_id: userId,
        title: 'New Post',
        content: 'Content here'
    }])
    .select()
    .single();
```

### Update Specific Record
```javascript
const { data, error } = await supabase
    .from('profiles')
    .update({ full_name: 'New Name' })
    .eq('id', userId)
    .select()
    .single();
```

### Aggregate Operations
```javascript
const { data: count, error } = await supabase
    .from('job_applications')
    .select('*', { count: 'exact', head: true });
```

## Storage Buckets

Located in: `backend/src/config/storageBuckets.js`

### Bucket Organization
```
avatars/
├── {user_id}/{filename}

resumes/
├── {user_id}/{filename}

portfolios/
├── {user_id}/{project_id}/{filename}

posts/
├── {user_id}/{post_id}/{filename}

companies/
├── {company_id}/{filename}
```

### File Upload Process
1. Client uploads to Express endpoint
2. Multer validates file
3. Service uploads to Supabase Storage
4. Metadata stored in `uploads` table
5. URL returned to client

## Data Validation

### At Service Level
```javascript
// Validate before insert
if (!email || !email.includes('@')) {
    throw new Error('Invalid email format');
}

if (age < 18) {
    throw new Error('Must be 18 or older');
}
```

## Transaction Handling

For operations requiring multiple related changes:
```javascript
// Supabase handles transactions at query level
const { data: user, error: userError } = await supabase
    .from('profiles')
    .insert([{ /* user data */ }])
    .select();

if (userError) throw userError;

const { data: profile, error: profileError } = await supabase
    .from('profile_settings')
    .insert([{ user_id: user.id }])
    .select();

if (profileError) throw profileError;
```

## Backup & Recovery

### Automated Backups (Supabase Dashboard)
- Daily backups configured
- Point-in-time recovery available
- Retention policy set to 30 days

### Manual Backups
- Located in: `database/backups/`
- Taken before major migrations
- SQL dump format

## Performance Optimization

### Indexes
Create on frequently queried columns:
```sql
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
```

### Query Optimization
- Use specific column selection (not `SELECT *`)
- Filter early in the query
- Limit result sets with pagination
- Use appropriate indexes

## Data Integrity

### Constraints
- Foreign key relationships enforced
- Unique constraints on critical fields (email, company name)
- NOT NULL constraints on required fields

### Timestamp Management
```javascript
// created_at - Set once, never changed
// updated_at - Updated on every modification
```

## Compliance & Security

### User Data
- Stored securely in Supabase
- Protected by RLS policies
- Access logged (future)
- GDPR considerations for data deletion

### Sensitive Data
- Never store passwords (Supabase auth handles)
- Never store API keys in database
- Encrypt sensitive fields if needed

## Future Schema Extensions

### Marketplace Tables (Planned)
```
products
orders
transactions
reviews
```

### Analytics Tables (Planned)
```
user_activity
page_views
engagement_metrics
```

### Admin Tables (Planned)
```
audit_logs
system_logs
feature_flags
```
