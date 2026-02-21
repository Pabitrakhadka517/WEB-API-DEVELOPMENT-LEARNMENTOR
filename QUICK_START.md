# 🚀 Quick Start Guide - LearnMentor Integration

## ✅ Current Status

**Both servers are running!**
- ✅ Backend: http://localhost:4000
- ✅ Frontend: http://localhost:3000

## 🧪 Test Your Integration

### Option 1: Use the API Test Page
Visit: **http://localhost:3000/api-test**

This page will automatically test:
- Backend connection
- Login functionality
- Profile fetching
- Admin operations

### Option 2: Manual Testing

#### 1. Test Login
Visit: **http://localhost:3000/login**

Use these credentials:
```
Email: admin@learnmentor.com
Password: Admin@123
```

#### 2. Test Profile Update
After login, visit: **http://localhost:3000/dashboard/profile**

#### 3. Test Admin Dashboard
Visit: **http://localhost:3000/dashboard/admin**

## 📝 Using the Integration in Your Code

### Example 1: Login Component
```typescript
import { useAuth } from '@/hooks';

function MyLoginComponent() {
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login({ 
      email: 'admin@learnmentor.com', 
      password: 'Admin@123' 
    });
  };

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

### Example 2: Profile Update
```typescript
import { useProfile } from '@/hooks';

function MyProfileComponent() {
  const { updateProfile, loading } = useProfile();

  const handleUpdate = async (file: File) => {
    await updateProfile({
      name: 'John Doe',
      phone: '9841234567',
      profileImage: file
    });
  };

  return <div>Profile Component</div>;
}
```

### Example 3: Admin Dashboard
```typescript
import { useAdmin } from '@/hooks';
import { useEffect } from 'react';

function MyAdminComponent() {
  const { users, stats, fetchAllUsers, fetchPlatformStats } = useAdmin();

  useEffect(() => {
    fetchAllUsers();
    fetchPlatformStats();
  }, []);

  return (
    <div>
      <p>Total Users: {stats?.totalUsers}</p>
    </div>
  );
}
```

## 🎯 Next Steps

### 1. Explore Example Components
Check out the working examples in:
- `components/examples/AdminDashboardExample.tsx`
- `components/examples/ProfileUpdateExample.tsx`

### 2. Integrate into Your Pages

**Update Profile Page:**
```typescript
// app/dashboard/profile/page.tsx
import ProfileUpdateExample from '@/components/examples/ProfileUpdateExample';

export default function ProfilePage() {
  return <ProfileUpdateExample />;
}
```

**Update Admin Page:**
```typescript
// app/dashboard/admin/page.tsx
import AdminDashboardExample from '@/components/examples/AdminDashboardExample';

export default function AdminPage() {
  return <AdminDashboardExample />;
}
```

### 3. Add More Features

Follow the same pattern:
1. Create service in `services/`
2. Create hook in `hooks/`
3. Use hook in components

## 📚 Documentation

- **INTEGRATION_GUIDE.md** - Complete guide with all examples
- **README_API_INTEGRATION.md** - Quick reference
- **INTEGRATION_COMPLETE.md** - Summary and troubleshooting

## 🔧 Available Services

### Auth Service
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

// Update profile
await profileService.updateProfile({
  name: 'John Doe',
  phone: '9841234567',
  profileImage: file
});

// Delete profile image
await profileService.deleteProfileImage();
```

### Admin Service
```typescript
import { adminService } from '@/services';

// Get all users
const users = await adminService.getAllUsers();

// Get platform stats
const stats = await adminService.getPlatformStats();
```

## 🎣 Available Hooks

### useAuth
```typescript
const { 
  user,              // Current user
  isAuthenticated,   // Boolean
  loading,           // Loading state
  error,             // Error message
  login,             // Login function
  register,          // Register function
  logout             // Logout function
} = useAuth();
```

### useProfile
```typescript
const { 
  profile,           // User profile
  loading,           // Loading state
  error,             // Error message
  fetchProfile,      // Fetch profile
  updateProfile,     // Update profile
  deleteProfileImage // Delete image
} = useProfile();
```

### useAdmin
```typescript
const { 
  users,             // All users
  stats,             // Platform stats
  loading,           // Loading state
  error,             // Error message
  fetchAllUsers,     // Fetch all users
  fetchPlatformStats // Fetch stats
} = useAdmin();
```

## 🔒 Protecting Routes

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <MyComponent />
    </ProtectedRoute>
  );
}
```

## 🐛 Troubleshooting

### Backend not responding
```bash
# Check if backend is running
# Should see: Server running at http://localhost:4000
```

### Frontend errors
```bash
# Check browser console for errors
# Check Network tab in DevTools
```

### CORS errors
Make sure backend allows `http://localhost:3000` origin

### Token expired
The system automatically refreshes tokens. If you see login page, your session expired.

## 💡 Pro Tips

1. **Always use hooks** instead of calling services directly
2. **Check the API test page** first: http://localhost:3000/api-test
3. **Use TypeScript** for type safety
4. **Check browser DevTools** Network tab for debugging
5. **Read the full guide** in INTEGRATION_GUIDE.md

## 🎉 You're Ready!

Your frontend is fully integrated with the backend. Start building your features!

**Test URLs:**
- API Test: http://localhost:3000/api-test
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard
- Profile: http://localhost:3000/dashboard/profile
- Admin: http://localhost:3000/dashboard/admin

---

**Happy Coding! 🚀**
