import Header from "./_components/Header";


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* We use a Fragment <> instead of <html>/<body> */}
      <Header /> 
      <main>
        {children}
      </main>
    </>
  );
}