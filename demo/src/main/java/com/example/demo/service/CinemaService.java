package com.example.demo.service;

import com.example.demo.entity.Cinema;
import com.example.demo.repository.CinemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CinemaService {

    @Autowired
    private CinemaRepository cinemaRepository;

    public List<Cinema> getAll(String cinemaName, String address) {
    return cinemaRepository
        .findByCinemaNameContainingIgnoreCaseAndAddressContainingIgnoreCase(
            cinemaName == null ? "" : cinemaName,
            address == null ? "" : address
        );
}

    public Cinema save(Cinema cinema){
        return cinemaRepository.save(cinema);
    }

    public void delete(Long id){
        cinemaRepository.deleteById(id);
    }
    public List<Cinema> getCinemasByMovie(Long movieId) {
    return cinemaRepository.findCinemasByMovie(movieId);
}
    public Cinema create(Cinema cinema) {
        return cinemaRepository.save(cinema);
    }

    public Cinema update(Long id, Cinema cinema) {
        Cinema c = cinemaRepository.findById(id).orElseThrow();
        c.setCinemaName(cinema.getCinemaName());
        c.setAddress(cinema.getAddress());
        return cinemaRepository.save(c);
    }
}