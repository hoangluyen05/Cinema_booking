import { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

const ManageShowtimes = () => {

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  

  const [form, setForm] = useState({
    movieId: "",
    roomId: "",
    showDate: "",
    startTime: "",
    price: 80000,
  });

  const [filters, setFilters] = useState({
    movie: "",
    room: "",
    date: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mRes, rRes, sRes] = await Promise.all([
        fetch(`${API}/movies`),
        fetch(`${API}/rooms`),
        fetch(`${API}/showtimes`)
      ]);

      const mData = await mRes.json();
      const rData = await rRes.json();
      const sData = await sRes.json();

      const normalized = sData.map(item => ({
        ...item,
        startTime: item.startTime?.slice(0, 5),
        showDate: item.showDate?.slice(0, 10),
      }));

      setMovies(mData || []);
      setRooms(rData || []);
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
    return m ? m.title : "Đang tải...";
  };

  const getRoomName = (id) => {
    const r = rooms.find(x => x.id === id);
    return r ? r.roomName : "Đang tải...";
  };

  

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

 

  

  

  

  const filteredShowtimes = showtimes.filter((item) => {
    const movie = getMovieName(item.movieId).toLowerCase();
    const room = getRoomName(item.roomId).toLowerCase();

    return (
      (!filters.movie || movie.includes(filters.movie.toLowerCase())) &&
      (!filters.room || room.includes(filters.room.toLowerCase())) &&
      (!filters.date || item.showDate.includes(filters.date))
    );
  });

  return (
    <div style={{ minHeight: "100vh", background: "black", padding: "40px" }}>
      <div style={{
        maxWidth: "1000px",
        margin: "auto",
        background: "linear-gradient(to right, #0f172a, #020617)",
        padding: "30px",
        borderRadius: "20px",
        color: "white",
      }}>
        <h2>Danh Sách Lịch chiếu</h2>

        {/* TAB */}
        

        {/* ===== LIST ===== */}
        {"list" && (
          loading ? <p>Đang tải dữ liệu...</p> :
          <table style={tableStyle}>
            <thead>
              <tr style={{ color: "red", textAlign: "center" }}>
                <th style={thStyle}>
                  Tên phim
                  <input name="movie" placeholder="Tìm..." onChange={handleFilterChange} style={filterStyle} />
                </th>
                <th style={thStyle}>
                  Phòng
                  <input name="room" placeholder="Tìm..." onChange={handleFilterChange} style={filterStyle} />
                </th>
                <th style={thStyle}>
                  Ngày
                  <input name="date" type="date" onChange={handleFilterChange} style={filterStyle} />
                </th>
                <th style={thStyle}>Giờ</th>
                <th style={thStyle}>Giá</th>
                
              </tr>
            </thead>

            <tbody>
              {filteredShowtimes.length > 0 ? (
                filteredShowtimes.map(item => (
                  <tr key={item.id} style={{ textAlign: "center" }}>
                    <td style={tdStyle}>{getMovieName(item.movieId)}</td>
                    <td style={tdStyle}>{getRoomName(item.roomId)}</td>
                    <td style={tdStyle}>{item.showDate}</td>
                    <td style={tdStyle}>{item.startTime}</td>
                    <td style={tdStyle}>{item.price}</td>
                   
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", opacity: 0.6 }}>
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

const filterStyle = {
  marginTop: "8px",
  width: "90%",
  padding: "6px",
  borderRadius: "10px",
  border: "none",
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



export default ManageShowtimes;