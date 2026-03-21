import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar } from "./app/components/Navbar";
import { Home } from "./app/pages/Home";
import { CreateListing } from "./app/pages/CreateListing";
import { Browse } from "./app/pages/Browse";
import { Dashboard } from "./app/pages/Dashboard";
import { ListingDetails } from "./app/pages/ListingDetails";
import { Profile } from "./app/pages/Profile";
import { Login } from "./app/pages/Login";
import { Signup } from "./app/pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="p-4">
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/create" element={<CreateListing />} />
  <Route path="/listings" element={<Browse />} />
  <Route path="/listings/:id" element={<ListingDetails />} />   {/* FIX */}
  <Route path="/requests" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/login" element={<Login />} />                   {/* FIX */}
  <Route path="/signup" element={<Signup />} />                 {/* FIX */}
</Routes>
      </div>
    </BrowserRouter>
  );
}