import { Navigate } from "react-router-dom"; // Navigate là component của:React Router Nó dùng để chuyển hướng
import { useAuth } from "../context/AuthContext"; // useAuth() là custom hook bạn tạo trong AuthContext

function ProtectedRoute({ children, roles }) { // children chính là <AdminPage />, roles Là danh sách quyền được phép truy cập. 
  const { user } = useAuth(); // lấy thông tin user hiện tại

  // Chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />; // chuyển sang login
  }

  // Có đăng nhập nhưng không đúng quyền
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />; // chuyển sang trang chủ
  }

  return children;
}

export default ProtectedRoute;
/* ProtectedRoute làm 3 việc:

Kiểm tra đăng nhập

Kiểm tra role

Redirect nếu không hợp lệ */