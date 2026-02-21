# 🎉 Frontend-Backend Integration Complete!

Your Next.js frontend is now fully integrated with the LearnMentor backend.

## ✅ What's Been Created

### 1. **API Services Layer** (`services/`)
- ✅ `api.ts` - Axios configuration with automatic token management
- ✅ `auth.service.ts` - Authentication endpoints (login, register, logout)
- ✅ `profile.service.ts` - Profile management (get, update, delete image)
- ✅ `admin.service.ts` - Admin operations (users, stats)
- ✅ `index.ts` - Centralized exports

### 2. **Custom React Hooks** (`hooks/`)
- ✅ `useAuth.ts` - Authentication hook with loading/error states
- ✅ `useProfile.ts` - Profile management hook
- ✅ `useAdmin.ts` - Admin operations hook
- ✅ `index.ts` - Centralized exports

### 3. **Components**
- ✅ `ProtectedRoute.tsx` - Route protection with role-based access
- ✅ `examples/AdminDashboardExample.tsx` - Complete admin dashboard example
- ✅ `examples/ProfileUpdateExample.tsx` - Complete profile update example

### 4. **Documentation**
- ✅ `INTEGRATION_GUIDE.md` - Comprehensive integration guide (20+ pages)
- ✅ `README_API_INTEGRATION.md` - Quick reference guide

## 🚀 Quick Start

### Start Backend
```bash
cd ../web-backend-learnmentor
npm run dev
```

### Start Frontend
```bash
npm run dev
```

## 📝 Usage Examples

### 1. Login (Already Working)
Your existing login page at `app/(auth)/login/page.tsx` is already integrated!

### 2. Use Profile Hook
```typescript
import { useProfile } from '@/hooks';

function MyComponent() {
  const { profile, updateProfile, loading } = useProfile();
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  return <div>{profile?.name}</div>;
}
```

### 3. Use Admin Hook
```typescript
import { useAdmin } from '@/hooks';

function AdminPanel() {
  const { users, stats, fetchAllUsers } = useAdmin();
  
  useEffect(() => {
    fetchAllUsers();
  }, []);
  
  return <div>Total Users: {stats?.totalUsers}</div>;
}
```

### 4. Protect Routes
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

## 🔌 Available API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register/user` - Register student
- `POST /api/auth/register/tutor` - Register tutor
- `POST /api/auth/register/admin` - Register admin
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile (supports image upload)
- `DELETE /api/profile/image` - Delete profile image

### Admin (Admin Only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics

## 🎯 Key Features

✅ **Automatic Token Management**
- Axios interceptor automatically adds Bearer token to all requests
- No need to manually add Authorization header

✅ **Token Refresh**
- Automatically refreshes expired tokens
- Seamless user experience

✅ **Type Safety**
- Full TypeScript support
- Type-safe API calls and responses

✅ **Error Handling**
- Centralized error handling in hooks
- User-friendly error messages

✅ **Loading States**
- Built-in loading states in all hooks
- Easy to show spinners/loaders

✅ **Role-Based Access**
- Protected routes with role checking
- Automatic redirects for unauthorized access

✅ **File Upload Support**
- Automatic FormData handling for images
- Validates file size and type

✅ **State Synchronization**
- Profile updates automatically sync with auth store
- Consistent state across the app

## 📂 File Structure

```
frontend/
├── services/
│   ├── api.ts                    # ✅ Axios config
│   ├── auth.service.ts           # ✅ Auth APIs
│   ├── profile.service.ts        # ✅ Profile APIs
│   ├── admin.service.ts          # ✅ Admin APIs
│   └── index.ts                  # ✅ Exports
│
├── hooks/
│   ├── useAuth.ts                # ✅ Auth hook
│   ├── useProfile.ts             # ✅ Profile hook
│   ├── useAdmin.ts               # ✅ Admin hook
│   └── index.ts                  # ✅ Exports
│
├── components/
│   ├── ProtectedRoute.tsx        # ✅ Route protection
│   └── examples/
│       ├── AdminDashboardExample.tsx  # ✅ Admin example
│       └── ProfileUpdateExample.tsx   # ✅ Profile example
│
├── store/
│   └── auth-store.ts             # ✅ Zustand store (existing)
│
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx        # ✅ Login (existing)
│   └── dashboard/
│       ├── page.tsx              # ✅ Dashboard (existing)
│       ├── profile/page.tsx      # ✅ Profile (existing)
│       └── admin/page.tsx        # ✅ Admin (existing)
│
├── INTEGRATION_GUIDE.md          # ✅ Full guide
└── README_API_INTEGRATION.md     # ✅ Quick reference
```

