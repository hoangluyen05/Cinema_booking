import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PublicLayout from "../../layouts/PublicLayout";

function Movies() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [nowShowing, setNowShowing] = useState([]);   // 🔥 từ API
  const [comingSoon, setComingSoon] = useState([]);   // 🔥 từ API

  /* ================= FETCH API ================= */
  useEffect(() => {
    fetchNowShowing();
    fetchComingSoon();
  }, []);

  const fetchNowShowing = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/movies/now-showing"
      );
      const data = await res.json();

      // 🔥 fix lỗi map
      setNowShowing(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi lấy phim đang chiếu:", err);
      setNowShowing([]);
    }
  };

  const fetchComingSoon = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/movies/coming-soon"
      );
      const data = await res.json();

      setComingSoon(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi lấy phim sắp chiếu:", err);
      setComingSoon([]);
    }
  };

  /* ================= BOOKING ================= */
  const handleBooking = (movieId) => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt vé!");
      navigate("/login");
      return;
    }

    if (user.role !== "user") {
      alert("Chỉ khách hàng mới được đặt vé!");
      return;
    }

    navigate(`/booking/${movieId}`);
  };

  /* ================= SEARCH ================= */
  const filterMovies = (list) =>
    list.filter((movie) =>
      movie.title?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <PublicLayout>
      <div style={styles.section}>
        {/* SEARCH */}
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm phim..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* PHIM ĐANG CHIẾU */}
        <h2 style={styles.title}>🎬 Phim đang chiếu</h2>

        <div style={styles.grid}>
          {filterMovies(nowShowing).map((movie) => (
            <div key={movie.id} style={styles.card}>
              <img
                src={movie.poster}   // 🔥 đổi image -> poster
                alt={movie.title}
                style={styles.poster}
              />
              <h4 style={styles.movieTitle}>{movie.title}</h4>
              <p style={styles.genre}>{movie.genre}</p>

              <div style={styles.buttonGroup}>
                <button
                  style={styles.detailBtn}
                  onClick={() =>
                    navigate(`/movies/${movie.id}`, {
                      state: movie,
                    })
                  }
                >
                  Chi tiết
                </button>

                <button
                  style={styles.bookingBtn}
                  onClick={() => handleBooking(movie.id)}
                >
                  Đặt vé
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PHIM SẮP CHIẾU */}
        <h2 style={{ ...styles.title, marginTop: "60px" }}>
          🎥 Phim sắp chiếu
        </h2>

        <div style={styles.grid}>
          {filterMovies(comingSoon).map((movie) => (
            <div key={movie.id} style={styles.card}>
              <img
                src={movie.poster}
                alt={movie.title}
                style={styles.poster}
              />
              <h4 style={styles.movieTitle}>{movie.title}</h4>
              <p style={styles.genre}>{movie.genre}</p>

              <div style={styles.buttonGroup}>
                <button
                  style={styles.detailBtn}
                  onClick={() =>
                    navigate(`/movies/${movie.id}`, {
                      state: movie,
                    })
                  }
                >
                  Chi tiết
                </button>

                <button style={styles.comingBtn}>
                  Sắp ra mắt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

/* ================= STYLE ================= */

const styles = {
  section: {
    padding: "40px 60px",
    background: "#111",
    minHeight: "100vh",
    color: "white",
  },

  searchWrapper: {
    textAlign: "center",
    marginBottom: "40px",
  },

  searchInput: {
    width: "400px",
    padding: "12px 20px",
    borderRadius: "25px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  title: {
    borderLeft: "5px solid #e50914",
    paddingLeft: "15px",
    marginBottom: "30px",
    fontSize: "22px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 260px))",
    justifyContent: "start",
    gap: "30px",
  },

  card: {
    background: "#1c1c1c",
    padding: "15px",
    borderRadius: "15px",
    textAlign: "center",
    transition: "0.3s",
    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },

  poster: {
    width: "100%",
    height: "350px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "15px",
  },

  movieTitle: {
    margin: "10px 0 5px",
  },

  genre: {
    color: "#bbb",
    marginBottom: "15px",
  },

  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },

  detailBtn: {
    padding: "8px 12px",
    background: "#444",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  bookingBtn: {
    padding: "8px 12px",
    background: "#e50914",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  comingBtn: {
    padding: "8px 12px",
    background: "#555",
    border: "none",
    borderRadius: "6px",
    color: "#ccc",
    cursor: "not-allowed",
  },
};

export default Movies;