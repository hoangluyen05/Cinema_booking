import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      // 🔥 đọc text trước (tránh lỗi JSON)
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: true, message: text }; // backend trả string
      }

      if (!res.ok || data.success === false) {
        alert(data.message || "Đăng ký thất bại!");
        return;
      }

      alert(data.message || "Đăng ký thành công!");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>ĐĂNG KÝ</h2>

          <input
            type="text"
            placeholder="Họ và tên"
            style={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            style={styles.button}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Đã có tài khoản?{" "}
            <span
              style={styles.link}
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </span>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

/* ================= STYLE ================= */

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "80px 0",
  },
  card: {
    background: "#1c1c1c",
    padding: "40px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 0 20px rgba(229,9,20,0.4)",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#e50914",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #444",
    background: "#2a2a2a",
    color: "white",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#e50914",
    border: "none",
    borderRadius: "5px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  link: {
    color: "#e50914",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Register;