## 🔧 Next Steps

### 1. Test the Integration

**Test Login:**
```bash
# Use existing login page at http://localhost:3000/login
# Default admin credentials (if seeded):
Email: admin@learnmentor.com
Password: Admin@123
```

**Test Profile Update:**
```typescript
// Use the ProfileUpdateExample component
// Or integrate into your existing profile page
import ProfileUpdateExample from '@/components/examples/ProfileUpdateExample';
```

**Test Admin Dashboard:**
```typescript
// Use the AdminDashboardExample component
// Or integrate into your existing admin page
import AdminDashboardExample from '@/components/examples/AdminDashboardExample';
```

### 2. Integrate Examples into Your Pages

**Update `app/dashboard/profile/page.tsx`:**
```typescript
import ProfileUpdateExample from '@/components/examples/ProfileUpdateExample';

export default function ProfilePage() {
  return <ProfileUpdateExample />;
}
```

**Update `app/dashboard/admin/page.tsx`:**
```typescript
import AdminDashboardExample from '@/components/examples/AdminDashboardExample';

export default function AdminPage() {
  return <AdminDashboardExample />;
}
```

### 3. Add More Features

You can now easily add more features:
- Teacher search and filtering
- Booking system
- Payment integration
- Real-time chat
- Reviews and ratings

Just follow the same pattern:
1. Create service in `services/`
2. Create hook in `hooks/`
3. Use hook in components

## 🐛 Troubleshooting

### Backend not responding
```bash
# Check backend is running
cd ../web-backend-learnmentor
npm run dev
# Should see: Server running on port 4000
```

### CORS errors
Make sure your backend allows `http://localhost:3000` origin.

### Token expired
The axios interceptor automatically handles token refresh. If you see login page, your session expired.

### Image upload fails
- Max file size: 5MB
- Allowed formats: JPG, PNG, GIF
- Check Cloudinary configuration in backend

## 📚 Documentation

- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Complete integration guide with detailed examples
- **[README_API_INTEGRATION.md](./README_API_INTEGRATION.md)** - Quick reference and examples

## 💡 Tips

1. **Always use hooks** instead of calling services directly
2. **Handle errors** with try-catch blocks
3. **Show loading states** using the `loading` state from hooks
4. **Protect routes** with `ProtectedRoute` component
5. **Use TypeScript** for type safety
6. **Check network tab** in browser DevTools for debugging

## 🎓 Example Workflows

### User Registration Flow
1. User fills registration form
2. Call `register()` from `useAuth` hook
3. User is automatically logged in
4. Redirect to dashboard based on role

### Profile Update Flow
1. User navigates to profile page
2. `fetchProfile()` loads current data
3. User edits fields and selects image
4. Call `updateProfile()` with new data
5. Profile updates in backend and auth store
6. UI reflects changes immediately

### Admin Dashboard Flow
1. Admin logs in
2. Protected route checks role
3. `fetchAllUsers()` and `fetchPlatformStats()` load data
4. Display statistics and user table
5. Real-time updates possible with polling or WebSockets

---

## 🎉 You're All Set!

Your frontend is now fully integrated with the backend. You can:

✅ Login/Register users  
✅ Update profiles with images  
✅ View admin dashboard  
✅ Protect routes by role  
✅ Handle errors gracefully  
✅ Show loading states  
✅ Manage authentication state  

**Happy coding! 🚀**

---

## 📞 Need Help?

Check the documentation:
- `INTEGRATION_GUIDE.md` - Detailed examples
- `README_API_INTEGRATION.md` - Quick reference
- `components/examples/` - Working examples

Or review the backend API:
- Check `web-backend-learnmentor/src/modules/` for available endpoints
- Test endpoints with the Postman collection in backend folder
