package com.example.demo.repository;

import com.example.demo.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByCinemaId(Long cinemaId);
    List<Room> findByRoomNameContainingIgnoreCaseAndTotalseats(
    String roomName,
    Integer totalSeats
);
     @Query("SELECT r FROM Room r WHERE "
         + "(:roomName IS NULL OR LOWER(r.roomName) LIKE %:roomName%) "
         + "AND (:totalseats IS NULL OR r.totalseats = :totalseats)")
    List<Room> searchRooms(@Param("roomName") String roomName,
                           @Param("totalseats") Integer totalseats);
}