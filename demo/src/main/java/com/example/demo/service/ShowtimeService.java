package com.example.demo.service;

import com.example.demo.entity.Movie;
import com.example.demo.entity.Room;
import com.example.demo.entity.Showtime;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.dto.CreateShowtimeRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepo;
    private final RoomRepository roomRepo;

    public ShowtimeService(ShowtimeRepository showtimeRepository,
                           MovieRepository movieRepo,
                           RoomRepository roomRepo) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepo = movieRepo;
        this.roomRepo = roomRepo;
    }

    public List<Showtime> getShowtimeByMovie(Long movieId){
        return showtimeRepository.findByMovieId(movieId);
    }

   public List<Showtime> getShowtimes(Long movieId, Long cinemaId, LocalDate date) {
    return showtimeRepository.findShowtimes(movieId, cinemaId, date);
}

    // =========================
    // 🧠 TÍNH END TIME
    // =========================
    public LocalDateTime calculateEndTime(LocalDateTime start, int duration) {

        if (duration <= 0) {
            throw new RuntimeException("Duration không hợp lệ");
        }

        LocalDateTime end = start.plusMinutes(duration + 30);

        if (end.getMinute() > 0) {
            end = end.plusHours(1)
                     .withMinute(0)
                     .withSecond(0)
                     .withNano(0);
        }

        return end;
    }

    // =========================
    // ➕ CREATE
    // =========================
    public Showtime createShowtime(CreateShowtimeRequest req) {

        // 🔥 VALIDATE REQUEST
        if (req.getMovieId() == null || req.getRoomId() == null) {
            throw new RuntimeException("Thiếu movieId hoặc roomId");
        }

        if (req.getShowDate() == null || req.getStartTime() == null) {
            throw new RuntimeException("Thiếu ngày hoặc giờ chiếu");
        }

        Movie movie = movieRepo.findById(req.getMovieId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim"));

        Room room = roomRepo.findById(req.getRoomId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));

        if (movie.getDuration() == null) {
            throw new RuntimeException("Phim chưa có duration");
        }

        LocalDateTime start = LocalDateTime.of(req.getShowDate(), req.getStartTime());
        LocalDateTime end = calculateEndTime(start, movie.getDuration());

        // 🔥 CHECK TRÙNG
        // lấy cinemaId từ room
Long cinemaId = room.getCinemaId();

// lấy tất cả showtime trong cùng phòng (hoặc có thể mở rộng theo cinema nếu muốn tối ưu DB)
List<Showtime> list = showtimeRepository.findByRoomId(req.getRoomId());

for (Showtime s : list) {

    if (s.getShowDate() == null || s.getStartTime() == null || s.getEndTime() == null) {
        continue;
    }

    // chỉ check cùng rạp
    Room existingRoom = roomRepo.findById(s.getRoomId())
            .orElse(null);

    if (existingRoom == null) continue;

    if (!existingRoom.getCinemaId().equals(cinemaId)) {
        continue;
    }

    LocalDateTime existingStart = LocalDateTime.of(s.getShowDate(), s.getStartTime());
    LocalDateTime existingEnd = s.getEndTime();

    // ✅ LOGIC CHECK TRÙNG THỜI GIAN
    boolean overlap = start.isBefore(existingEnd) && end.isAfter(existingStart);

    if (overlap) {
        throw new RuntimeException("Lịch chiếu bị trùng trong cùng rạp và phòng!");
    }
}

        Showtime s = new Showtime();
        s.setMovieId(req.getMovieId());
        s.setRoomId(req.getRoomId());

        s.setShowDate(req.getShowDate());
        s.setStartTime(req.getStartTime());
        s.setEndTime(end);

        Double price = req.getPrice() != null ? req.getPrice() : 80000.0;
        s.setPrice(price);

        System.out.println("StartTime: " + start);
        System.out.println("EndTime: " + end);

        return showtimeRepository.save(s);
    }

    // =========================
    // ✏️ UPDATE
    // =========================
    public Showtime updateShowtime(Long id, CreateShowtimeRequest req) {

        Showtime existing = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch chiếu"));

        if (req.getShowDate() == null || req.getStartTime() == null) {
            throw new RuntimeException("Thiếu ngày hoặc giờ chiếu");
        }

        Movie movie = movieRepo.findById(req.getMovieId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phim"));

        LocalDateTime start = LocalDateTime.of(req.getShowDate(), req.getStartTime());
        LocalDateTime end = calculateEndTime(start, movie.getDuration());

        List<Showtime> list = showtimeRepository.findByRoomId(req.getRoomId());

        Long cinemaId = roomRepo.findById(req.getRoomId())
        .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"))
        .getCinemaId();

boolean hasConflict = list.stream().anyMatch(s -> {

    if (s.getId().equals(id)) return false;

    if (s.getShowDate() == null || s.getStartTime() == null || s.getEndTime() == null) {
        return false;
    }

    Room existingRoom = roomRepo.findById(s.getRoomId()).orElse(null);
    if (existingRoom == null) return false;

    if (!existingRoom.getCinemaId().equals(cinemaId)) {
        return false;
    }

    LocalDateTime existingStart = LocalDateTime.of(s.getShowDate(), s.getStartTime());
    LocalDateTime existingEnd = s.getEndTime();

    return start.isBefore(existingEnd) && end.isAfter(existingStart);
});
    if (hasConflict) {
    throw new RuntimeException("Lịch chiếu bị trùng trong cùng rạp và phòng!");
}

        existing.setMovieId(req.getMovieId());
        existing.setRoomId(req.getRoomId());
        existing.setShowDate(req.getShowDate());
        existing.setStartTime(req.getStartTime());
        existing.setEndTime(end);

        Double price = req.getPrice() != null ? req.getPrice() : existing.getPrice();
        existing.setPrice(price);

        return showtimeRepository.save(existing);
    }
}