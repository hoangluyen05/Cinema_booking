import { useState, useEffect } from "react";

const StaffScanTicket = () => {
  const [activeTab, setActiveTab] = useState("scan"); // mặc định tab soát vé
  const [tickets, setTickets] = useState([]); // tất cả tickets
  const [selectedTickets, setSelectedTickets] = useState([]); // tickets tìm theo booking
  const [code, setCode] = useState("");

  // ========= LẤY DANH SÁCH VÉ =========
  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tickets");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy danh sách vé!");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ========= SEARCH VÉ THEO MÃ BOOKING =========
  const handleSearch = async () => {
    if (!code) return;
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/code/${code}`);
      if (!res.ok) {
        alert("Không tìm thấy booking!");
        setSelectedTickets([]);
        return;
      }
      const bookingData = await res.json();
      if (!bookingData.tickets || bookingData.tickets.length === 0) {
        alert("Booking không có vé!");
        setSelectedTickets([]);
        return;
      }
      setSelectedTickets(bookingData.tickets);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tìm booking!");
      setSelectedTickets([]);
    }
  };

  // ========= CHECK-IN VÉ =========
  const handleCheckIn = async (ticket) => {
    try {
      await fetch(`http://localhost:8080/api/bookings/checkin/${ticket.code}`, {
        method: "PUT",
      });
      alert("Check-in thành công!");
      // update state
      setSelectedTickets(
        selectedTickets.map((t) =>
          t.code === ticket.code ? { ...t, checked: true } : t
        )
      );
      setTickets(
        tickets.map((t) =>
          t.code === ticket.code ? { ...t, checked: true } : t
        )
      );
    } catch (err) {
      console.error(err);
      alert("Check-in thất bại!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "black", padding: "40px" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          background: "linear-gradient(to right, #0f172a, #020617)",
          padding: "30px",
          borderRadius: "20px",
          color: "white",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Quản lý vé & Soát vé</h2>

        {/* TAB BUTTON */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("scan")}
            style={activeTab === "scan" ? activeBtn : normalBtn}
          >
            Soát vé
          </button>

          <button
            onClick={() => setActiveTab("list")}
            style={activeTab === "list" ? activeBtn : normalBtn}
          >
            Danh sách vé
          </button>
        </div>

        {/* TAB SOÁT VÉ */}
        {activeTab === "scan" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Nhập mã booking"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={inputStyle}
              />
              <button style={btnStyle} onClick={handleSearch}>
                Kiểm tra
              </button>
            </div>

            {selectedTickets.length > 0 && (
              <div style={detailCard}>
                <h3>Mã booking {code}</h3>
                {selectedTickets.map((t) => (
                  <div key={t.code} style={{ marginBottom: "15px" }}>
                    <p><b>Mã vé:</b> {t.code}</p>
                    <p><b>Phim:</b> {t.movie}</p>
                    <p><b>Ghế:</b> {t.seats}</p>
                    <p>
                      <b>Trạng thái:</b>{" "}
                      <span style={{ color: t.checked ? "#22c55e" : "#facc15" }}>
                        {t.checked ? "Đã check-in" : "Chưa check-in"}
                      </span>
                    </p>
                    {!t.checked && (
                      <button style={btnStyle} onClick={() => handleCheckIn(t)}>
                        Check-in
                      </button>
                    )}
                    <hr style={{ borderColor: "#333" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB DANH SÁCH VÉ */}
        {activeTab === "list" && (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ color: "red", textAlign: "center" }}>
                  <th style={thStyle}>Mã vé</th>
                  <th style={thStyle}>Phim</th>
                  <th style={thStyle}>Ghế</th>
                  <th style={thStyle}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length > 0 ? (
                  tickets.map((t, i) => (
                    <tr
                      key={i}
                      style={{
                        textAlign: "center",
                        cursor: "pointer",
                        background: selectedTickets.some(st => st.code === t.code) ? "#334155" : "transparent",
                      }}
                      onClick={() => setSelectedTickets([t])}
                    >
                      <td style={tdStyle}>{t.code}</td>
                      <td style={tdStyle}>{t.movie}</td>
                      <td style={tdStyle}>{t.seats}</td>
                      <td style={{ ...tdStyle, color: t.checked ? "#22c55e" : "#facc15" }}>
                        {t.checked ? "Đã check-in" : "Chưa check-in"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================== STYLE ================== */
const inputStyle = {
  padding: "10px",
  borderRadius: "10px",
  width: "70%",
  marginRight: "10px",
};

const btnStyle = {
  background: "red",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
};

const detailCard = {
  background: "#0b1220",
  padding: "25px",
  borderRadius: "15px",
  marginTop: "20px",
  boxShadow: "0 0 30px rgba(255,0,0,0.3)",
};

const thStyle = { padding: "10px", borderBottom: "1px solid #333" };
const tdStyle = { padding: "12px", borderBottom: "1px solid #222" };

const activeBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "10px 20px",
  marginRight: "10px",
  cursor: "pointer",
};

const normalBtn = {
  background: "#1f2937",
  color: "white",
  border: "1px solid #555",
  padding: "10px 20px",
  marginRight: "10px",
  cursor: "pointer",
};

export default StaffScanTicket;