# LearnMentor Frontend - API Integration

This Next.js frontend is fully integrated with the LearnMentor backend API.

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd ../web-backend-learnmentor
npm run dev
```
Backend will run on `http://localhost:4000`

### 2. Start the Frontend
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── services/              # API service layer
│   ├── api.ts            # Axios configuration
│   ├── auth.service.ts   # Authentication APIs
│   ├── profile.service.ts # Profile management
│   ├── admin.service.ts  # Admin operations
│   └── index.ts          # Exports
│
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useProfile.ts     # Profile hook
│   ├── useAdmin.ts       # Admin hook
│   └── index.ts          # Exports
│
├── store/                # State management
│   └── auth-store.ts     # Zustand auth store
│
├── components/           # Reusable components
│   └── ProtectedRoute.tsx # Route protection
│
└── app/                  # Next.js pages
    ├── (auth)/          # Login, Register
    └── dashboard/       # Protected pages
```

## 🔌 Available Services

### Authentication Service
```typescript
import { authService } from '@/services';

// Login
await authService.login({ email, password });

// Register
await authService.registerUser({ email, password, name });
await authService.registerTutor({ email, password, name, speciality });
await authService.registerAdmin({ email, password });

// Logout
await authService.logout();
```

### Profile Service
```typescript
import { profileService } from '@/services';

// Get profile
const profile = await profileService.getProfile();

// Update profile (with image)
await profileService.updateProfile({
  name: 'John Doe',
  phone: '9841234567',
  profileImage: file, // File object
});

// Delete profile image
await profileService.deleteProfileImage();
```

### Admin Service
```typescript
import { adminService } from '@/services';

// Get all users (admin only)
const users = await adminService.getAllUsers();

// Get platform stats (admin only)
const stats = await adminService.getPlatformStats();
```

## 🎣 Using Hooks

### useAuth Hook
```typescript
import { useAuth } from '@/hooks';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading, error } = useAuth();

  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password' });
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### useProfile Hook
```typescript
import { useProfile } from '@/hooks';
import { useEffect } from 'react';

function ProfilePage() {
  const { profile, loading, fetchProfile, updateProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdate = async () => {
    await updateProfile({ name: 'New Name' });
  };

  return <div>{profile?.name}</div>;
}
```

### useAdmin Hook
```typescript
import { useAdmin } from '@/hooks';
import { useEffect } from 'react';

function AdminDashboard() {
  const { users, stats, fetchAllUsers, fetchPlatformStats } = useAdmin();

  useEffect(() => {
    fetchAllUsers();
    fetchPlatformStats();
  }, [fetchAllUsers, fetchPlatformStats]);

  return (
    <div>
      <p>Total Users: {stats?.totalUsers}</p>
    </div>
  );
}
```

## 🔒 Protected Routes

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register/user` - Register user
- `POST /api/auth/register/tutor` - Register tutor
- `POST /api/auth/register/admin` - Register admin
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile/image` - Delete profile image

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform stats

## 🔑 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 📝 Example: Complete Login Flow

```typescript
'use client';

import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
      if (response.user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
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
  );
}
```

## 📝 Example: Profile Update with Image

```typescript
'use client';

import { useProfile } from '@/hooks';
import { useState } from 'react';

export default function ProfilePage() {
  const { updateProfile, loading } = useProfile();
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateProfile({
      name: 'John Doe',
      phone: '9841234567',
      profileImage: file || undefined,
    });
    
    alert('Profile updated!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
```

## 🔧 Features

✅ **Automatic Token Management**: Axios interceptor handles token injection  
✅ **Token Refresh**: Automatic token refresh on 401 errors  
✅ **Type Safety**: Full TypeScript support  
✅ **Error Handling**: Centralized error handling  
✅ **Loading States**: Built-in loading states in hooks  
✅ **Role-Based Access**: Protected routes with role checking  
✅ **File Upload**: Automatic FormData handling for images  
✅ **State Sync**: Profile updates sync with auth store  

## 📚 Documentation

For detailed documentation, see:
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Complete integration guide with examples

## 🐛 Troubleshooting

### Backend not responding
- Ensure backend is running on `http://localhost:4000`
- Check MongoDB is connected

### CORS errors
- Backend must allow `http://localhost:3000` origin

### Token expired
- Axios interceptor automatically refreshes tokens
- If refresh fails, user is logged out

### Image upload fails
- Max file size: 5MB
- Allowed formats: images only

## 🎯 Next Steps

1. ✅ Backend running
2. ✅ Frontend running
3. ✅ API services created
4. ✅ Hooks created
5. ✅ Protected routes implemented
6. ✅ Login page working
7. 🔲 Test profile updates
8. 🔲 Test admin dashboard
9. 🔲 Add more features as needed

---

**Your frontend is now fully connected to the backend!** 🚀
