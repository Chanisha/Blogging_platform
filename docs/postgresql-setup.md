# PostgreSQL Database Setup

This blogging application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations.

## Prerequisites

1. **Install PostgreSQL** on your system:

   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib` (Ubuntu/Debian)

2. **Start PostgreSQL service**:
   - **Windows**: Start PostgreSQL service from Services or use pgAdmin
   - **macOS**: `brew services start postgresql`
   - **Linux**: `sudo systemctl start postgresql`

## Database Setup

### 1. Create Database

Connect to PostgreSQL and create a database for your blog:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE blog_platform;

-- Create a user (optional, you can use postgres user)
CREATE USER blog_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE blog_platform TO blog_user;
```

### 2. Environment Configuration

Copy the environment example file and configure your database connection:

```bash
cp env.example .env
```

Update the `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/blog_platform"
```

**Connection String Format:**

```
postgresql://[username]:[password]@[host]:[port]/[database]
```

### 3. Run Database Migrations

Generate and apply database migrations:

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Or push schema directly (for development)
npm run db:push
```

### 4. Test Database Connection

Test your PostgreSQL connection:

```bash
npm run db:test
```

This will verify:

- Database connectivity
- PostgreSQL version
- Current database name
- Connection timestamp

## Database Schema

The application includes the following tables:

- **users**: User accounts and profiles
- **posts**: Blog posts with content, metadata, and relationships
- **comments**: Post comments with author relationships

## Database Management

### Drizzle Studio

Launch Drizzle Studio for visual database management:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:4983` where you can:

- View and edit data
- Run SQL queries
- Manage database schema

### Common Database Operations

```bash
# Generate new migration after schema changes
npm run db:generate

# Apply pending migrations
npm run db:migrate

# Push schema changes directly (development only)
npm run db:push

# Test database connection
npm run db:test
```

## Production Considerations

### Connection Pooling

The application is configured with connection pooling:

- Maximum 10 connections
- 20-second idle timeout
- 10-second connection timeout
- SSL enabled in production

### Environment Variables

For production, ensure these environment variables are set:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
NODE_ENV="production"
```

### SSL Configuration

SSL is automatically enabled in production mode. For custom SSL configuration, modify the connection options in `src/lib/db/index.ts`.

## Troubleshooting

### Connection Issues

1. **Check PostgreSQL service**: Ensure PostgreSQL is running
2. **Verify credentials**: Check username, password, and database name
3. **Check port**: Default PostgreSQL port is 5432
4. **Firewall**: Ensure port 5432 is not blocked

### Common Errors

- **"relation does not exist"**: Run migrations with `npm run db:migrate`
- **"password authentication failed"**: Check username/password in DATABASE_URL
- **"could not connect to server"**: Verify PostgreSQL is running and accessible

### Debug Connection

Use the test script to debug connection issues:

```bash
npm run db:test
```

This will show detailed error messages and connection information.
