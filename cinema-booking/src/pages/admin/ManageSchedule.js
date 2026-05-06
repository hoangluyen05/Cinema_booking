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
      alert("Lỗi load dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const getMovieName = (id) => {
    const m = movies.find(x => x.id === id);
    return m ? m.title : "N/A";
  };

  const getRoom = (id) => {
    return rooms.find(x => x.id === id);
  };

  const getRoomName = (id) => {
    const r = getRoom(id);
    return r ? r.roomName : "N/A";
  };
  const showToast = (message, type = "error") => {
  setToast({ message, type });

  setTimeout(() => {
    setToast(null);
  }, 3000);
};
  const getCinemaName = (roomId) => {
    const room = getRoom(roomId);
    const cinema = cinemas.find(c => c.id === room?.cinemaId);
    return cinema ? cinema.cinemaName : "N/A";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  if (!form.movieId || !form.roomId || !form.showDate || !form.startTime) {
    alert("Vui lòng nhập đầy đủ!");
    return;
  }

  const payload = {
    movieId: Number(form.movieId),
    roomId: Number(form.roomId),
    showDate: form.showDate,
    startTime:
      form.startTime.length === 5
        ? form.startTime + ":00"
        : form.startTime,
    price: Number(form.price),
  };

  try {
    let res;

    if (editId) {
      res = await fetch(`${API}/showtimes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch(`${API}/showtimes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    const text = await res.text();

    // ❗ nếu backend trả lỗi
    if (!res.ok) {
  showToast(text, "error");
  return;
}

showToast(editId ? "Cập nhật thành công" : "Thêm lịch thành công", "success");

    resetForm();
    setTab("list");
    loadData();

  } catch (err) {
    console.error(err);
    alert("Lỗi khi lưu!");
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
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    await fetch(`${API}/showtimes/${id}`, {
      method: "DELETE",
    });

    loadData();
  };

  const resetForm = () => {
    setForm({
      cinemaId: "",
      movieId: "",
      roomId: "",
      showDate: "",
      startTime: "",
      price: 80000,
    });
    setEditId(null);
  };

  const filteredRooms = rooms.filter(
    r => r.cinemaId == form.cinemaId
  );

  /* FILTER + ORDER */
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
    .sort((a, b) => {
      const cinemaA = getCinemaName(a.roomId);
      const cinemaB = getCinemaName(b.roomId);

      if (cinemaA !== cinemaB) return cinemaA.localeCompare(cinemaB);

      const movieA = getMovieName(a.movieId);
      const movieB = getMovieName(b.movieId);

      if (movieA !== movieB) return movieA.localeCompare(movieB);

      if (a.showDate !== b.showDate)
        return new Date(a.showDate) - new Date(b.showDate);

      return a.startTime.localeCompare(b.startTime);
    });

  return (
    <div style={{ minHeight: "100vh", background: "black", padding: "40px" }}>
      {toast && (
  <div
    style={{
      position: "fixed",
      top: 20,
      right: 20,
      background: toast.type === "error" ? "#ef4444" : "#22c55e",
      color: "white",
      padding: "12px 20px",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
      zIndex: 9999,
      fontWeight: "500",
      animation: "slideIn 0.3s ease"
    }}
  >
    {toast.message}
  </div>
)}
      <div style={cardStyle}>
        <h2>Lịch chiếu</h2>

        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setTab("list")} style={tabBtn(tab === "list")}>
            Danh sách
          </button>

          <button
            onClick={() => {
              resetForm();
              setTab("form");
            }}
            style={tabBtn(tab === "form")}
          >
            Thêm lịch
          </button>
        </div>

        {/* LIST */}
        {tab === "list" && (
          loading ? <p>Đang tải...</p> :
          <table style={tableStyle}>
            <thead>
              <tr style={{ color: "red", textAlign: "center" }}>
                <th style={thStyle}>Rạp</th>
                <th style={thStyle}>Phim</th>
                <th style={thStyle}>Phòng</th>
                <th style={thStyle}>Ngày</th>
                <th style={thStyle}>Giờ</th>
                <th style={thStyle}>Giá</th>
                <th style={thStyle}>Thao tác</th>
              </tr>

              <tr style={{ textAlign: "center" }}>
                <th>
                  <input name="cinema" placeholder="Tìm..." onChange={handleFilterChange} style={filterStyle}/>
                </th>
                <th>
                  <input name="movie" placeholder="Tìm..." onChange={handleFilterChange} style={filterStyle}/>
                </th>
                <th>
                  <input name="room" placeholder="Tìm..." onChange={handleFilterChange} style={filterStyle}/>
                </th>
                <th>
                  <input type="date" name="date" onChange={handleFilterChange} style={filterStyle}/>
                </th>
                <th/>
                <th/>
                <th/>
              </tr>
            </thead>

            <tbody>
              {filteredShowtimes.map(item => (
                <tr key={item.id} style={{ textAlign: "center" }}>
                  <td style={tdStyle}>{getCinemaName(item.roomId)}</td>
                  <td style={tdStyle}>{getMovieName(item.movieId)}</td>
                  <td style={tdStyle}>{getRoomName(item.roomId)}</td>
                  <td style={tdStyle}>{item.showDate}</td>
                  <td style={tdStyle}>{item.startTime}</td>
                  <td style={tdStyle}>{item.price}</td>
                  <td style={tdStyle}>
                    <span onClick={() => handleEdit(item)} style={iconStyle}>✏</span>
                    <span onClick={() => handleDelete(item.id)} style={iconStyle}>🗑</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* FORM */}
        {tab === "form" && (
          <>
            <select
              name="cinemaId"
              value={form.cinemaId}
              onChange={(e) =>
                setForm({
                  ...form,
                  cinemaId: e.target.value,
                  roomId: "",
                })
              }
              style={inputStyle}
            >
              <option value="">Chọn rạp</option>
              {cinemas.map(c => (
                <option key={c.id} value={c.id}>
                  {c.cinemaName}
                </option>
              ))}
            </select>

            <select
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              style={inputStyle}
              disabled={!form.cinemaId}
            >
              <option value="">Chọn phòng</option>
              {filteredRooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.roomName}
                </option>
              ))}
            </select>

            <select
              name="movieId"
              value={form.movieId}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Chọn phim</option>
              {movies.map(m => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>

            <input type="date" name="showDate" value={form.showDate} onChange={handleChange} style={inputStyle}/>
            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} style={inputStyle}/>
            <input type="number" name="price" value={form.price} onChange={handleChange} style={inputStyle}/>

            <button onClick={handleSubmit} style={addBtnStyle}>
              {editId ? "Cập nhật" : "Thêm"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* STYLE */

const cardStyle = {
  maxWidth: "1100px",
  margin: "auto",
  background: "linear-gradient(to right, #0f172a, #020617)",
  padding: "30px",
  borderRadius: "20px",
  color: "white",
};

const tabBtn = (active) => ({
  background: active ? "red" : "#444",
  color: "white",
  border: "none",
  padding: "10px 20px",
  marginRight: "10px",
  borderRadius: "20px",
  cursor: "pointer"
});

const filterStyle = {
  width: "90%",
  padding: "6px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  background: "#e5e5e5",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "20px",
  border: "none",
};

const addBtnStyle = {
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
  marginTop: "20px",
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

export default ManageShowtimes;