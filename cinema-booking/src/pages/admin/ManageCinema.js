import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ManageCinema() {
  const [tab, setTab] = useState("list");
  const [cinemas, setCinemas] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    address: "",
  });

  const API = "http://localhost:8080/api/cinemas";

  const provinces = [
    "Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Ninh", "Bình Dương",
    "Bình Định", "Bình Thuận", "Cà Mau", "Đắk Lắk", "Đồng Nai", "Gia Lai",
    "Hà Nam", "Hải Dương", "Khánh Hòa", "Lâm Đồng", "Nam Định", "Nghệ An",
    "Ninh Bình", "Phú Thọ", "Quảng Ninh", "Thanh Hóa", "Thừa Thiên Huế",
    "Tiền Giang", "Vĩnh Phúc"
  ];

  const fetchCinemas = async () => {
    try {
      const query = `?cinemaName=${filters.name}&address=${filters.address}`;
      const res = await fetch(API + query);
      const data = await res.json();
      setCinemas(data);
    } catch (err) {
      console.error("Lỗi load:", err);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, [filters]);

  const resetForm = () => {
    setName("");
    setAddress("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!name || !address) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API}/${editingId}` : API;
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cinemaName: name,
          address: address,
        }),
      });

      resetForm();
      setTab("list");
      fetchCinemas();
    } catch (err) {
      console.error("Lỗi submit:", err);
    }
  };

  const handleEdit = (cinema) => {
    setEditingId(cinema.id);
    setName(cinema.cinemaName);
    setAddress(cinema.address);
    setTab("form");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa rạp này?")) {
      try {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        fetchCinemas();
      } catch (err) {
        console.error("Lỗi delete:", err);
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "25px" }}>Quản Lý Rạp Chiếu</h2>

        {/* TABS */}
        <div style={{ marginBottom: "30px" }}>
          <button
            style={tabBtn(tab === "list")}
            onClick={() => setTab("list")}
          >
            Danh sách rạp
          </button>
          <button
            style={tabBtn(tab === "form")}
            onClick={() => {
              resetForm();
              setTab("form");
            }}
          >
            {editingId ? "Đang cập nhật" : "Thêm rạp mới"}
          </button>
        </div>

        {/* ===== LIST VIEW ===== */}
        {tab === "list" && (
          <table style={tableStyle}>
            <thead>
              <tr style={{ color: "red" }}>
                <th style={thStyle}>
                  Tên rạp
                  <input
                    name="name"
                    style={filterInputStyle}
                    placeholder="Tìm tên..."
                    onChange={handleFilterChange}
                  />
                </th>
                <th style={thStyle}>
                  Địa chỉ (Tỉnh/Thành)
                  <input
                    name="address"
                    style={filterInputStyle}
                    placeholder="Tìm địa chỉ..."
                    onChange={handleFilterChange}
                  />
                </th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cinemas.length > 0 ? (
                cinemas.map((c) => (
                  <tr key={c.id} style={trStyle}>
                    <td style={tdStyle}>{c.cinemaName}</td>
                    <td style={tdStyle}>{c.address}</td>
                    <td style={tdStyle}>
                      <FaEdit style={iconStyle} onClick={() => handleEdit(c)} />
                      <FaTrash style={iconStyle} onClick={() => handleDelete(c.id)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ padding: "30px", opacity: 0.5, textAlign: "center" }}>
                    Không tìm thấy dữ liệu rạp chiếu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* ===== FORM VIEW ===== */}
        {tab === "form" && (
          <div style={formContainer}>
            <div style={inputGroup}>
              <label style={labelStyle}>Tên rạp chiếu:</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Nhập tên rạp (ví dụ: Cinema Đà Nẵng)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Tỉnh / Thành phố:</label>
              <select
                style={inputStyle}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              >
                <option value="">-- Chọn địa điểm --</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <button style={btnSubmit} onClick={handleSubmit}>
              {editingId ? "CẬP NHẬT THÔNG TIN" : "XÁC NHẬN THÊM RẠP"}
            </button>
            
            {editingId && (
                <button 
                    style={{...btnSubmit, background: "#444", marginTop: "10px"}} 
                    onClick={() => { resetForm(); setTab("list"); }}
                >
                    HỦY BỎ
                </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES (Đồng bộ với ManageMovies) ================= */

const wrapperStyle = {
  minHeight: "100vh",
  background: "black",
  padding: "40px 20px",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  maxWidth: "900px",
  margin: "auto",
  background: "linear-gradient(to right, #0f172a, #020617)",
  padding: "40px",
  borderRadius: "20px",
  color: "white",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
};

const tabBtn = (active) => ({
  background: active ? "red" : "#1e293b",
  color: "white",
  border: "none",
  padding: "12px 25px",
  marginRight: "10px",
  borderRadius: "30px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.3s",
});

const formContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  maxWidth: "600px",
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontSize: "14px",
  color: "#94a3b8",
  marginLeft: "5px",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  fontSize: "16px",
  outline: "none",
};

const btnSubmit = {
  background: "red",
  color: "white",
  border: "none",
  padding: "15px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  marginTop: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  textAlign: "left",
  padding: "15px",
  borderBottom: "2px solid #1e293b",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #1e293b",
};

const trStyle = {
    transition: "0.2s",
};

const filterInputStyle = {
  display: "block",
  marginTop: "8px",
  width: "90%",
  padding: "8px",
  borderRadius: "8px",
  border: "none",
  background: "#1e293b",
  color: "white",
  fontSize: "13px",
};

const iconStyle = {
  cursor: "pointer",
  marginRight: "20px",
  fontSize: "18px",
  transition: "0.2s",
  color: "#94a3b8",
};

const iconHoverStyle = {
    color: "red"
}; // Note: FaEdit/FaTrash hover logic usually handled via CSS classes or state