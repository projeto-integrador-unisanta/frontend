import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../src/routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <main className="">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}
