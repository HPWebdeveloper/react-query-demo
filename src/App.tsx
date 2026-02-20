import "./App.css";
import Banner from "./components/Banner";
import CacheDemo from "./components/CacheDemo";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header role="banner">
        <Banner />
      </header>
      <main role="main">
        <article>
          <CacheDemo />
        </article>
      </main>
      <footer className="text-center text-gray-500 text-xs py-6">
        <p>
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/hpwebdeveloper/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-purple-400"
          >
            Hamed Panjeh
          </a>{" "}
          &middot; Powered by{" "}
          <a
            href="https://tanstack.com/query"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-purple-400"
          >
            TanStack Query (React Query)
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
