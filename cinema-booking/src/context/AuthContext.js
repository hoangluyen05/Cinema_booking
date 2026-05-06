import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API = "http://localhost:8080/api";

export const AuthProvider = ({ children }) => {

  // 🔥 load user ngay từ localStorage (fix logout khi reload)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [tickets, setTickets] = useState([]);

  /* =========================
     LOAD TICKETS
  ========================== */
  useEffect(() => {
    if (user?.id) {
      fetchTickets(user.id);
    }
  }, [user]);

  /* =========================
     BOOKING HISTORY
  ========================== */
  const fetchTickets = async (userId) => {
    try {
      const res = await fetch(`${API}/bookings/user/${userId}`);
      const bookings = await res.json();

      const mapped = bookings.map((b) => ({
        code: b.bookingId,
        movie: b.movieName,
        cinema: b.cinemaName,
        showtime: b.startTime,
        seats: b.seats,
        date: b.showDate,
        total: b.totalPrice,
      }));

      setTickets(mapped);
    } catch (err) {
      console.error("Lỗi fetch tickets:", err);
    }
  };

  /* =========================
     LOGOUT
  ========================== */
  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    setUser(null);
    setTickets([]);
    localStorage.removeItem("user");
  };

  /* =========================
     UPDATE PROFILE
  ========================== */
  const updateProfile = async (data) => {
    try {
      await fetch(`${API}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: data.name,
          email: data.email,
        }),
      });

      alert("Cập nhật thành công!");

      // update localStorage luôn
      const updatedUser = {
        ...user,
        fullName: data.name,
        email: data.email,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (err) {
      alert("Lỗi cập nhật!");
    }
  };

  /* =========================
     CHANGE PASSWORD
  ========================== */
  const changePassword = async (oldPass, newPass) => {
    try {
      const res = await fetch(`${API}/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: oldPass,
          newPassword: newPass,
        }),
      });

      if (res.ok) {
        alert("Đổi mật khẩu thành công!");
        return true;
      } else {
        alert("Mật khẩu cũ không đúng!");
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  /* =========================
     CANCEL BOOKING
  ========================== */
  const cancelTicket = async (bookingId) => {
    try {
      await fetch(`${API}/bookings/cancel/${bookingId}`, {
        method: "PUT",
      });

      alert("Hủy vé thành công!");
      fetchTickets(user.id);
    } catch (err) {
      alert("Hủy vé thất bại!");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        tickets,
        logout,
        updateProfile,
        changePassword,
        cancelTicket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);