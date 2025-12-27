"use client";

import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Search,
  Bell,
  User // Imported User icon
} from "lucide-react";
import Header from "../(public)/_components/Header";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* SIDEBAR - Changed background to bg-blue-600 */}
        <aside className="w-64 bg-blue-600 hidden lg:flex flex-col p-6 sticky top-16 h-[calc(100vh-64px)]">
          <nav className="space-y-1 flex-1">
            <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active />
            <NavItem icon={<Calendar size={20}/>} label="Schedule" />
            <NavItem icon={<MessageSquare size={20}/>} label="Messages" />
            <NavItem icon={<Search size={20}/>} label="Find Tutors" />
          </nav>

          <div className="pt-6 border-t border-blue-500/50">
            <NavItem icon={<Settings size={20}/>} label="Settings" />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Welcome back, Alex!</h1>
              <p className="text-slate-500 text-sm font-medium">You have 2 sessions scheduled for today.</p>
            </div>

            <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <Search size={18} className="text-slate-400 mr-2" />
                  <input type="text" placeholder="Search tutors..." className="bg-transparent outline-none text-sm w-48 text-slate-900" />
               </div>
               
               {/* Notification Button */}
               <button className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                 <Bell size={20} className="text-slate-500" />
               </button>

               {/* 2. ADDED USER PROFILE ICON */}
               <button className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                 <User size={20} className="text-slate-500" />
               </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard title="Hours Learned" value="24.5" color="text-blue-600" />
            <StatCard title="Upcoming Sessions" value="02" color="text-emerald-600" />
            <StatCard title="Saved Tutors" value="12" color="text-purple-600" />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-slate-900">Recent Activity</h2>
              <div className="space-y-2">
                <ActivityItem tutor="Dr. Sarah Smith" subject="Advanced React" time="2 hours ago" />
                <ActivityItem tutor="James Wilson" subject="Calculus III" time="Yesterday" />
                <ActivityItem tutor="Elena Rossi" subject="Italian Language" time="3 days ago" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-slate-900">Recommended for You</h2>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                      <div>
                        <p className="font-bold text-sm text-slate-900">Prof. Marcus</p>
                        <p className="text-xs text-slate-500 font-medium">Physics Expert</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View Profile</button>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
    
// NavItem Component - Updated for Blue Sidebar
function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors 
      ${active 
        ? 'bg-white/20 text-white' 
        : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// StatCard Component
function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <p className="text-slate-500 text-sm font-medium mb-2">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ActivityItem Component
function ActivityItem({ tutor, subject, time }: { tutor: string; subject: string; time: string }) {
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
      <p className="font-semibold text-sm text-slate-900">{tutor}</p>
      <p className="text-xs text-slate-500">{subject}</p>
      <p className="text-xs text-slate-400 mt-1">{time}</p>
    </div>
  );
}