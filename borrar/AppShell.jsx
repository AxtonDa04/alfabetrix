export default function AppShell({ children }) {
  return (
    <main className="app-device-shell" aria-label="ALFABETRIX">
      <div className="app-device-scroll">
        <div className="app-device-safe">{children}</div>
      </div>
    </main>
  );
}
