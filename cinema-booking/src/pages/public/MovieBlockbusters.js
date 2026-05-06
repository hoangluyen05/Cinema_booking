import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PublicLayout from "../../layouts/PublicLayout";

function MovieBlockbuster() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);

  useEffect(() => {
    fetchNowShowing();
    fetchComingSoon();
  }, []);

  const fetchNowShowing = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/movies/blockbusters/now-showing"
      );
      const data = await res.json();
      setNowShowing(Array.isArray(data) ? data : []);
    } catch (err) {
      setNowShowing([]);
    }
  };

  const fetchComingSoon = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/movies/blockbusters/coming-soon"
      );
      const data = await res.json();
      setComingSoon(Array.isArray(data) ? data : []);
    } catch (err) {
      setComingSoon([]);
    }
  };

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

  const filterMovies = (list) =>
    list.filter((movie) =>
      movie.title?.toLowerCase().includes(search.toLowerCase())
    );

  const MovieRow = ({ title, list }) => (
    <>
      <h2 style={styles.title}>{title}</h2>

      <div style={styles.horizontalScroll}>
        {filterMovies(list).map((movie) => (
          <div key={movie.id} style={styles.card}>
            <img src={movie.poster} alt={movie.title} style={styles.poster} />

            <h4 style={styles.movieTitle}>{movie.title}</h4>
            <p style={styles.genre}>{movie.genre}</p>

            <div style={styles.buttonGroup}>
              <button
                style={styles.detailBtn}
                onClick={() =>
                  navigate(`/movies/${movie.id}`, { state: movie })
                }
              >
                Chi tiết
              </button>

              {title.includes("đang chiếu") ? (
                <button
                  style={styles.bookingBtn}
                  onClick={() => handleBooking(movie.id)}
                >
                  Đặt vé
                </button>
              ) : (
                <button style={styles.comingBtn}>Sắp ra mắt</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
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

        <MovieRow title="🎬 Phim đang chiếu" list={nowShowing} />
        <MovieRow title="🎥 Phim sắp chiếu" list={comingSoon} />
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
  },

  title: {
    borderLeft: "5px solid #e50914",
    paddingLeft: "15px",
    margin: "30px 0 20px",
    fontSize: "22px",
  },

  /* 🔥 SCROLL NGANG */
  horizontalScroll: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "15px",
    scrollBehavior: "smooth",
  },

  card: {
    minWidth: "220px",
    background: "#1c1c1c",
    padding: "15px",
    borderRadius: "15px",
    textAlign: "center",
    flexShrink: 0,
    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
  },

  poster: {
    width: "100%",
    height: "320px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "10px",
  },

  movieTitle: {
    margin: "8px 0 5px",
  },

  genre: {
    color: "#bbb",
    marginBottom: "10px",
  },

  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },

  detailBtn: {
    padding: "6px 10px",
    background: "#444",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  bookingBtn: {
    padding: "6px 10px",
    background: "#e50914",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  comingBtn: {
    padding: "6px 10px",
    background: "#555",
    border: "none",
    borderRadius: "6px",
    color: "#ccc",
    cursor: "not-allowed",
  },
};

export default MovieBlockbuster;