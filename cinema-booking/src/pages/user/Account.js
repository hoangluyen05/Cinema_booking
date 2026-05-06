import { useEffect, useState } from "react";
import PublicLayout from "../../layouts/PublicLayout";

function Account() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const email = localStorage.getItem("email");

  // 🔥 CHECK LOGIN
  useEffect(() => {
    if (!email) {
      alert("Bạn chưa đăng nhập!");
      window.location.href = "/login";
    }
  }, []);

  // ================= GET USER =================
  const fetchUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/me?email=${email}`
      );

      const text = await res.text();

      if (!text) throw new Error("Không có dữ liệu");

      const data = JSON.parse(text);

      console.log("USER:", data);

      setUser(data);
      setName(data.fullName || "");
      setEmailInput(data.email || "");

    } catch (err) {
      console.error(err);
      alert("Lỗi lấy thông tin user: " + err.message);
    }
  };

  // ================= GET BOOKINGS =================
  const fetchBookings = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/user/${userId}`
      );

      const text = await res.text();

      if (!text) {
        setBookings([]);
        return;
      }

      const data = JSON.parse(text);

      console.log("BOOKINGS:", data);

      if (Array.isArray(data)) {
        setBookings(data);
      } else if (Array.isArray(data.data)) {
        setBookings(data.data);
      } else {
        setBookings([]);
      }

    } catch (err) {
      console.error(err);
      setBookings([]);
    }
  };

  useEffect(() => {
    if (email) fetchUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchBookings(user.id);
    }
  }, [user]);

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/me?email=${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: name,
            email: emailInput,
          }),
        }
      );

      const text = await res.text();
      console.log("UPDATE:", text);

      if (!res.ok) throw new Error(text);

      alert("Cập nhật thành công!");

      // 🔥 update email mới
      localStorage.setItem("email", emailInput);

      fetchUser();

    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại: " + err.message);
    }
  };

  // ================= CHANGE PASSWORD =================
  const handleChangePass = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/change-password?email=${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: oldPass,
            newPassword: newPass,
          }),
        }
      );

      const text = await res.text();
      console.log("CHANGE PASS:", text);

      if (!res.ok) throw new Error(text);

      alert("Đổi mật khẩu thành công!");

      setOldPass("");
      setNewPass("");

    } catch (err) {
      console.error(err);
      alert("Đổi mật khẩu thất bại: " + err.message);
    }
  };

  // ================= CANCEL BOOKING =================
  // const handleCancel = async (bookingId) => {
   // try {
   //   const res = await fetch(
   //     `http://localhost:8080/api/bookings/cancel/${bookingId}`,
   //     {
   //       method: "PUT",
   //     }
   //   );

     // if (!res.ok) throw new Error();

    //  alert("Hủy vé thành công!");

   //   fetchTickets(user.id);

  //  } catch (err) {
  //    console.error(err);
  //    alert("Hủy vé thất bại!");
 //   }
//  };

  return (
    <PublicLayout>
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <h2 style={styles.title}>TÀI KHOẢN CỦA BẠN</h2>

          <div style={styles.card}>
            {/* TAB */}
            <div style={styles.tabRow}>
              <button
                style={activeTab === "profile" ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab("profile")}
              >
                Thông tin cá nhân
              </button>

              <button
                style={activeTab === "password" ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab("password")}
              >
                Đổi mật khẩu
              </button>
            </div>

            {/* PROFILE */}
            {activeTab === "profile" && (
              <div style={styles.section}>
                <input
                  style={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Họ tên"
                />

                <input
                  style={styles.input}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Email"
                />

                <button style={styles.primaryBtn} onClick={handleUpdate}>
                  Lưu thay đổi
                </button>
              </div>
            )}

            {/* PASSWORD */}
            {activeTab === "password" && (
              <div style={styles.section}>
                <input
                  type="password"
                  style={styles.input}
                  placeholder="Mật khẩu cũ"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                />

                <input
                  type="password"
                  style={styles.input}
                  placeholder="Mật khẩu mới"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />

                <button style={styles.primaryBtn} onClick={handleChangePass}>
                  Đổi mật khẩu
                </button>
              </div>
            )}

            {/* HISTORY */}
            <div style={styles.historySection}>
              <h3>🎟 Lịch sử đặt vé</h3>

              {!user ? (
                <p>Đang tải...</p>
              ) : bookings.length === 0 ? (
                <p>Bạn chưa có vé nào</p>
              ) : (
                bookings
  .filter(b => b.status === "paid")
   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
  .map((booking) => (
    <div key={booking.id} style={styles.ticket}>

      <div style={styles.ticketInfo}>
        <p><b>Mã booking:</b> {booking.code}</p>

<p><b>Giờ chiếu:</b> {booking.showtime}</p>

<p><b>Tổng tiền:</b> {booking.totalPrice} VND</p>

<p><b>Thời gian đặt:</b> 
  {new Date(booking.createdAt).toLocaleString()}
</p>

<p>
  <b>Ghế:</b>{" "}
  {booking.seats?.join(", ") || "N/A"}
</p>
      </div>

    </div>
  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

const styles = {
  wrapper: { backgroundColor: "#000", minHeight: "100vh", padding: "60px 0" },
  container: { width: "900px", margin: "0 auto", color: "white" },
  title: { marginBottom: "30px", textAlign: "center", color: "#e50914" },
  card: { backgroundColor: "#0f172a", padding: "40px", borderRadius: "14px" },
  tabRow: { display: "flex", gap: "20px", marginBottom: "30px" },
  tab: { backgroundColor: "#1e293b", padding: "10px 20px", color: "white" },
  activeTab: { backgroundColor: "#e50914", padding: "10px 20px", color: "white" },
  section: { marginBottom: "40px" },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    backgroundColor: "#1e293b",
    color: "white",
  },
  primaryBtn: {
    backgroundColor: "#e50914",
    padding: "10px 20px",
    color: "white",
  },
  historySection: { marginTop: "20px" },
  ticket: {
    backgroundColor: "#1e293b",
    padding: "20px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
  ticketInfo: { lineHeight: "1.6" },
  dangerBtn: {
    backgroundColor: "#b91c1c",
    padding: "8px 16px",
    color: "white",
  },
};

export default Account;