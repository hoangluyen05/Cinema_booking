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
      alert("Nhập đầy đủ thông tin");
      return;
    }

    const selectedCinema = cinemas.find(c => c.cinemaName === cinemaName);
    if (!selectedCinema) {
      alert("Chọn rạp hợp lệ");
      return;
    }

    const payload = {
      roomName,
      totalSeats: Number(capacity),
      cinemaId: selectedCinema.id,
    };

    if (editingId) {
      await fetch(`${API_ROOMS}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(API_ROOMS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    setTab("list"); // 👈 quay lại list
    fetchRooms();
  };

  const handleEdit = (room) => {
    setRoomName(room.roomName);
    setCapacity(room.totalSeats);

    const rCinema = cinemas.find(c => c.id === room.cinemaId)?.cinemaName || "";
    setCinemaName(rCinema);

    setEditingId(room.id);
    setTab("form"); // 👈 chuyển tab
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      await fetch(`${API_ROOMS}/${id}`, { method: "DELETE" });
      fetchRooms();
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2>Phòng chiếu</h2>

        {/* TAB */}
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setTab("list")} style={tabBtn(tab === "list")}>
            Danh sách
          </button>
          <button onClick={() => { resetForm(); setTab("form"); }} style={tabBtn(tab === "form")}>
            Thêm phòng
          </button>
        </div>

        {/* ===== LIST ===== */}
        {tab === "list" && (
          <table style={tableStyle}>
            <thead>
              <tr style={{ color: "red" }}>
                <th style={thStyle}>
                  Phòng
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
                  Rạp
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
                      <td style={tdStyle}>{room.totalSeats}</td>
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
                  <td colSpan="4" style={{ padding: "20px", opacity: 0.6 }}>
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* ===== FORM ===== */}
        {tab === "form" && (
          <>
            <input
              type="text"
              placeholder="Phòng"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              style={inputStyle}
            />

            <input
              type="number"
              placeholder="Sức chứa"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              style={inputStyle}
            />

            <input
              list="cinemas-list"
              placeholder="Chọn hoặc nhập rạp"
              value={cinemaName}
              onChange={(e) => setCinemaName(e.target.value)}
              style={inputStyle}
            />

            <datalist id="cinemas-list">
              {cinemas.map((c) => (
                <option key={c.id} value={c.cinemaName} />
              ))}
            </datalist>

            <button onClick={handleSubmit} style={btnStyle}>
              {editingId ? "Cập nhật" : "Thêm"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* STYLE */
const tabBtn = (active) => ({
  background: active ? "red" : "#444",
  color: "white",
  border: "none",
  padding: "10px 20px",
  marginRight: "10px",
  borderRadius: "20px",
  cursor: "pointer"
});

const wrapperStyle = {
  minHeight: "100vh",
  background: "black",
  padding: "40px 20px",
};

const cardStyle = {
  maxWidth: "900px",
  margin: "auto",
  background: "linear-gradient(to right, #0f172a, #020617)",
  padding: "30px",
  borderRadius: "20px",
  color: "white",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "20px",
  border: "none",
};

const filterInputStyle = {
  marginTop: "6px",
  width: "90%",
  padding: "4px",
  borderRadius: "6px",
};

const btnStyle = {
  background: "red",
  border: "none",
  padding: "10px 20px",
  borderRadius: "20px",
  color: "white",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #333",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #222",
};

const iconStyle = {
  cursor: "pointer",
  margin: "0 10px",
};

export default ManageRooms;