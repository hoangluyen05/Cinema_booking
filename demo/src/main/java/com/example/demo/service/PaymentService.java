package com.example.demo.service;

import com.example.demo.entity.Booking;
import com.example.demo.entity.Ticket;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.TicketRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.*;

@Service
public class PaymentService {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private TicketRepository ticketRepo;

    // PAYOS KEY
    private final String CLIENT_ID = "c4590c7a-47c7-4e7e-b1b6-525cb9ce71d8";
    private final String API_KEY = "8c4dbf36-6d23-47ef-ad77-35be40b4a355";
    private final String CHECKSUM_KEY = "1d68bd16504b236b9eb05182efba1eefdec1de9d701394ac613eee782a28e177";

    private final String PAYOS_URL =
            "https://api-merchant.payos.vn/v2/payment-requests";

    // =====================================================
    // CREATE PAYMENT
    // =====================================================
    public Map<String, Object> createPayment(Long bookingId) {

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        try {

            RestTemplate restTemplate = new RestTemplate();

            int price = booking.getTotal_price().intValue();

            long orderCode =
                    bookingId;

           String frontendUrl = "http://localhost:3000"; 

// 2. Tạo returnUrl trỏ thẳng về trang chi tiết sách kèm theo ID
String returnUrl = frontendUrl + "/account";
String cancelUrl = frontendUrl + "/account" ;


            Map<String, Object> body = new HashMap<>();
            body.put("orderCode", orderCode);
            body.put("amount", price);
            body.put("description", "BOOKING_" + bookingId);
            body.put("returnUrl", returnUrl);
            body.put("cancelUrl", cancelUrl);

            body.put("buyerName", "User");
            body.put("buyerEmail", "user@gmail.com");
            body.put("buyerPhone", "0900000000");

            body.put("expiredAt",
                    (System.currentTimeMillis() / 1000L) + 3600);

            String signature = generateSignature(
                    price,
                    cancelUrl,
                    "BOOKING_" + bookingId,
                    orderCode,
                    returnUrl
            );

            body.put("signature", signature);

            Map<String, Object> item = new HashMap<>();
            item.put("name", "Movie Tickets");
            item.put("quantity", 1);
            item.put("price", price);

            body.put("items", List.of(item));

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-client-id", CLIENT_ID);
            headers.set("x-api-key", API_KEY);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            PAYOS_URL,
                            request,
                            Map.class
                    );

            Map<String, Object> res = response.getBody();
            System.out.println("PAYOS RESPONSE: " + res); // 👈 thêm dòng này

if (res == null || res.get("data") == null) {
    return Map.of(
        "error", "PayOS error",
        "response", res
    );
}
            Map<String, Object> data =
                    (Map<String, Object>) res.get("data");

            return Map.of(
                    "checkoutUrl",
                    data.get("checkoutUrl")
            );

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage());
        }
    }

    // =====================================================
    // WEBHOOK
    // =====================================================
    public String webhook(Map<String, Object> body) {

    try {

        System.out.println("WEBHOOK CALLED: " + body);

        if (body == null) return "BODY NULL";

        Object dataObj = body.get("data");

        if (!(dataObj instanceof Map)) {
            System.out.println("INVALID DATA");
            return "INVALID";
        }

        Map<String, Object> data = (Map<String, Object>) dataObj;

        System.out.println("DATA: " + data);

        Long orderCode =
                Long.valueOf(data.get("orderCode").toString());

        Long bookingId = orderCode;

        System.out.println("BOOKING ID: " + bookingId);

        Object codeObj = data.get("code");

        if (codeObj == null) {
            System.out.println("NO CODE FIELD");
            return "INVALID";
        }

        String code = codeObj.toString();

        System.out.println("PAYMENT CODE: " + code);

        Optional<Booking> optional =
                bookingRepo.findById(bookingId);

        if (optional.isEmpty()) {
            System.out.println("BOOKING NOT FOUND");
            return "NOT FOUND";
        }

        Booking booking = optional.get();

        if ("00".equals(code)) {

            System.out.println("PAYMENT SUCCESS");

            booking.setStatus("paid");

            List<Ticket> tickets =
                    ticketRepo.findByBookingId(bookingId);

            for (Ticket t : tickets) {
                t.setStatus("booked");
            }

            ticketRepo.saveAll(tickets);

        } else {
            System.out.println("PAYMENT FAILED");
            booking.setStatus("cancelled");
        }

        bookingRepo.save(booking);

        return "OK";

    } catch (Exception e) {
        e.printStackTrace(); // 👈 QUAN TRỌNG
        return "ERROR";
    }
}

    // =====================================================
    // SIGNATURE
    // =====================================================
    private String generateSignature(
            int amount,
            String cancelUrl,
            String description,
            long orderCode,
            String returnUrl
    ) throws Exception {

        String rawData =
                "amount=" + amount +
                "&cancelUrl=" + cancelUrl +
                "&description=" + description +
                "&orderCode=" + orderCode +
                "&returnUrl=" + returnUrl;

        return hmacSHA256(rawData, CHECKSUM_KEY);
    }

    private String hmacSHA256(String data, String key)
            throws Exception {

        Mac mac = Mac.getInstance("HmacSHA256");

        SecretKeySpec secretKey =
                new SecretKeySpec(
                        key.getBytes(),
                        "HmacSHA256"
                );

        mac.init(secretKey);

        byte[] raw =
                mac.doFinal(data.getBytes());

        StringBuilder hex = new StringBuilder();

        for (byte b : raw) {
            String s = Integer.toHexString(0xff & b);
            if (s.length() == 1) hex.append('0');
            hex.append(s);
        }

        return hex.toString();
    }
}


// cd C:\Users\laptop\Downloads
//.\ngrok.exe http 8080
// .\gradlew bootRun