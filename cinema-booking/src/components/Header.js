import { Link } from "react-router-dom"; // Link là component của react-router-dom dùng để điều hướng trong SPA
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth(); // lấy user và hàm logout

  return (
    <div className="header">
      <div className="logo">CINEMA BOOKING</div>

      <div className="nav">
        <Link to="/">Trang chủ</Link>
        <Link to="/movies">Phim</Link>
        {/* Phân quyền */}
        {user?.role === "user" && <Link to="/account">Tài khoản</Link>}
        {user?.role === "admin" && <Link to="/admin/movies">Quản trị</Link>}

        {user ? (
          <button className="btn" onClick={logout}>
            Đăng xuất
          </button> // nếu user tồn tại thì gọi hàm logout trong AuthContext
        ) : (
          <Link to="/login" className="btn">
            Đăng nhập
          </Link> // user không tồn tại thì gọi đăng nhập
        )}
      </div>
    </div>
  );
};

export default Header;