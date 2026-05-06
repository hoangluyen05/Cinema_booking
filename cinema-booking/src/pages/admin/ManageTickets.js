import { useEffect, useState } from "react";

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState([]);
  const [activeTab, setActiveTab] = useState("tickets");

  const [filters, setFilters] = useState({
    movie: "",
    cinema: "",
    room: "",
    seat: "",
  });

  const [statsFilter, setStatsFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // ================= LOAD TICKETS =================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [ticketRes, showtimeRes, movieRes, roomRes, cinemaRes, bookingRes] =
          await Promise.all([
            fetch("http://localhost:8080/api/tickets"),
            fetch("http://localhost:8080/api/showtimes"),
            fetch("http://localhost:8080/api/movies"),
            fetch("http://localhost:8080/api/rooms"),
            fetch("http://localhost:8080/api/cinemas"),
            fetch("http://localhost:8080/api/bookings"),
          ]);

        const ticketsData = await ticketRes.json();
        const showtimes = await showtimeRes.json();
        const movies = await movieRes.json();
        const rooms = await roomRes.json();
        const cinemas = await cinemaRes.json();
        const bookings = await bookingRes.json();

        const movieMap = Object.fromEntries(movies.map(m => [m.id, m]));
        const showtimeMap = Object.fromEntries(showtimes.map(s => [s.id, s]));
        const roomMap = Object.fromEntries(rooms.map(r => [r.id, r]));
        const cinemaMap = Object.fromEntries(cinemas.map(c => [c.id, c]));
        const bookingMap = Object.fromEntries(bookings.map(b => [b.id, b]));

        const fullTickets = ticketsData.map((t) => {
          const showtime = showtimeMap[t.showtimeId];
          const movie = movieMap[showtime?.movieId];
          const room = roomMap[showtime?.roomId];
          const cinema = cinemaMap[room?.cinemaId];
          const booking = bookingMap[t.bookingId];

          // ✅ Đồng bộ logic blockbuster với ManageMovies
          const isBlockbuster =
            movie?.blockbuster === true ||
            movie?.blockbuster_manual === 1 ||
            movie?.blockbuster_auto === 1;

          return {
            ...t,
            movieId: movie?.id,
            movieName: movie?.title || "N/A",
            cinemaName: cinema?.cinemaName || "N/A",
            roomName: room?.roomName || "N/A",
            price: t.price || showtime?.price || 0,
            bookingTime: booking?.bookingTime || "",
            showtimeText: showtime
              ? `${showtime.showDate} ${showtime.startTime}`
              : "N/A",
            isBlockbuster,
          };
        });

        setTickets(fullTickets);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  // ================= LOAD STATS =================
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [statsRes, movieRes] = await Promise.all([
          fetch("http://localhost:8080/api/statistics/tickets-by-movie"),
          fetch("http://localhost:8080/api/movies"),
        ]);

        const statsData = await statsRes.json();
        const movies = await movieRes.json();

        const movieMap = Object.fromEntries(movies.map(m => [m.title, m]));

        const fullStats = statsData.map((s) => {
          const movie = movieMap[s.movieName];

          const isBlockbuster =
            movie?.blockbuster === true ||
            movie?.blockbuster_manual === 1 ||
            movie?.blockbuster_auto === 1;

          return {
            ...s,
            isBlockbuster,
          };
        });

        setStats(fullStats);
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
  }, []);

  // ================= FILTER =================
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredTickets = tickets
    .filter((t) => t.status === "booked")
    .filter((t) => {
      return (
        (!filters.movie ||
          t.movieName.toLowerCase().includes(filters.movie.toLowerCase())) &&
        (!filters.cinema ||
          t.cinemaName.toLowerCase().includes(filters.cinema.toLowerCase())) &&
        (!filters.room ||
          t.roomName.toLowerCase().includes(filters.room.toLowerCase())) &&
        (!filters.seat ||
          `${t.seat?.seatRow}${t.seat?.seatNumber}`
            .toLowerCase()
            .includes(filters.seat.toLowerCase()))
      );
    });

  const filteredStats = stats.filter((s) =>
    s.movieName.toLowerCase().includes(statsFilter.toLowerCase())
  );

  // ================= CLICK =================
  const handleClickTicket = async (ticketId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/tickets/${ticketId}/user`
      );
      const data = await res.json();
      setSelectedUser(data);
    } catch {
      alert("Không lấy được thông tin người đặt");
    }
  };

  // ================= UI =================
  return (
    <div style={{ minHeight: "100vh", background: "black", padding: 40 }}>
      <div style={container}>
        <h2>Quản lý vé</h2>

        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setActiveTab("tickets")} style={activeTab === "tickets" ? activeBtn : normalBtn}>
            Quản lý vé
          </button>
          <button onClick={() => setActiveTab("stats")} style={activeTab === "stats" ? activeBtn : normalBtn}>
            Thống kê
          </button>
        </div>

        {/* ================= TAB TICKETS ================= */}
        {activeTab === "tickets" && (
          <table style={{ width: "100%" }}>
            <thead>
              <tr style={{ color: "red" }}>
                <th style={thStyle}>Phim</th>
                <th style={thStyle}>Rạp</th>
                <th style={thStyle}>Phòng</th>
                <th style={thStyle}>Ghế</th>
                <th style={thStyle}>Giá</th>
                <th style={thStyle}>Suất chiếu</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Bom tấn</th>
              </tr>

              <tr>
                <th><input name="movie" onChange={handleFilterChange} style={filterInput}/></th>
                <th><input name="cinema" onChange={handleFilterChange} style={filterInput}/></th>
                <th><input name="room" onChange={handleFilterChange} style={filterInput}/></th>
                <th><input name="seat" onChange={handleFilterChange} style={filterInput}/></th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((t) => (
                <tr key={t.id} style={rowStyle} onClick={() => handleClickTicket(t.id)}>
                  <td style={tdStyle}>{t.movieName}</td>
                  <td style={tdStyle}>{t.cinemaName}</td>
                  <td style={tdStyle}>{t.roomName}</td>
                  <td style={tdStyle}>
                    {t.seat ? `${t.seat.seatRow}${t.seat.seatNumber}` : "N/A"}
                  </td>
                  <td style={tdStyle}>{t.price}</td>
                  <td style={tdStyle}>{t.showtimeText}</td>
                  <td style={tdStyle}>{t.status}</td>
                  <td style={tdStyle}>
                    {t.isBlockbuster ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ================= TAB STATS ================= */}
        {activeTab === "stats" && (
          <>
            <input
              placeholder="Tìm theo tên phim..."
              value={statsFilter}
              onChange={(e) => setStatsFilter(e.target.value)}
              style={{ ...filterInput, marginBottom: 20 }}
            />

            <table style={{ width: "100%" }}>
              <thead>
                <tr style={{ color: "orange" }}>
                  <th style={thStyle}>Tên phim</th>
                  <th style={thStyle}>Số vé</th>
                  <th style={thStyle}>Bom tấn</th>
                </tr>
              </thead>

              <tbody>
                {filteredStats.map((s, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{s.movieName}</td>
                    <td style={tdStyle}>{s.totalTickets}</td>
                    <td style={tdStyle}>
                      {s.isBlockbuster ? "✅" : "❌"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedUser && (
        <div style={overlayStyle} onClick={() => setSelectedUser(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <h3>Thông tin người đặt vé</h3>
              <button style={closeBtn} onClick={() => setSelectedUser(null)}>✕</button>
            </div>

            <div style={userCard}>
              <div style={avatar}>
                {selectedUser.fullName?.charAt(0)}
              </div>
              <div>
                <div style={userName}>{selectedUser.fullName}</div>
                <div style={badge}>{selectedUser.role}</div>
              </div>
            </div>

            <div style={infoGrid}>
              <Info label="Email" value={selectedUser.email}/>
              <Info label="Role" value={selectedUser.role}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== COMPONENT + STYLE =====
const Info = ({label,value}) => (
  <div style={infoBox}>
    <div style={infoLabel}>{label}</div>
    <div style={infoValue}>{value}</div>
  </div>
);

const container = { maxWidth:1200, margin:"auto", background:"linear-gradient(to right, #0f172a, #020617)", padding:30, borderRadius:20, color:"white" };
const rowStyle = { textAlign:"center", cursor:"pointer" };
const overlayStyle = { position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", justifyContent:"center", alignItems:"center" };
const modalStyle = { background:"#020617", padding:25, borderRadius:16, width:420 };
const modalHeader = { display:"flex", justifyContent:"space-between", marginBottom:20 };
const closeBtn = { background:"transparent", border:"none", color:"white", cursor:"pointer" };
const userCard = { display:"flex", gap:15, alignItems:"center", marginBottom:20 };
const avatar = { width:55, height:55, borderRadius:"50%", background:"red", display:"flex", justifyContent:"center", alignItems:"center" };
const userName = { fontSize:18, fontWeight:"bold" };
const badge = { background:"#1e293b", padding:"4px 10px", borderRadius:8, fontSize:12 };
const infoGrid = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 };
const infoBox = { padding:12, borderRadius:10, border:"1px solid #1f2937" };
const infoLabel = { fontSize:12, opacity:0.6 };
const infoValue = { fontSize:14 };
const thStyle = { padding:10, borderBottom:"1px solid #333" };
const tdStyle = { padding:12, borderBottom:"1px solid #222" };
const filterInput = { marginTop:8, width:"90%", padding:6, borderRadius:10 };
const activeBtn = { background:"red", color:"white", border:"none", padding:"10px 20px", marginRight:10 };
const normalBtn = { background:"#1f2937", color:"white", border:"1px solid #555", padding:"10px 20px", marginRight:10 };

export default ManageTickets;