import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function PublicLayout({ children }) {
  const { user, logout } = useAuth(); // lấy thông tin người dùng và hàm đăng xuất
  const location = useLocation(); // lấy thông tin về vị trí hiện tại (đường dẫn) của người dùng

  const isActive = (path) => location.pathname === path; // kiểm tra đường dẫn hiện tại có khớp với path không

  // Hover state cho footer link
  const [hovered, setHovered] = useState(null); // lưu trữ trạng thái hover của các link trong footer

  return (
    <div style={styles.wrapper}> {/* Wrapper cho toàn bộ layout */}
      {/* ===== NAVBAR ===== */}
      <nav style={styles.navbar}> {/* Thanh điều hướng trên cùng */}
        <div style={styles.logo}>CINEMA BOOKING</div>

        <div style={styles.menu}>
          <Link
            to="/"
            style={{
              ...styles.link,
              ...(isActive("/") && styles.activeLink),
            }}
          >
            Trang chủ
          </Link>

          <Link
            to="/movies"
            style={{
              ...styles.link,
              ...(isActive("/movies") && styles.activeLink),
            }}
          >
            Phim
          </Link>

          <Link
            to="/cinema"
            style={{
              ...styles.link,
              ...(isActive("/cinema") && styles.activeLink),
            }}
          >
            Rạp
          </Link>

          {user?.role === "user" && (
            <>
              <Link
                to="/booking/1"
                style={{
                  ...styles.link,
                  ...(location.pathname.includes("/booking") &&
                    styles.activeLink),
                }}
              >
                Đặt vé
              </Link>

              <Link
                to="/account"
                style={{
                  ...styles.link,
                  ...(isActive("/account") && styles.activeLink),
                }}
              >
                Tài khoản
              </Link>
            </>
          )}
        </div>

        <div style={styles.authSection}>
          {user ? (
            <button onClick={logout} style={styles.logoutBtn}>
              Đăng xuất
            </button>
          ) : (
            <Link to="/login" style={styles.loginBtn}>
              Đăng nhập
            </Link>
          )}
        </div>
      </nav>

      {/* ===== CONTENT ===== */}
      <main style={styles.main}>
        <div style={styles.content}>{children}</div> {/* Nội dung con sẽ được render vào đây */}
      </main> {/* Nội dung chính */}

      {/* ===== FOOTER ===== */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerCol}>
            <h3 style={styles.footerLogo}>🎬 CINEMA BOOKING</h3>
            <p style={styles.footerText}>
              Hệ thống đặt vé xem phim trực tuyến nhanh chóng,
              tiện lợi và hiện đại.
            </p>
          </div>

          <div style={styles.footerCol}>
            <h4 style={styles.footerTitle}>Danh mục</h4>

            {["Phim đang chiếu", "Phim sắp chiếu", "Rạp chiếu"].map(
              (item, index) => (
                <p
                  key={index}
                  style={{
                    ...styles.footerLink,
                    color: hovered === index ? "#e50914" : "#aaa",
                  }}
                  onMouseEnter={() => setHovered(index)} // Khi hover vào link
                  onMouseLeave={() => setHovered(null)} // Khi rời khỏi link
                >
                  {item}
                </p>
              )
            )}
          </div>

          <div style={styles.footerCol}>
            <h4 style={styles.footerTitle}>Hỗ trợ</h4>

            {["Chính sách bảo mật", "Điều khoản", "Liên hệ"].map(
              (item, index) => (
                <p
                  key={index + 10}
                  style={{
                    ...styles.footerLink,
                    color: hovered === index + 10 ? "#e50914" : "#aaa",
                  }}
                  onMouseEnter={() => setHovered(index + 10)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {item}
                </p>
              )
            )}
          </div>

          <div style={styles.footerCol}>
            <h4 style={styles.footerTitle}>Liên hệ</h4>
            <p style={styles.footerText}>Email: support@cinema.vn</p>
            <p style={styles.footerText}>Hotline: 1900 1234</p>

            <div style={styles.social}>
              <span style={styles.socialIcon}>🌐</span>
              <span style={styles.socialIcon}>📘</span>
              <span style={styles.socialIcon}>📸</span>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          © 2026 CINEMA BOOKING. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

const styles = {
  wrapper: { // Wrapper cho toàn bộ layout
    display: "flex",
    flexDirection: "column", // sắp xếp theo chiều dọc
    minHeight: "100vh",
    backgroundColor: "#0b0f19",
  },

  /* ===== NAVBAR ===== */
  navbar: { // Thanh điều hướng trên cùng
    position: "fixed", // Cố định thanh điều hướng ở trên cùng
    top: 0,
    left: 0,
    width: "100%",
    height: "60px",
    backgroundColor: "#0f172a",
    display: "flex", // Căn giữa các phần tử trong navbar
    justifyContent: "space-between", // Căn giữa các phần tử trong navbar
    alignItems: "center", // Căn giữa theo chiều dọc
    padding: "0 60px 0 40px",
    zIndex: 1000, // Đưa thanh điều hướng lên trên cùng
    boxShadow: "0 2px 10px rgba(0,0,0,0.4)", // Tạo hiệu ứng đổ bóng cho thanh điều hướng
  },

  logo: { // Logo trong navbar
    color: "#e50914",
    fontSize: "18px",
    fontWeight: "bold",
  },

  menu: { // Menu trong navbar
    display: "flex", // sắp xếp ngang
    gap: "20px",
    alignItems: "center", // Căn giữa theo chiều dọc
  },

  link: { // Link trong navbar
    color: "white",
    textDecoration: "none", // Bỏ gạch chân cho link
    fontSize: "14px",
    padding: "6px 8px",
    borderRadius: "6px",
  },

  activeLink: { // Link đang hoạt động trong navbar
    backgroundColor: "#e50914",
  },

  authSection: { // tạo khoảng cách giữa nút login/logout và mép phải
    marginRight: "60px",
  },

  logoutBtn: { // Nút đăng xuất
    backgroundColor: "#e50914",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer", // Thay đổi con trỏ thành hình bàn tay khi hover
  },

  loginBtn: {
    backgroundColor: "#e50914",
    padding: "6px 14px",
    borderRadius: "6px",
    color: "white",
    textDecoration: "none", // Bỏ gạch chân cho link
  },

  /* ===== CONTENT ===== */
  main: { // Nội dung chính
    flex: 1,
    marginTop: "70px", // Khoảng cách từ navbar
  },

  content: {
    padding: "20px 40px", // Khoảng cách bên trong cho nội dung
  },

  /* ===== FOOTER ===== */
  footer: {
    background: "linear-gradient(180deg, #0b0f19 0%, #111 100%)", // Tạo hiệu ứng gradient (chuyển màu) cho footer
    color: "#aaa",
    paddingTop: "60px",
    borderTop: "1px solid #1f2937", // Tạo đường viền cho footer
  },

  footerContainer: { // Container cho footer
    display: "flex",
    justifyContent: "space-between", // Căn giữa các cột trong footer
    padding: "0 80px",
    flexWrap: "wrap", // Cho phép các cột trong footer xuống dòng khi không đủ chỗ
  },

  footerCol: {
    width: "230px",
    marginBottom: "40px",
  },

  footerLogo: {
    color: "#e50914",
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "bold",
  },

  footerTitle: { // Tiêu đề trong footer
    color: "white",
    marginBottom: "15px",
  },

  footerText: { // Nội dung trong footer
    fontSize: "14px",
    lineHeight: "24px", // Khoảng cách giữa các dòng
  },

  footerLink: { // Link trong footer
    fontSize: "14px",
    marginBottom: "10px",
    cursor: "pointer", // Thay đổi con trỏ thành hình bàn tay khi hover
    transition: "0.3s", // Hiệu ứng chuyển động cho link
  },

  social: { // Phần biểu tượng mạng xã hội trong footer
    display: "flex",
    gap: "12px",
    marginTop: "10px",
  },

  socialIcon: { // Biểu tượng mạng xã hội trong footer
    cursor: "pointer",
    fontSize: "18px",
  },

  footerBottom: { // Phần dưới cùng của footer
    textAlign: "center",
    padding: "25px",
    borderTop: "1px solid #1f2937",
    fontSize: "13px",
    color: "#777",
  },
};

export default PublicLayout;