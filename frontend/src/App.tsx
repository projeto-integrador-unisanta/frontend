import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../src/routes/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <main className="min-h-screen bg-white dark:bg-[#001b3d] transition-colors duration-300">
          <AppRoutes />
        </main>
      </BrowserRouter>
    </ThemeProvider>
  );
}
