import { Outlet } from "react-router-dom"; // dùng để hiển thị component con theo route khi chuyển trang thì nội dung sẽ render vào <outlet/>
import Sidebar from "../components/Sidebar";

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}> {/*chia layout thành 2 cột sidebar + nội dung*/}
      {/* Sidebar */}
      <Sidebar role="admin" /> {/* Sidebar bên trái */}

      {/* Nội dung */}
      <div
        style={{
          marginLeft: "220px",   // 👈 QUAN TRỌNG nếu không có nội dung sẽ đè lên sidebar
          padding: "30px",
          width: "100%"
        }}
      >
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;