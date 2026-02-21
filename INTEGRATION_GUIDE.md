# LearnMentor Frontend-Backend Integration Guide

Complete guide for connecting the Next.js frontend with the LearnMentor backend.

---

## 📁 PROJECT STRUCTURE

```
frontend/
├── services/              # API service layer
│   ├── api.ts            # Axios configuration with interceptors
│   ├── auth.service.ts   # Authentication APIs
│   ├── profile.service.ts # Profile management APIs
│   ├── admin.service.ts  # Admin APIs
│   └── index.ts          # Centralized exports
│
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useProfile.ts     # Profile management hook
│   ├── useAdmin.ts       # Admin operations hook
│   └── index.ts          # Centralized exports
│
├── store/                # State management
│   └── auth-store.ts     # Zustand auth store
│
├── app/                  # Next.js App Router
│   ├── (auth)/          # Auth pages (login, register)
│   ├── (public)/        # Public pages
│   └── dashboard/       # Protected dashboard pages
│
└── components/          # Reusable components
```

---

## ⚙️ CONFIGURATION

### Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Axios Configuration (services/api.ts)

The axios instance is pre-configured with:
- **Base URL**: From environment variable
- **Request Interceptor**: Automatically adds Bearer token from Zustand store
- **Response Interceptor**: Handles 401 errors and token refresh

---

## 🔐 AUTHENTICATION

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register user (default role) |
| `/auth/register/user` | POST | Register regular user |
| `/auth/register/tutor` | POST | Register tutor |
| `/auth/register/admin` | POST | Register admin |
| `/auth/login` | POST | Login user |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/logout` | POST | Logout user |

### Using the Auth Hook

```typescript
import { useAuth } from '@/hooks';

function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
      {error && <p className="error">{error}</p>}
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Request/Response Examples

**Login:**
```typescript
// REQUEST
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// RESPONSE
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "email": "user@example.com",
    "role": "user",
    "name": "John Doe",
    "profileImage": "https://cloudinary.com/..."
  }
}
```

**Register:**
```typescript
// REQUEST
POST /api/auth/register/tutor
{
  "email": "tutor@example.com",
  "password": "password123",
  "name": "Jane Smith",
  "phone": "9841234567",
  "speciality": "Mathematics"
}

// RESPONSE
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "65xyz789...",
    "email": "tutor@example.com",
    "role": "tutor",
    "name": "Jane Smith",
    "phone": "9841234567",
    "speciality": "Mathematics"
  }
}
```

---

## 👤 PROFILE MANAGEMENT

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/profile` | GET | Get current user's profile |
| `/profile` | PUT | Update profile (supports file upload) |
| `/profile/image` | DELETE | Delete profile image |

### Using the Profile Hook

```typescript
import { useProfile } from '@/hooks';
import { useEffect } from 'react';

