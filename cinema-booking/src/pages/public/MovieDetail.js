import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PublicLayout from "../../layouts/PublicLayout";

function MovieDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(location.state || null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH API ================= */
  useEffect(() => {
    // Nếu đã có state thì không cần gọi API
    if (location.state) return;

    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/movies/${id}`
      );

      if (!res.ok) throw new Error("Không tìm thấy phim");

      const data = await res.json();
      setMovie(data);
    } catch (err) {
      console.error(err);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <PublicLayout>
        <div style={styles.wrapper}>
          <h2 style={{ color: "white" }}>Đang tải...</h2>
        </div>
      </PublicLayout>
    );
  }

  if (!movie) {
    return (
      <PublicLayout>
        <div style={styles.wrapper}>
          <h2 style={{ color: "white" }}>
            Không tìm thấy phim.
          </h2>
          <button
            style={styles.btn}
            onClick={() => navigate("/movies")}
          >
            Quay lại
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <img
            src={movie.poster} // 🔥 backend dùng poster
            alt={movie.title}
            style={styles.poster}
          />

          <div style={styles.info}>
            <h2 style={styles.title}>{movie.title}</h2>

            <p style={styles.text}>
              <strong>Thể loại:</strong> {movie.genre}
            </p>

            <p style={styles.text}>
              <strong>Mô tả:</strong> {movie.description}
            </p>
            <p style={styles.text}>
              <strong>Thời lượng:</strong> {movie.duration} phút
            </p>
            <button
  style={styles.btn}
  onClick={() =>
    navigate(`/booking/${id}`, {
      state: { movie }
    })
  }
>
  Đặt vé ngay
</button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    backgroundColor: "#000",
    minHeight: "100vh",
    padding: "40px 80px",
  },
  card: {
    display: "flex",
    gap: "40px",
    backgroundColor: "#2f2f2f",
    borderRadius: "20px",
    padding: "30px",
  },
  poster: {
    width: "320px",
    borderRadius: "15px",
  },
  info: {
    flex: 1,
    color: "white",
  },
  title: {
    marginBottom: "20px",
  },
  text: {
    marginBottom: "10px",
    fontSize: "14px",
    color: "#ddd",
  },
  btn: {
    marginTop: "25px",
    padding: "12px 25px",
    background: "#e50914",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default MovieDetail;