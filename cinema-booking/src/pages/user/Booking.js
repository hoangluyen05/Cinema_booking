import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

function Booking() {
  const { id } = useParams();

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [seats, setSeats] = useState([]);

  const [movieId, setMovieId] = useState(null);
  const [cinemaId, setCinemaId] = useState(null);
  const [showtimeId, setShowtimeId] = useState(null);

  const [movieInput, setMovieInput] = useState("");
  const [cinemaInput, setCinemaInput] = useState("");

  const [showMovieDropdown, setShowMovieDropdown] = useState(false);
  const [showCinemaDropdown, setShowCinemaDropdown] = useState(false);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);

  const [date, setDate] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const selectedMovie = movieId && movies.find((m) => m.id === movieId);

const selectedShowtime =
  showtimes.find((s) => Number(s.id) === Number(showtimeId));

  const user = JSON.parse(localStorage.getItem("user"));

  const getArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };

  const resetAll = () => {
    setMovieId(null);
    setCinemaId(null);
    setShowtimeId(null);

    setMovieInput("");
    setCinemaInput("");

    setCinemas([]);
    setShowtimes([]);
    setSeats([]);

    setSelectedSeats([]);
    setDate("");
  };

  /* ================= MOVIES ================= */
  useEffect(() => {
    fetch("http://localhost:8080/api/movies/now-showing")
      .then((res) => res.json())
      .then((data) => {
        const arr = getArray(data);
        setMovies(arr);

        const movieFromUrl = id && arr.find((m) => String(m.id) === String(id));

        if (movieFromUrl) {
          setMovieId(movieFromUrl.id);
          setMovieInput(movieFromUrl.title);
        } else {
          resetAll();
        }
      });
  }, [id]);

  /* ================= CINEMAS ================= */
  useEffect(() => {
    if (!movieId) return;

    setCinemaId(null);
    setShowtimeId(null);
    setSeats([]);
    setSelectedSeats([]);
    setDate("");

    fetch(`http://localhost:8080/api/cinemas/by-movie?movieId=${movieId}`)
      .then((res) => res.json())
      .then((data) => setCinemas(getArray(data)));
  }, [movieId]);

  /* ================= SHOWTIMES ================= */
  useEffect(() => {
    if (!movieId || !cinemaId || !date) return;

    fetch(
      `http://localhost:8080/api/showtimes/search?movieId=${movieId}&cinemaId=${cinemaId}&date=${date}`
    )
      .then((res) => res.json())
      .then((data) => setShowtimes(getArray(data)));
  }, [movieId, cinemaId, date]);

  useEffect(() => {
    if (!movieId) return;

    fetch(`http://localhost:8080/api/showtimes/movie/${movieId}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = getArray(data);

        const dates = [...new Set(arr.map((s) => moment(s.showDate).format("YYYY-MM-DD")))];
        setAvailableDates(dates);
      });
  }, [movieId]);

  const isTileDisabled = ({ date, view }) => {
    if (view !== "month") return false;

    const d = moment(date).format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");

    if (d < today) return true;
    if (!availableDates.includes(d)) return true;

    return false;
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    const d = moment(date).format("YYYY-MM-DD");
    return availableDates.includes(d) ? "has-showtime" : "";
  };

  /* ================= SEATS ================= */
  useEffect(() => {
    if (!showtimeId) return;

    setSelectedSeats([]);

    fetch(`http://localhost:8080/api/seats/showtime/${showtimeId}`)
      .then((res) => res.json())
      .then((data) => setSeats(getArray(data)));
  }, [showtimeId]);

  const filteredMovies = movies.filter((m) =>
    (m.title || "").toLowerCase().includes(movieInput.toLowerCase())
  );

  const filteredCinemas = cinemas.filter((c) =>
    (c.cinemaName || "").toLowerCase().includes(cinemaInput.toLowerCase())
  );



  /* ================= BOOKING ================= */
 const handleBooking = async () => {
  if (!user?.id) return alert("Bạn chưa đăng nhập!");
  if (!showtimeId || selectedSeats.length === 0)
    return alert("Chọn suất và ghế!");

  try {
    // 1. tạo booking
    const res = await fetch("http://localhost:8080/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        showtimeId,
        seatIds: selectedSeats,
      }),
    });

    const booking = await res.json();

    const bookingId =
      booking.bookingId || booking.id || booking.data?.bookingId;

    if (!bookingId) {
      alert("Không lấy được bookingId");
      return;
    }

    // 2. gọi API thanh toán
    const payRes = await fetch(
      `http://localhost:8080/api/payments/payos/create/${bookingId}`,
      {
        method: "POST",
      }
    );

    const payData = await payRes.json();

    if (!payData.checkoutUrl) {
      alert("Không tạo được link thanh toán");
      return;
    }

    // 3. redirect sang PayOS
    window.location.href = payData.checkoutUrl;

  } catch (err) {
    console.error(err);
    alert("Lỗi thanh toán");
  }
};

 const total = selectedSeats.length * (selectedShowtime?.price || 0);

  return (
    <PublicLayout>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>🎟️ Đặt vé xem phim</h2>

        {/* MOVIE INFO */}
        {selectedMovie && (
          <div style={styles.movieCard}>
            <img src={selectedMovie.poster} style={styles.poster} />
            <div>
              <h2>{selectedMovie.title}</h2>
              <p style={styles.tag}>{selectedMovie.genre}</p>
              <p>⏱ {selectedMovie.duration} phút</p>
              <p style={{ opacity: 0.8 }}>{selectedMovie.description}</p>
            </div>
          </div>
        )}

        {/* MOVIE */}
        <div style={styles.card}>
          <div style={styles.inputWrapper}>
            <input
              placeholder="🔎 Tìm hoặc chọn phim..."
              style={styles.input}
              value={movieInput}
              onFocus={() => setShowMovieDropdown(true)}
              onChange={(e) => {
                setMovieInput(e.target.value);
                setShowMovieDropdown(true);
              }}
            />
            <span style={styles.arrow}>▼</span>
          </div>

          {showMovieDropdown && movieInput && (
            <div style={styles.dropdown}>
              {filteredMovies.map((m) => (
                <div
                  key={m.id}
                  style={styles.option}
                  onClick={() => {
                    setMovieId(m.id);
                    setMovieInput(m.title);
                    setShowMovieDropdown(false);
                  }}
                >
                  🎬 {m.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CINEMA */}
        <div style={styles.card}>
          <div style={styles.inputWrapper}>
            <input
              placeholder="🏢 Tìm hoặc chọn rạp..."
              style={styles.input}
              value={cinemaInput}
              disabled={!movieId}
              onFocus={() => setShowCinemaDropdown(true)}
              onChange={(e) => {
                setCinemaInput(e.target.value);
                setShowCinemaDropdown(true);
              }}
            />
            <span style={styles.arrow}>▼</span>
          </div>

          {showCinemaDropdown && cinemaInput && (
            <div style={styles.dropdown}>
              {filteredCinemas.map((c) => (
                <div
                  key={c.id}
                  style={styles.option}
                  onClick={() => {
                    setCinemaId(c.id);
                    setCinemaInput(c.cinemaName);
                    setShowCinemaDropdown(false);
                  }}
                >
                  🏬 {c.cinemaName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATE */}
        <div style={styles.dateWrapper}>
          <div style={styles.inputWrapper}>
            <input
              placeholder="Chọn ngày chiếu"
              value={date}
              readOnly
              style={styles.input}
            />
            <button style={styles.iconBtn} onClick={() => setCalendarOpen(!calendarOpen)}>
              📅
            </button>
          </div>

          {calendarOpen && (
            <div style={styles.calendarPopup}>
              <Calendar
                onChange={(value) => {
                  setDate(moment(value).format("YYYY-MM-DD"));
                  setCalendarOpen(false);
                }}
                value={date ? new Date(date) : new Date()}
                tileDisabled={isTileDisabled}
                tileClassName={tileClassName}
              />
            </div>
          )}
        </div>

        {/* SHOWTIME */}
        <div style={styles.card}>
          <select
            style={styles.input}
            value={showtimeId || ""}
            onChange={(e) => setShowtimeId(Number(e.target.value))}
          >
            <option value="">⏰ Chọn suất chiếu</option>
            {showtimes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.startTime}
              </option>
            ))}
          </select>
        </div>

        {/* SEATS */}
        <h3>🪑 Chọn ghế</h3>

        <div style={styles.seatGrid}>
          {seats.map((seat) => {
            const isBooked = seat.status === "booked";
            const isSelected = selectedSeats.includes(seat.seatId);

            return (
              <div
                key={seat.seatId}
                onClick={() => {
                  if (isBooked) return;

                  setSelectedSeats((prev) =>
                    prev.includes(seat.seatId)
                      ? prev.filter((s) => s !== seat.seatId)
                      : [...prev, seat.seatId]
                  );
                }}
                style={{
                  ...styles.seat,
                  background: isBooked
                    ? "#ef4444"
                    : isSelected
                    ? "#22c55e"
                    : "#fff",
                }}
              >
                {seat.seatRow}
                {seat.seatNumber}
              </div>
            );
          })}
        </div>

        {/* TOTAL */}
        <div style={styles.footer}>
          <h3>Tổng: {total.toLocaleString()} VND</h3>

          <button style={styles.btn} onClick={handleBooking}>
            Thanh toán
          </button>
        </div>
      </div>
    </PublicLayout>
  );
}

export default Booking;

/* ================= STYLES ================= */
const styles = {
  wrapper: {
    background: "#0b0b0f",
    minHeight: "100vh",
    padding: "40px 120px",
    color: "#fff",
  },

  title: { fontSize: "28px", marginBottom: "20px" },

  movieCard: {
    display: "flex",
    gap: "20px",
    background: "#18181b",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
  },

  poster: { width: "140px", borderRadius: "12px" },

  tag: { color: "#facc15" },

  card: { marginBottom: "15px", position: "relative" },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  input: {
    width: "100%",
    padding: "12px 36px 12px 14px",
    borderRadius: "12px",
    border: "1px solid #2a2a2a",
    background: "#18181b",
    color: "#fff",
  },

  arrow: {
    position: "absolute",
    right: "12px",
    color: "#aaa",
    pointerEvents: "none",
  },

  dropdown: {
    position: "absolute",
    background: "#18181b",
    width: "100%",
    borderRadius: "12px",
    marginTop: "6px",
    border: "1px solid #2a2a2a",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
    zIndex: 10,
  },

  option: {
    padding: "12px",
    cursor: "pointer",
    borderBottom: "1px solid #2a2a2a",
  },

  seatGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(10, 40px)",
    gap: "10px",
    marginTop: "15px",
  },

  seat: {
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    cursor: "pointer",
  },

  footer: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "space-between",
  },

  btn: {
    padding: "12px 20px",
    background: "#ef4444",
    border: "none",
    color: "#fff",
    borderRadius: "10px",
  },

  dateWrapper: { position: "relative", width: "320px" },

  iconBtn: {
    position: "absolute",
    right: "10px",
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  calendarPopup: {
    position: "absolute",
    top: "50px",
    zIndex: 100,
    background: "#111",
    padding: "10px",
    borderRadius: "12px",
  },
};