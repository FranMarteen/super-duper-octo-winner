export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to Fit Coach AI</h1>
      <p>Your personal AI fitness and nutrition coach.</p>
      <a href="/auth/register">Register</a>
      <a href="/auth/login">Login</a>
    </main>
  )
}
