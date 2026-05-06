import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const menuButtonStyle = {
    display: "block",
    backgroundColor: "#ff0000",
    color: "white",
    padding: "12px",
    margin: "15px auto",
    width: "80%",
    textAlign: "center",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  };

  // ❌ chưa login → không hiện sidebar admin
  if (!user) return null;

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        backgroundColor: "#0b0f19",
        paddingTop: "20px",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2 style={{ color: "red", textAlign: "center" }}>
        🎬 RẠP PHIM
      </h2>

      {/* 🔥 ADMIN */}
      {user.role === "admin" && (
        <>
          <Link to="/admin/movies" style={menuButtonStyle}>Phim</Link>
          <Link to="/admin/cinema" style={menuButtonStyle}>Rạp</Link>
          <Link to="/admin/rooms" style={menuButtonStyle}>Phòng chiếu</Link>
          <Link to="/admin/schedule" style={menuButtonStyle}>Lịch chiếu</Link>
          <Link to="/admin/tickets" style={menuButtonStyle}>Quản lý vé</Link>
          <Link to="/admin/revenue" style={menuButtonStyle}>Doanh thu</Link>
          <Link to="/admin/customers" style={menuButtonStyle}>Khách hàng</Link>

          <button onClick={handleLogout} style={menuButtonStyle}>
            Đăng xuất
          </button>
        </>
      )}

      {/* 🔥 CUSTOMER */}
      {user.role === "customer" && (
        <>
          <Link to="/" style={menuButtonStyle}>Trang chủ</Link>
          <Link to="/movies" style={menuButtonStyle}>Phim</Link>
          <Link to="/blockbusters" style={menuButtonStyle}>Phim bom tấn</Link>
          <Link to="/cinema" style={menuButtonStyle}>Rạp</Link>
          <Link to="/profile" style={menuButtonStyle}>Cá nhân</Link>

          <button onClick={handleLogout} style={menuButtonStyle}>
            Đăng xuất
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;