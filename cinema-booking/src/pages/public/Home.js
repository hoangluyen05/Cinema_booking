import { useNavigate } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        // Phim đang chiếu
        const nowRes = await fetch("http://localhost:8080/api/movies/now-showing");
        const nowData = await nowRes.json();
        setNowShowing(Array.isArray(nowData) ? nowData : nowData.data || []);

        // Phim sắp chiếu
        const soonRes = await fetch("http://localhost:8080/api/movies/coming-soon");
        const soonData = await soonRes.json();
        setComingSoon(Array.isArray(soonData) ? soonData : soonData.data || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (loading) return <div style={{ color: "white", padding: "50px" }}>Loading movies...</div>;

  return (
    <PublicLayout>
      <div style={styles.app}>
        {/* ===== HERO ===== */}
        <div style={styles.hero}>
          <div style={styles.heroOverlay}></div>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Đặt vé xem phim trực tuyến</h1>
            <p style={styles.heroSub}>Nhanh chóng - Tiện lợi - Hiện đại</p>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/movies")}
            >
              Đặt vé ngay
            </button>
          </div>
        </div>

        {/* ===== PHIM ĐANG CHIẾU ===== */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🎬 Phim đang chiếu</h2>
          <div style={styles.movieGrid}>
            {Array.isArray(nowShowing) && nowShowing.map(movie => (
              <div
                key={movie.id}
                style={styles.card}
                onClick={() => navigate(`/movies/${movie.id}`, { state: movie })}
              >
                <img src={movie.poster} alt={movie.title} style={styles.poster} />
                <div style={styles.cardTitle}>{movie.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== PHIM SẮP CHIẾU ===== */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🎥 Phim sắp chiếu</h2>
          <div style={styles.movieGrid}>
            {Array.isArray(comingSoon) && comingSoon.map(movie => (
              <div
                key={movie.id}
                style={styles.card}
                onClick={() => navigate(`/movies/${movie.id}`, { state: movie })}
              >
                <img src={movie.poster} alt={movie.title} style={styles.poster} />
                <div style={styles.cardTitle}>{movie.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

const styles = {
  app: { backgroundColor: "#0b0f19", color: "white", minHeight: "100vh" },
  hero: {
    position: "relative",
    height: "65vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    paddingLeft: "80px",
  },
  heroOverlay: { position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)" },
  heroContent: { position: "relative", zIndex: 2 },
  heroTitle: { fontSize: "32px", marginBottom: "10px" },
  heroSub: { marginBottom: "20px", color: "#ccc" },
  primaryBtn: { backgroundColor: "#e50914", border: "none", padding: "10px 20px", borderRadius: "5px", color: "white", cursor: "pointer" },
  section: { padding: "50px 80px" },
  sectionTitle: { marginBottom: "20px", fontSize: "18px" },
  movieGrid: { display: "flex", gap: "30px", flexWrap: "wrap" },
  card: { width: "200px", cursor: "pointer", overflow: "hidden" },
  poster: { width: "100%", height: "300px", objectFit: "cover", borderRadius: "15px" },
  cardTitle: { marginTop: "10px", fontSize: "14px" },
};

export default Home;