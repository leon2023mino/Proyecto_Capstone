import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#eaf7ee]" >
      <Header / >
      <main className="app">
        <Outlet />
      </main>
    </div>
  );
}