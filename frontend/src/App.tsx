import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../src/routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <main className="flex w-full min-h-screen bg-gray-100">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}