function ProfilePage() {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdate = async (data: UpdateProfileRequest) => {
    try {
      await updateProfile(data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{profile?.name}</h1>
      <p>{profile?.email}</p>
      {/* Profile form */}
    </div>
  );
}
```

### Updating Profile with Image

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const updateData: UpdateProfileRequest = {
    name: formData.name,
    phone: formData.phone,
    speciality: formData.speciality,
    address: formData.address,
  };

  // Add image if selected
  if (selectedFile) {
    updateData.profileImage = selectedFile;
  }

  // Add password change if provided
  if (formData.oldPassword && formData.newPassword) {
    updateData.oldPassword = formData.oldPassword;
    updateData.newPassword = formData.newPassword;
  }

  await updateProfile(updateData);
};
```

### Request/Response Examples

**Get Profile:**
```typescript
// REQUEST
GET /api/profile
Headers: Authorization: Bearer <token>

// RESPONSE
{
  "id": "65abc123...",
  "email": "user@example.com",
  "role": "tutor",
  "name": "Jane Smith",
  "phone": "9841234567",
  "speciality": "Mathematics",
  "address": "Kathmandu, Nepal",
  "profileImage": "https://res.cloudinary.com/...",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-02-09T14:20:00Z"
}
```

**Update Profile (with image):**
```typescript
// REQUEST
PUT /api/profile
Headers: 
  Authorization: Bearer <token>
  Content-Type: multipart/form-data

FormData:
  name: "Jane Smith"
  phone: "9841234567"
  speciality: "Mathematics & Physics"
  address: "Kathmandu, Nepal"
  profileImage: [File object]

// RESPONSE
{
  "message": "Profile updated successfully",
  "profile": {
    "id": "65abc123...",
    "email": "user@example.com",
    "role": "tutor",
    "name": "Jane Smith",
    "phone": "9841234567",
    "speciality": "Mathematics & Physics",
    "address": "Kathmandu, Nepal",
    "profileImage": "https://res.cloudinary.com/new-image.jpg",
    "updatedAt": "2026-02-09T15:00:00Z"
  }
}
```

**Update Profile (text only):**
```typescript
// REQUEST
PUT /api/profile
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

{
  "name": "Jane Smith Updated",
  "phone": "9841234568"
}

// RESPONSE
{
  "message": "Profile updated successfully",
  "profile": { /* updated profile */ }
}
```

**Change Password:**
```typescript
// REQUEST
PUT /api/profile
Headers: Authorization: Bearer <token>

{
  "oldPassword": "currentPassword123",
  "newPassword": "newSecurePassword456"
}

// RESPONSE
{
  "message": "Profile updated successfully",
  "profile": { /* profile data */ }
}
```

---

## 👨‍💼 ADMIN OPERATIONS

### Available Endpoints

| Endpoint | Method | Description | Required Role |
|----------|--------|-------------|---------------|
| `/admin/users` | GET | Get all users | admin |
| `/admin/stats` | GET | Get platform statistics | admin |

### Using the Admin Hook

```typescript
import { useAdmin } from '@/hooks';
import { useEffect } from 'react';

function AdminDashboard() {
  const { users, stats, loading, error, fetchAllUsers, fetchPlatformStats } = useAdmin();

  useEffect(() => {
    fetchAllUsers();
    fetchPlatformStats();
  }, [fetchAllUsers, fetchPlatformStats]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <div className="stats">
        <p>Total Users: {stats?.totalUsers}</p>
        <p>Total Tutors: {stats?.totalTutors}</p>
        <p>Total Admins: {stats?.totalAdmins}</p>
      </div>

      <div className="users-list">
        {users.map(user => (
          <div key={user.id}>
            <p>{user.name} - {user.email} ({user.role})</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Request/Response Examples

**Get All Users:**
```typescript
// REQUEST
GET /api/admin/users
Headers: Authorization: Bearer <admin-token>

// RESPONSE
[
  {
    "id": "65user1...",
    "email": "user1@example.com",
    "role": "user",
    "name": "John Doe",
    "createdAt": "2026-01-10T08:00:00Z"
  },
  {
    "id": "65tutor1...",
    "email": "tutor1@example.com",
    "role": "tutor",
    "name": "Jane Smith",
    "speciality": "Mathematics",
    "createdAt": "2026-01-15T10:30:00Z"
  }
]
```

**Get Platform Stats:**
```typescript
// REQUEST
GET /api/admin/stats
Headers: Authorization: Bearer <admin-token>

// RESPONSE
{
  "totalUsers": 150,
  "totalAdmins": 3,
  "totalTutors": 45,
  "totalRegularUsers": 102,
  "recentUsers": [
    {
      "id": "65recent1...",
      "email": "recent@example.com",
      "role": "user",
      "name": "Recent User",
      "createdAt": "2026-02-09T10:00:00Z"
    }
  ]
}
```

---

## 🔒 PROTECTED ROUTES

### Creating a Protected Route Component

```typescript
// components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin' | 'tutor')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <p>Access denied</p>;
  }

  return <>{children}</>;
}
```

### Usage in Pages

```typescript
// app/dashboard/admin/page.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
```

---

## 🎯 COMPLETE INTEGRATION EXAMPLES

### 1. Login Flow

```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await login({ email, password });
      
      // Redirect based on role
      switch (response.user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'tutor':
          router.push('/dashboard/tutor');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

### 2. Profile Update with Image Upload

```typescript
// app/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks';
import Image from 'next/image';

export default function ProfilePage() {
  const { profile, loading, fetchProfile, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    speciality: '',
    address: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        speciality: profile.speciality || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        ...formData,
        profileImage: selectedFile || undefined,
      });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading && !profile) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <h1>Edit Profile</h1>
      
      <div className="profile-image">
        {(preview || profile?.profileImage) && (
          <Image
            src={preview || profile?.profileImage || ''}
            alt="Profile"
            width={150}
            height={150}
          />
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Phone"
        />
        <input
          type="text"
          value={formData.speciality}
          onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
          placeholder="Speciality"
        />
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Address"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
```

### 3. Admin Dashboard

```typescript
// app/dashboard/admin/page.tsx
'use client';

import { useEffect } from 'react';
import { useAdmin } from '@/hooks';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function AdminDashboardContent() {
  const { users, stats, loading, fetchAllUsers, fetchPlatformStats } = useAdmin();

  useEffect(() => {
    fetchAllUsers();
    fetchPlatformStats();
  }, [fetchAllUsers, fetchPlatformStats]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Tutors</h3>
          <p>{stats?.totalTutors || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Regular Users</h3>
          <p>{stats?.totalRegularUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Admins</h3>
          <p>{stats?.totalAdmins || 0}</p>
        </div>
      </div>

      <div className="users-table">
        <h2>All Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Speciality</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.speciality || 'N/A'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
```

---

## 🚀 QUICK START CHECKLIST

- [x] Backend running on http://localhost:4000
- [x] MongoDB connected
- [x] Frontend created with Next.js
- [x] Environment variables configured (.env.local)
- [x] Axios instance configured (services/api.ts)
- [x] Auth service created (services/auth.service.ts)
- [x] Profile service created (services/profile.service.ts)
- [x] Admin service created (services/admin.service.ts)
- [x] Custom hooks created (hooks/)
- [x] Auth store configured (store/auth-store.ts)
- [ ] Protected routes implemented
- [ ] Login/Register pages created
- [ ] Profile page created
- [ ] Admin dashboard created

---

## 💡 BEST PRACTICES

1. **Always use hooks**: Use `useAuth`, `useProfile`, `useAdmin` instead of calling services directly
2. **Handle errors**: Always wrap API calls in try-catch blocks
3. **Show loading states**: Use the `loading` state from hooks to show spinners
4. **Token management**: The axios interceptor handles token automatically
5. **Type safety**: Use TypeScript interfaces for all API requests/responses
6. **Protected routes**: Always wrap protected pages with `ProtectedRoute` component
7. **Role-based access**: Use `allowedRoles` prop to restrict access by role
8. **Image uploads**: Use FormData for file uploads, the service handles it automatically
9. **Error messages**: Display user-friendly error messages from the API
10. **State synchronization**: Profile updates automatically sync with auth store

---

## 🐛 TROUBLESHOOTING

### Issue: 401 Unauthorized
- **Cause**: Token expired or invalid
- **Solution**: The axios interceptor will automatically try to refresh the token. If refresh fails, user will be logged out.

### Issue: CORS Error
- **Cause**: Backend not configured for frontend origin
- **Solution**: Ensure backend has CORS enabled for `http://localhost:3000`

### Issue: Image upload fails
- **Cause**: File too large or wrong format
- **Solution**: Check backend limits (max 5MB, images only)

### Issue: Profile not updating in UI
- **Cause**: Auth store not synchronized
- **Solution**: The `updateProfile` hook automatically syncs with auth store. Ensure you're using the hook.

---

## 📚 API REFERENCE SUMMARY

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/register/user` - Register regular user
- `POST /auth/register/tutor` - Register tutor
- `POST /auth/register/admin` - Register admin
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

### Profile
- `GET /profile` - Get profile
- `PUT /profile` - Update profile (supports multipart/form-data)
- `DELETE /profile/image` - Delete profile image

### Admin
- `GET /admin/users` - Get all users (admin only)
- `GET /admin/stats` - Get platform stats (admin only)

---

Your frontend is now fully integrated with the LearnMentor backend! 🎉
