import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

/* ===== PUBLIC PAGES ===== */
import Home from "./pages/public/Home";
import Movies from "./pages/public/Movies";
import MovieDetail from "./pages/public/MovieDetail";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Cinema from "./pages/public/Cinema";
import MovieBlockbuster from "./pages/public/MovieBlockbusters";

/* ===== USER PAGES ===== */
import Booking from "./pages/user/Booking";
import Account from "./pages/user/Account";

/* ===== ADMIN ===== */
import AdminLayout from "./layouts/AdminLayout";
import ManageMovies from "./pages/admin/ManageMovies";
import ManageRooms from "./pages/admin/ManageRooms";
import ManageSchedule from "./pages/admin/ManageSchedule";
import ManageTickets from "./pages/admin/ManageTickets";
import ManageRevenue from "./pages/admin/ManageRevenue";
import ManageCustomers from "./pages/admin/ManageCustomers";
import ManageCinema from "./pages/admin/ManageCinema";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cinema" element={<Cinema />} />
          <Route path="/blockbusters" element={<MovieBlockbuster />} />
          <Route
  path="/booking"
  element={
    <ProtectedRoute roles={["user"]}>
      <Booking />
    </ProtectedRoute>
  }
/>

<Route
  path="/booking/:id"
  element={
    <ProtectedRoute roles={["user"]}>
      <Booking />
    </ProtectedRoute>
  }
/>

          <Route
            path="/account"
            element={
              <ProtectedRoute roles={["user"]}>
                <Account />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="movies" element={<ManageMovies />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="schedule" element={<ManageSchedule />} />
            <Route path="tickets" element={<ManageTickets />} />
            <Route path="revenue" element={<ManageRevenue />} />
            <Route path="customers" element={<ManageCustomers />} />
            <Route path="cinema" element={<ManageCinema />} />
          </Route>

          
          {/* ================= 404 ================= */}
          <Route
            path="*"
            element={
              <div style={{ padding: "50px", textAlign: "center" }}>
                <h2>404 - Không tìm thấy trang</h2>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;