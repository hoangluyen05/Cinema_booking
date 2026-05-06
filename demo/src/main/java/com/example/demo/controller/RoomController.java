package com.example.demo.controller;

import com.example.demo.dto.RoomDTO;
import com.example.demo.entity.Cinema;
import com.example.demo.entity.Room;
import com.example.demo.repository.CinemaRepository;
import com.example.demo.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin("*")
public class RoomController {

    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;

    public RoomController(RoomRepository roomRepository, CinemaRepository cinemaRepository) {
        this.roomRepository = roomRepository;
        this.cinemaRepository = cinemaRepository;
    }

    
    @GetMapping("/cinema/{cinemaId:\\d+}")
    public List<Room> getRoomsByCinema(@PathVariable Long cinemaId){
        return roomRepository.findByCinemaId(cinemaId);
}
    @PostMapping
    public Room create(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    @DeleteMapping("/{id:\\d+}")
    public void delete(@PathVariable Long id) {
        roomRepository.deleteById(id);
    }
    @PutMapping("/{id:\\d+}")
    public Room update(@PathVariable Long id, @RequestBody Room room) {
    Room r = roomRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Room not found"));

    r.setRoomName(room.getRoomName());
    r.setTotalSeats(room.getTotalSeats());
    r.setCinemaId(room.getCinemaId());

    return roomRepository.save(r);
}
    @GetMapping
public List<Room> getAll(
    @RequestParam(required = false) String roomName,
    @RequestParam(required = false) Integer totalSeats
) {
    if (roomName != null || totalSeats != null) {
        return roomRepository
            .findByRoomNameContainingIgnoreCaseAndTotalseats(
                roomName == null ? "" : roomName,
                totalSeats == null ? 0 : totalSeats
            );
    }
    return roomRepository.findAll();
}
    @GetMapping("/search")
    public List<RoomDTO> searchRooms(
            @RequestParam(required = false) String roomName,
            @RequestParam(required = false) Integer totalSeats,
            @RequestParam(required = false) String cinemaName
    ) {
        // 1️⃣ Lấy danh sách room từ RoomRepository
        List<Room> rooms = roomRepository.searchRooms(
                roomName != null ? roomName.toLowerCase() : null,
                totalSeats
        );

        // 2️⃣ Map sang RoomDTO + join tên rạp
        List<RoomDTO> dtos = rooms.stream().map(r -> {
            RoomDTO dto = new RoomDTO();
            dto.setId(r.getId());
            dto.setRoomName(r.getRoomName());
            dto.setTotalSeats(r.getTotalSeats());
            dto.setCinemaId(r.getCinemaId());

            Cinema cinema = cinemaRepository.findById(r.getCinemaId()).orElse(null);
            dto.setCinemaName(cinema != null ? cinema.getCinemaName() : "Chưa có");

            return dto;
        }).collect(Collectors.toList());

        // 3️⃣ Nếu filter theo cinemaName
        if (cinemaName != null && !cinemaName.isEmpty()) {
            String lowerCinema = cinemaName.toLowerCase();
            dtos = dtos.stream()
                    .filter(d -> d.getCinemaName().toLowerCase().contains(lowerCinema))
                    .collect(Collectors.toList());
        }

        return dtos;
    }
}