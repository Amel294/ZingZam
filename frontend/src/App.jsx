import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router/AppRoutes';
import UnsafeTest from './router/UnsafeTest';

function App() {
  return (
    <BrowserRouter>
    <UnsafeTest/>
      {/* <AppRoutes /> */}
    </BrowserRouter>
  );
}

export default App;
