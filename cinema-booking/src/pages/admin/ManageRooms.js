import { useState, useEffect } from "react";

const API_ROOMS = "http://localhost:8080/api/rooms";
const API_CINEMAS = "http://localhost:8080/api/cinemas";

const ManageRooms = () => {
  const [tab, setTab] = useState("list");
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);

  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [cinemaName, setCinemaName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [filters, setFilters] = useState({
    roomName: "",
    totalSeats: "",
    cinemaName: "",
  });

  // load cinema
  useEffect(() => {
    fetch(API_CINEMAS)
      .then(res => res.json())
      .then(data => setCinemas(data));
  }, []);

  // load rooms
  useEffect(() => {
    fetchRooms();
  }, [filters, cinemas]);

  const fetchRooms = async () => {
    const res = await fetch(API_ROOMS);
    const data = await res.json();

    const filtered = data.filter((room) => {
      const rCinema = cinemas.find(c => c.id === room.cinemaId)?.cinemaName || "";

      return (
        room.roomName.toLowerCase().includes(filters.roomName.toLowerCase()) &&
        room.totalSeats.toString().includes(filters.totalSeats) &&
        rCinema.toLowerCase().includes(filters.cinemaName.toLowerCase())
      );
    });

    setRooms(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setRoomName("");
    setCapacity("");
    setCinemaName("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!roomName || !capacity || !cinemaName) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const selectedCinema = cinemas.find(c => c.cinemaName === cinemaName);
    if (!selectedCinema) {
      alert("Chọn rạp hợp lệ từ danh sách");
      return;
    }

    const payload = {
      roomName,
      totalSeats: Number(capacity),
      cinemaId: selectedCinema.id,
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_ROOMS}/${editingId}` : API_ROOMS;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetForm();
    setTab("list");
    fetchRooms();
  };

  const handleEdit = (room) => {
    setRoomName(room.roomName);
    setCapacity(room.totalSeats);
    const rCinema = cinemas.find(c => c.id === room.cinemaId)?.cinemaName || "";
    setCinemaName(rCinema);
    setEditingId(room.id);
    setTab("form");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phòng này?")) {
      await fetch(`${API_ROOMS}/${id}`, { method: "DELETE" });
      fetchRooms();
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "25px" }}>Quản Lý Phòng Chiếu</h2>

        {/* TAB NAVIGATION */}
        <div style={{ marginBottom: "30px" }}>
          <button onClick={() => setTab("list")} style={tabBtn(tab === "list")}>
            Danh sách phòng
          </button>
          <button onClick={() => { resetForm(); setTab("form"); }} style={tabBtn(tab === "form")}>
            {editingId ? "Đang cập nhật" : "Thêm phòng mới"}
          </button>
        </div>

        {/* ===== LIST VIEW ===== */}
        {tab === "list" && (
          <table style={tableStyle}>
            <thead>
              <tr style={{ color: "red" }}>
                <th style={thStyle}>
                  Tên phòng
                  <input
                    name="roomName"
                    placeholder="Tìm..."
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>
                <th style={thStyle}>
                  Sức chứa
                  <input
                    name="totalSeats"
                    placeholder="Tìm..."
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>
                <th style={thStyle}>
                  Rạp trực thuộc
                  <input
                    name="cinemaName"
                    placeholder="Tìm..."
                    onChange={handleFilterChange}
                    style={filterInputStyle}
                  />
                </th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room) => {
                  const rCinema = cinemas.find(c => c.id === room.cinemaId)?.cinemaName || "";
                  return (
                    <tr key={room.id} style={{ textAlign: "center" }}>
                      <td style={tdStyle}>{room.roomName}</td>
                      <td style={tdStyle}>{room.totalSeats} ghế</td>
                      <td style={tdStyle}>{rCinema}</td>
                      <td style={tdStyle}>
                        <span onClick={() => handleEdit(room)} style={iconStyle}>✏</span>
                        <span onClick={() => handleDelete(room.id)} style={iconStyle}>🗑</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: "30px", opacity: 0.5 }}>
                    Không có dữ liệu phòng chiếu
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
              <label style={labelStyle}>Tên phòng chiếu:</label>
              <input
                type="text"
                placeholder="Ví dụ: Phòng 01 - IMAX"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Số lượng ghế (sức chứa):</label>
              <input
                type="number"
                placeholder="Nhập số lượng ghế"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Rạp trực thuộc:</label>
              <input
                list="cinemas-list"
                placeholder="Chọn hoặc nhập tên rạp"
                value={cinemaName}
                onChange={(e) => setCinemaName(e.target.value)}
                style={inputStyle}
              />
              <datalist id="cinemas-list">
                {cinemas.map((c) => (
                  <option key={c.id} value={c.cinemaName} />
                ))}
              </datalist>
            </div>

            <button onClick={handleSubmit} style={btnSubmit}>
              {editingId ? "CẬP NHẬT PHÒNG" : "XÁC NHẬN THÊM MỚI"}
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
};

/* ================= STYLES (Đồng bộ toàn bộ hệ thống) ================= */

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
  padding: "15px",
  borderBottom: "2px solid #1e293b",
  textAlign: "center",
};

const tdStyle = {
  padding: "15px",
  borderBottom: "1px solid #1e293b",
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
  margin: "8px auto 0 auto",
};

const iconStyle = {
  cursor: "pointer",
  margin: "0 10px",
  fontSize: "18px",
  color: "#94a3b8",
  transition: "0.2s",
};

export default ManageRooms;