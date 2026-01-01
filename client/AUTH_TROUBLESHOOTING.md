# Authentication Troubleshooting Guide

## Common Issues & Solutions

### 1. Student Registration Not Working

#### Symptoms:
- Registration form submits but shows error
- "User already exists" error
- Registration succeeds but login fails

#### Solutions:

**A. Test Registration with PHP Tool**
1. Visit: `https://forestgreen-marten-883875.hostingersite.com/test-auth.php`
2. Use the "Test Registration" form
3. Try with a unique email (tool auto-generates one)
4. Check the response

**B. Common Registration Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "User already exists" | Email is already registered | Use different email OR check database to see if user exists |
| "Please provide all fields" | Missing name, email, or password | Check all required fields are filled |
| 503 Error | Server not running | Visit `/start-server.php` and start server |
| Database connection failed | Missing env vars | Check Hostinger environment variables |

---

### 2. Student Login Not Working

#### Symptoms:
- "Invalid credentials" error
- "Account pending approval" message
- Login form submits but redirects back

#### Solutions:

**A. Check if Student is Approved**

Students MUST be approved by admin before they can login!

**Steps to approve:**
1. Login as admin: `shoaib.ss300@gmail.com` / `Shaikh@#$001`
2. Go to Admin Panel: `/admin`
3. Click "Students" section
4. Find students with `is_approved = 0`
5. Click "Approve" button

**B. Test Login with PHP Tool**
1. Visit: `/test-auth.php`
2. Use "Test Login" form
3. Try admin credentials first to verify server works
4. Then try student credentials

**C. Common Login Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid credentials" | Wrong email/password | Double-check credentials |
| "Account pending approval" | Student not approved by admin | Admin must approve at `/admin/students` |
| 503 Error | Server not running | Start server at `/start-server.php` |
| No response | Frontend can't reach API | Check if `/api/debug-server` works |

---

### 3. How Authentication Works

#### Registration Flow:
```
1. Student fills form at /register
   ↓
2. POST /api/auth/register
   ↓
3. Backend creates user with is_approved = 0
   ↓
4. Success message: "Wait for admin approval"
   ↓
5. Student CANNOT login yet
```

#### Login Flow:
```
1. Student enters credentials at /login
   ↓
2. POST /api/auth/login
   ↓
3. Backend checks:
   - Email exists?
   - Password correct?
   - is_approved = 1? (for students)
   ↓
4a. If approved → JWT token → Redirect to dashboard
4b. If not approved → Error: "Account pending approval"
```

#### Admin Approval Flow:
```
1. Admin logs in at /admin
   ↓
2. Goes to Students section
   ↓
3. Sees list of pending students (is_approved = 0)
   ↓
4. Clicks "Approve" button
   ↓
5. Backend updates: is_approved = 1
   ↓
6. Student can now login
```

---

### 4. Database Check with PHP Tool

#### Check Users Table:
1. Visit `/test-auth.php`
2. Go to "Test Database Query" section
3. Run this query:
```sql
SELECT id, name, email, role, is_approved FROM users ORDER BY created_at DESC LIMIT 10
```

#### Expected Results:

**Admin user:**
```json
{
  "id": 1,
  "name": "Shoaib Shaikh",
  "email": "shoaib.ss300@gmail.com",
  "role": "admin",
  "is_approved": 1
}
```

**Pending student:**
```json
{
  "id": 2,
  "name": "Test Student",
  "email": "student@example.com",
  "role": "student",
  "is_approved": 0  ← NOT APPROVED YET
}
```

**Approved student:**
```json
{
  "id": 3,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "is_approved": 1  ← CAN LOGIN NOW
}
```

---

### 5. Manual Approval via Database

If you can't access admin panel, approve students directly in database:

#### Using test-auth.php:
**NOT POSSIBLE** - Only SELECT queries allowed for security

#### Using SSH/MySQL:
```sql
-- Connect to MySQL
mysql -u u480091743_shoaibpurna -p u480091743_lakshay

-- See pending students
SELECT id, name, email, is_approved FROM users WHERE role='student' AND is_approved=0;

-- Approve a specific student
UPDATE users SET is_approved = 1 WHERE email = 'student@example.com';

-- Approve all students (careful!)
UPDATE users SET is_approved = 1 WHERE role='student';
```

---

### 6. Testing Complete Auth Flow

#### Step 1: Initialize Database
Visit: `/api/setup-db`

Expected:
```json
{"success": true, "message": "Database Initialized Successfully!"}
```

