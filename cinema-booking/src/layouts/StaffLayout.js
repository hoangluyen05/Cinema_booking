import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StaffLayout() {
  const navigate = useNavigate(); // Hook để điều hướng
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }; // khi người dùng đăn xuất xóa user khỏi context và chuyển về trang /login

  const isActive = (path) => location.pathname.includes(path); // Kiểm tra đường dẫn hiện tại có khớp với path không

  return (
    <div style={{ display: "flex" }}>
      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        <h2 style={titleStyle}>🎬 NHÂN VIÊN</h2>

        <button
          style={isActive("scan") ? activeBtn : menuBtn}
          onClick={() => navigate("/staff/scan")}
        >
          Soát vé
        </button>

        <button
          style={isActive("schedule") ? activeBtn : menuBtn}
          onClick={() => navigate("/staff/schedule")}
        >
          Lịch chiếu
        </button>

        <button
          style={isActive("profile") ? activeBtn : menuBtn}
          onClick={() => navigate("/staff/profile")}
        >
          Tài khoản
        </button>

        <button style={menuBtn} onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      {/* CONTENT */}
      <div style={contentStyle}>
        <Outlet />
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const sidebarStyle = { // Phần sidebar
  width: "240px",
  height: "100vh",
  background: "#0b0f19",
  paddingTop: "20px",
  position: "fixed", // Cố định sidebar ở bên trái
  left: 0,
  top: 0,
  boxShadow: "2px 0 20px rgba(255,0,0,0.2)" // Tạo hiệu ứng đổ bóng cho sidebar
};

const contentStyle = { // Phần nội dung chính
  marginLeft: "240px", 
  padding: "40px",
  width: "100%",
  background: "#000",
  minHeight: "100vh"
};

const titleStyle = { // Phần tiêu đề trong sidebar
  color: "red",
  textAlign: "center",
  marginBottom: "30px"
};

const menuBtn = { // Nút menu trong sidebar
  display: "block", // Hiển thị dưới dạng khối mỗi nút một dòng
  background: "#e50914",
  color: "white",
  padding: "12px",
  margin: "15px auto",
  width: "80%",
  borderRadius: "20px",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s"
};

const activeBtn = { // Nút đang hoạt động trong sidebar
  ...menuBtn,
  background: "#ff1f1f",
  boxShadow: "0 0 15px red"
};

export default StaffLayout;