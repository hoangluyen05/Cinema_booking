import { useState, useEffect } from "react";

const ManageStaff = () => {
  const [activeTab, setActiveTab] = useState("list"); // 'list' hoặc 'add'
  const [staffs, setStaffs] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    position: "",
  });
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({ name: "", email: "", position: "" });

  /* ================= LOAD STAFF ================= */
  const fetchStaffs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/staff");
      const data = await res.json();
      setStaffs(data);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách nhân viên");
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async () => {
    if (!form.fullName || !form.email || (!form.password && !editId) || !form.position) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      if (editId) {
        // update
        await fetch(`http://localhost:8080/api/admin/staff/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        // create
        await fetch("http://localhost:8080/api/admin/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      setForm({ fullName: "", email: "", password: "", position: "" });
      setEditId(null);
      setActiveTab("list");
      fetchStaffs();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (staff) => {
    setForm({
      fullName: staff.fullName,
      email: staff.email,
      password: "", // không hiển thị password cũ
      position: staff.position,
    });
    setEditId(staff.id);
    setActiveTab("add");
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      await fetch(`http://localhost:8080/api/admin/staff/${id}`, {
        method: "DELETE",
      });
      fetchStaffs();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  /* ================= FILTER ================= */
  const filteredStaffs = Array.isArray(staffs)
  ? staffs.filter(
      (staff) =>
        (!filters.name ||
          (staff.fullName || "")
            .toLowerCase()
            .includes(filters.name.toLowerCase())) &&

        (!filters.email ||
          (staff.email || "")
            .toLowerCase()
            .includes(filters.email.toLowerCase())) &&

        (!filters.position ||
          (staff.position || "")
            .toLowerCase()
            .includes(filters.position.toLowerCase()))
    )
  : [];

  return (
    <div style={{ padding: "40px", background: "#000", minHeight: "100vh", color: "white" }}>
      <div
        style={{
          background: "linear-gradient(to right, #0f172a, #020617)",
          padding: "30px",
          borderRadius: "20px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Quản lý Nhân Sự</h2>

        {/* ================= TAB BUTTON ================= */}
        <div style={{ marginBottom: "20px" }}>
          <button
            style={{
              ...tabButtonStyle,
              background: activeTab === "list" ? "red" : "#333",
            }}
            onClick={() => setActiveTab("list")}
          >
            Danh sách nhân viên
          </button>
          <button
            style={{
              ...tabButtonStyle,
              background: activeTab === "add" ? "red" : "#333",
            }}
            onClick={() => setActiveTab("add")}
          >
            Thêm nhân viên
          </button>
        </div>

        {/* ================= LIST TAB ================= */}
        {activeTab === "list" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "center", color: "red" }}>
                <th style={thStyle}>Tên</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Vị trí</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
              <tr style={{ textAlign: "center", color: "white" }}>
                <th style={thStyle}>
                  <input
                    type="text"
                    placeholder="Tìm..."
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>
                <th style={thStyle}>
                  <input
                    type="text"
                    placeholder="Tìm..."
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>
                <th style={thStyle}>
                  <input
                    type="text"
                    placeholder="Tìm..."
                    name="position"
                    value={filters.position}
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffs.length > 0 ? (
                filteredStaffs.map((staff) => (
                  <tr key={staff.id} style={{ textAlign: "center" }}>
                    <td style={tdStyle}>{staff.fullName}</td>
                    <td style={tdStyle}>{staff.email}</td>
                    <td style={tdStyle}>{staff.position}</td>
                    <td style={tdStyle}>
                      <span style={iconStyle} onClick={() => handleEdit(staff)}>
                        ✏
                      </span>
                      <span style={iconStyle} onClick={() => handleDelete(staff.id)}>
                        🗑
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", opacity: 0.6 }}>
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* ================= ADD / EDIT TAB ================= */}
        {activeTab === "add" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
            <input
              type="text"
              name="fullName"
              placeholder="Họ tên"
              value={form.fullName}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="password"
              name="password"
              placeholder={editId ? "Để trống nếu không đổi mật khẩu" : "Mật khẩu"}
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
            />
            <select name="position" value={form.position} onChange={handleChange} style={inputStyle}>
              <option value="">-- Chọn vị trí --</option>
              <option value="Bán vé">Bán vé</option>
              <option value="Soát vé">Soát vé</option>
              <option value="Quản lý phòng chiếu">Quản lý phòng chiếu</option>
              <option value="Kỹ thuật">Kỹ thuật</option>
            </select>
            <button onClick={handleSubmit} style={buttonStyle}>
              {editId ? "Cập nhật" : "Tạo nhân viên"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================== STYLE ================== */
const tabButtonStyle = {
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  marginRight: "10px",
};

const inputStyle = {
  padding: "10px 15px",
  borderRadius: "20px",
  border: "none",
  outline: "none",
  width: "250px",
};

const filterInputStyle = {
  width: "90%",
  padding: "5px 10px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
};

const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #333",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #222",
};

const buttonStyle = {
  background: "red",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  width: "200px",
};

const iconStyle = {
  margin: "0 10px",
  cursor: "pointer",
  fontSize: "18px",
};

export default ManageStaff;