#### Step 2: Test Admin Login
Visit: `/test-auth.php`
- Email: `shoaib.ss300@gmail.com`
- Password: `Shaikh@#$001`
- Click "Test Login"

Expected:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "_id": 1,
    "name": "Shoaib Shaikh",
    "email": "shoaib.ss300@gmail.com",
    "role": "admin"
  }
}
```

#### Step 3: Register Test Student
Visit: `/test-auth.php`
- Fill registration form
- Click "Test Registration"

Expected:
```json
{
  "success": true,
  "message": "Registration successful. Please wait for Admin approval.",
  "data": {
    "_id": 2,
    "name": "Test Student",
    "email": "test@example.com",
    "role": "student",
    "is_approved": 0
  }
}
```

#### Step 4: Try Login (Should Fail)
Visit: `/test-auth.php`
- Use student credentials
- Click "Test Login"

Expected:
```json
{
  "success": false,
  "message": "Account pending approval from Admin."
}
```

#### Step 5: Approve Student
1. Login as admin at `/admin`
2. Go to Students → Pending
3. Approve the student

#### Step 6: Try Login Again (Should Work)
Visit: `/test-auth.php`
- Use same student credentials
- Click "Test Login"

Expected:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "_id": 2,
    "name": "Test Student",
    "email": "test@example.com",
    "role": "student"
  }
}
```

---

### 7. Frontend Issues

If backend works but frontend doesn't:

#### Check API_BASE_URL

File: `client/src/config.ts` or `client/src/config.js`

Should be:
```typescript
export const API_BASE_URL = ''; // Empty for same domain
// OR
export const API_BASE_URL = 'https://forestgreen-marten-883875.hostingersite.com';
```

NOT:
```typescript
export const API_BASE_URL = 'http://localhost:3000'; // ❌ Wrong for production
```

#### Check Browser Console

1. Open `/register` page
2. Press F12 to open DevTools
3. Go to Console tab
4. Try to register
5. Look for errors

Common errors:
- `CORS error` → Backend CORS not configured
- `Network error` → Server not running
- `404 Not Found` → Wrong API endpoint
- `500 Server Error` → Check backend logs

#### Check Network Tab

1. Open DevTools → Network tab
2. Try to register/login
3. Find the `/api/auth/register` or `/api/auth/login` request
4. Click on it
5. Check:
   - Request URL (should be correct domain)
   - Request payload (data being sent)
   - Response (error message from backend)

---

### 8. Quick Fixes

#### Reset Everything:
1. Visit `/start-server.php` → Stop Server
2. Visit `/api/setup-db` → Reinitialize database
3. Visit `/start-server.php` → Start Server
4. Visit `/test-auth.php` → Test auth flow

#### Can't Access Admin Panel:
1. Visit `/api/setup-db` to create admin user
2. Login at `/admin` with:
   - Email: `shoaib.ss300@gmail.com`
   - Password: `Shaikh@#$001`

#### All Students Pending:
```sql
-- SSH into database and run:
UPDATE users SET is_approved = 1 WHERE role = 'student';
```

#### Delete Test Accounts:
```sql
-- SSH into database and run:
DELETE FROM users WHERE email LIKE 'test%@example.com';
```

---

### 9. Debugging Checklist

Before reporting an issue, check:

- [ ] Server is running (visit `/start-server.php`)
- [ ] Environment variables are set (visit `/api/debug-server`)
- [ ] Database is initialized (visit `/api/setup-db`)
- [ ] Admin can login (test at `/test-auth.php`)
- [ ] Registration creates user (check database query)
- [ ] Student is approved (check `is_approved` column)
- [ ] Frontend console has no errors (F12 → Console)
- [ ] Network requests succeed (F12 → Network)

---

### 10. Using test-auth.php

This is your main diagnostic tool!

**What it does:**
- ✅ Tests server status
- ✅ Tests registration endpoint
- ✅ Tests login endpoint
- ✅ Tests database queries
- ✅ Tests any API endpoint
- ✅ Provides quick links to all pages

**How to use:**
1. Visit: `/test-auth.php`
2. Check server status at top (should be green)
3. Test each function in the forms
4. Read error messages carefully
5. Use database query tool to inspect users table

**Pro tip:** Bookmark this page! You'll use it every time you need to debug auth issues.

---

## Summary

**Most Common Issue:**
Students register successfully but can't login → They need admin approval!

**Solution:**
1. Login as admin
2. Go to `/admin/students`
3. Approve pending students
4. Students can now login

**Testing Tool:**
Use `/test-auth.php` to test and debug all auth operations without using the frontend.
