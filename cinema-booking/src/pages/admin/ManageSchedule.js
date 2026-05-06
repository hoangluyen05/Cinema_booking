import { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

const ManageShowtimes = () => {
  const [tab, setTab] = useState("list");
  const [toast, setToast] = useState(null);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    cinemaId: "",
    movieId: "",
    roomId: "",
    showDate: "",
    startTime: "",
    price: 80000,
  });

  const [filters, setFilters] = useState({
    movie: "",
    room: "",
    cinema: "",
    date: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mRes, rRes, cRes, sRes] = await Promise.all([
        fetch(`${API}/movies`),
        fetch(`${API}/rooms`),
        fetch(`${API}/cinemas`),
        fetch(`${API}/showtimes`)
      ]);

      const mData = await mRes.json();
      const rData = await rRes.json();
      const cData = await cRes.json();
      const sData = await sRes.json();

      const normalized = sData.map(item => ({
        ...item,
        startTime: item.startTime?.slice(0, 5),
        showDate: item.showDate?.slice(0, 10),
      }));

      setMovies(mData || []);
      setRooms(rData || []);
      setCinemas(cData || []);
      setShowtimes(normalized || []);
    } catch (err) {
      console.error(err);
      showToast("Lỗi tải dữ liệu!", "error");
    } finally {
      setLoading(false);
    }
  };

  const getMovie = (id) => movies.find(x => x.id === id);

  const getMovieName = (id) => {
    const m = getMovie(id);
    return m ? m.title : "N/A";
  };

  const getRoom = (id) => rooms.find(x => x.id === id);

  const getRoomName = (id) => {
    const r = getRoom(id);
    return r ? r.roomName : "N/A";
  };

  const getCinemaName = (roomId) => {
    const room = getRoom(roomId);
    const cinema = cinemas.find(c => c.id === room?.cinemaId);
    return cinema ? cinema.cinemaName : "N/A";
  };

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.movieId || !form.roomId || !form.showDate || !form.startTime) {
      showToast("Vui lòng nhập đầy đủ thông tin!", "error");
      return;
    }

    const payload = {
      movieId: Number(form.movieId),
      roomId: Number(form.roomId),
      showDate: form.showDate,
      startTime: form.startTime.length === 5 ? form.startTime + ":00" : form.startTime,
      price: Number(form.price),
    };

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API}/showtimes/${editId}` : `${API}/showtimes`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (!res.ok) {
        showToast(text, "error");
        return;
      }

      showToast(editId ? "Cập nhật thành công" : "Thêm lịch thành công", "success");
      resetForm();
      setTab("list");
      loadData();
    } catch (err) {
      showToast("Lỗi khi kết nối server!", "error");
    }
  };

  const handleEdit = (item) => {
    const room = rooms.find(r => r.id === item.roomId);
    setForm({
      cinemaId: room?.cinemaId || "",
      movieId: item.movieId,
      roomId: item.roomId,
      showDate: item.showDate,
      startTime: item.startTime,
      price: item.price,
    });
    setEditId(item.id);
    setTab("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa lịch chiếu này?")) return;
    await fetch(`${API}/showtimes/${id}`, { method: "DELETE" });
    loadData();
  };

  const resetForm = () => {
    setForm({ cinemaId: "", movieId: "", roomId: "", showDate: "", startTime: "", price: 80000 });
    setEditId(null);
  };

  const filteredRooms = rooms.filter(r => r.cinemaId == form.cinemaId);

  const filteredShowtimes = showtimes
    .filter((item) => {
      const movie = getMovieName(item.movieId).toLowerCase();
      const room = getRoomName(item.roomId).toLowerCase();
      const cinema = getCinemaName(item.roomId).toLowerCase();
      return (
        (!filters.movie || movie.includes(filters.movie.toLowerCase())) &&
        (!filters.room || room.includes(filters.room.toLowerCase())) &&
        (!filters.cinema || cinema.includes(filters.cinema.toLowerCase())) &&
        (!filters.date || item.showDate.includes(filters.date))
      );
    })
    .sort((a, b) => new Date(a.showDate + " " + a.startTime) - new Date(b.showDate + " " + b.startTime));

  return (
    <div style={wrapperStyle}>
      {toast && (
        <div style={{...toastStyle, background: toast.type === "error" ? "#ef4444" : "#22c55e"}}>
          {toast.message}
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ marginBottom: "25px" }}>Quản Lý Lịch Chiếu</h2>

        {/* TABS */}
        <div style={{ marginBottom: "30px" }}>
          <button onClick={() => setTab("list")} style={tabBtn(tab === "list")}>
            Danh sách lịch
          </button>
          <button onClick={() => { resetForm(); setTab("form"); }} style={tabBtn(tab === "form")}>
            {editId ? "Đang sửa lịch" : "Thêm lịch mới"}
          </button>
        </div>

        {/* LIST VIEW */}
        {tab === "list" && (
          loading ? <p style={{ textAlign: "center", opacity: 0.5 }}>Đang tải dữ liệu...</p> :
          <table style={tableStyle}>
            <thead>
              <tr style={{ color: "red" }}>
                <th style={thStyle}>Rạp <input name="cinema" placeholder="Tìm..." onChange={handleFilterChange} style={filterInputStyle}/></th>
                <th style={thStyle}>Phim <input name="movie" placeholder="Tìm..." onChange={handleFilterChange} style={filterInputStyle}/></th>
                <th style={thStyle}>Bom tấn</th>
                <th style={thStyle}>Phòng <input name="room" placeholder="Tìm..." onChange={handleFilterChange} style={filterInputStyle}/></th>
                <th style={thStyle}>Thời gian <input type="date" name="date" onChange={handleFilterChange} style={filterInputStyle}/></th>
                <th style={thStyle}>Giá vé</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredShowtimes.map(item => (
                <tr key={item.id} style={{ textAlign: "center" }}>
                  <td style={tdStyle}>{getCinemaName(item.roomId)}</td>
                  <td style={{...tdStyle, fontWeight: "bold"}}>{getMovieName(item.movieId)}</td>
                  <td style={tdStyle}>{getMovie(item.movieId)?.blockbuster ? "✅" : ""}</td>
                  <td style={tdStyle}>{getRoomName(item.roomId)}</td>
                  <td style={tdStyle}>{item.showDate} | {item.startTime}</td>
                  <td style={tdStyle}>{item.price.toLocaleString()}đ</td>
                  <td style={tdStyle}>
                    <span onClick={() => handleEdit(item)} style={iconStyle}>✏</span>
                    <span onClick={() => handleDelete(item.id)} style={iconStyle}>🗑</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* FORM VIEW */}
        {tab === "form" && (
          <div style={formContainer}>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ ...inputGroup, flex: 1 }}>
                <label style={labelStyle}>Chọn rạp chiếu:</label>
                <select name="cinemaId" value={form.cinemaId} style={inputStyle}
                  onChange={(e) => setForm({ ...form, cinemaId: e.target.value, roomId: "" })}>
                  <option value="">-- Chọn rạp --</option>
                  {cinemas.map(c => <option key={c.id} value={c.id}>{c.cinemaName}</option>)}
                </select>
              </div>

              <div style={{ ...inputGroup, flex: 1 }}>
                <label style={labelStyle}>Chọn phòng chiếu:</label>
                <select name="roomId" value={form.roomId} onChange={handleChange} style={inputStyle} disabled={!form.cinemaId}>
                  <option value="">-- Chọn phòng --</option>
                  {filteredRooms.map(r => <option key={r.id} value={r.id}>{r.roomName}</option>)}
                </select>
              </div>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Phim trình chiếu:</label>
              <select name="movieId" value={form.movieId} onChange={handleChange} style={inputStyle}>
                <option value="">-- Chọn phim --</option>
                {movies.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.title} {m.blockbuster ? "(Bom tấn)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ ...inputGroup, flex: 1 }}>
                <label style={labelStyle}>Ngày chiếu:</label>
                <input type="date" name="showDate" value={form.showDate} onChange={handleChange} style={inputStyle}/>
              </div>
              <div style={{ ...inputGroup, flex: 1 }}>
                <label style={labelStyle}>Giờ bắt đầu:</label>
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} style={inputStyle}/>
              </div>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Giá vé (VNĐ):</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} style={inputStyle}/>
            </div>

            <button onClick={handleSubmit} style={btnSubmit}>
              {editId ? "CẬP NHẬT LỊCH CHIẾU" : "XÁC NHẬN THÊM LỊCH"}
            </button>
            
            {editId && (
              <button style={{...btnSubmit, background: "#444", marginTop: "10px"}} 
                onClick={() => { resetForm(); setTab("list"); }}>HỦY BỎ</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* STYLE SYSTEM */
const wrapperStyle = { minHeight: "100vh", background: "black", padding: "40px 20px" };
const cardStyle = { maxWidth: "1100px", margin: "auto", background: "linear-gradient(to right, #0f172a, #020617)", padding: "40px", borderRadius: "20px", color: "white" };
const tabBtn = (active) => ({ background: active ? "red" : "#1e293b", color: "white", border: "none", padding: "12px 25px", marginRight: "10px", borderRadius: "30px", cursor: "pointer", fontWeight: "bold" });
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "10px" };
const thStyle = { padding: "15px", borderBottom: "2px solid #1e293b" };
const tdStyle = { padding: "15px", borderBottom: "1px solid #1e293b" };
const filterInputStyle = { display: "block", marginTop: "8px", width: "100%", padding: "8px", borderRadius: "8px", border: "none", background: "#1e293b", color: "white", fontSize: "12px" };
const formContainer = { display: "flex", flexDirection: "column", gap: "20px" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { fontSize: "14px", color: "#94a3b8", marginLeft: "5px" };
const inputStyle = { width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #334155", background: "#1e293b", color: "white", fontSize: "16px", outline: "none" };
const btnSubmit = { background: "red", color: "white", border: "none", padding: "15px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" };
const iconStyle = { cursor: "pointer", margin: "0 10px", color: "#94a3b8" };
const toastStyle = { position: "fixed", top: 20, right: 20, color: "white", padding: "12px 20px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.4)", zIndex: 9999, fontWeight: "500" };

export default ManageShowtimes;