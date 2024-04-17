import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { store } from "./store/store.js";
import { Provider } from 'react-redux'; // Import Provider
import { NextUIProvider } from "@nextui-org/react";
ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <NextUIProvider>
            <main className="dark text-foreground bg-background">
                <App />
            </main>
        </NextUIProvider>
    </Provider>
);
{/* <React.StrictMode>
</React.StrictMode> */}