import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set up custom global styles for the Bingo app
document.documentElement.style.setProperty('--primary', '#1a365d');
document.documentElement.style.setProperty('--primary-foreground', '#ffffff');
document.documentElement.style.setProperty('--gold', '#f6ad55');
document.documentElement.style.setProperty('--gold-light', '#fbd38d');

createRoot(document.getElementById("root")!).render(<App />);
