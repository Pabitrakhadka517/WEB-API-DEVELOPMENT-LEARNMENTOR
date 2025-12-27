export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen w-full bg-slate-950 text-slate-100">
            {/* We removed the 'items-center', 'justify-center' and the 
                inner 'max-w-md' div that was creating the box.
            */}
            {children}
        </main>
    );
}