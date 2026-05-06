package backend.service;

import backend.entity.Order;
import backend.entity.Payment;
import backend.enums.PaymentMethod;
import backend.enums.StatusPayment;
import backend.repository.OrderRepository;
import backend.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class PaymentService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private PaymentRepository paymentRepo;

    
    private final String CLIENT_ID = "c4590c7a-47c7-4e7e-b1b6-525cb9ce71d8";
    private final String API_KEY = "8c4dbf36-6d23-47ef-ad77-35be40b4a355";
    private final String CHECKSUM_KEY = "1d68bd16504b236b9eb05182efba1eefdec1de9d701394ac613eee782a28e177";

    private final String PAYOS_URL = "https://api-merchant.payos.vn/v2/payment-requests";

    
    
    
    public Map<String, Object> createPayOSPayment(Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = paymentRepo.findByOrder_Id(orderId)
                .orElseGet(() -> paymentRepo.save(
                        Payment.builder()
                                .order(order)
                                .paymentMethod(PaymentMethod.PAYOS)
                                .status(StatusPayment.PENDING)
                                .build()
                ));

        try {
            RestTemplate restTemplate = new RestTemplate();

            int price = order.getPrice().intValueExact();

            
            long orderCode = orderId;

            
             String frontendUrl = "http://localhost:3000"; 

            Long bookId = order.getBook().getId();

            String returnUrl = frontendUrl + "/book-detail/" + bookId;
            String cancelUrl = frontendUrl + "/book-detail/" + bookId;

            Map<String, Object> body = new HashMap<>();
            body.put("orderCode", orderCode);
            body.put("amount", price);
            body.put("description", "ORDER_" + orderId);
            body.put("returnUrl", returnUrl);
            body.put("cancelUrl", cancelUrl);

            body.put("buyerName", "Hoang");
            body.put("buyerEmail", "hoang@gmail.com");
            body.put("buyerPhone", "0900000001");

            body.put("expiredAt", (System.currentTimeMillis() / 1000L) + 3600);

            
            String signature = generateSignature(
                    price,
                    cancelUrl,
                    "ORDER_" + orderId,
                    orderCode,
                    returnUrl
            );

            body.put("signature", signature);

            
            Map<String, Object> item = new HashMap<>();
            item.put("name", "Book");
            item.put("quantity", 1);
            item.put("price", price);

            body.put("items", List.of(item));

            
            System.out.println("SIGNATURE: " + signature);
            System.out.println("FINAL BODY: " + body);

            HttpHeaders headers = new HttpHeaders();
            headers.set("x-client-id", CLIENT_ID);
            headers.set("x-api-key", API_KEY);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    PAYOS_URL,
                    request,
                    Map.class
            );

            Map<String, Object> res = response.getBody();

            System.out.println("PAYOS RESPONSE: " + res);

            if (res == null || !"00".equals(String.valueOf(res.get("code")))) {
                return Map.of("error", res);
            }

            Map<String, Object> data = (Map<String, Object>) res.get("data");

            return Map.of("checkoutUrl", data.get("checkoutUrl"));

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", e.getMessage());
        }
    }

    
    
    
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

        System.out.println("RAW SIGN DATA: " + rawData);

        return hmacSHA256(rawData, CHECKSUM_KEY);
    }

    
    
    
    private String hmacSHA256(String data, String key) throws Exception {
    Mac mac = Mac.getInstance("HmacSHA256");

    SecretKeySpec secretKey = new SecretKeySpec(
            key.getBytes(StandardCharsets.UTF_8),
            "HmacSHA256"
    );

    mac.init(secretKey);

    byte[] rawHmac = mac.doFinal(
            data.getBytes(StandardCharsets.UTF_8)
    );

    
    StringBuilder hex = new StringBuilder(2 * rawHmac.length);
    for (byte b : rawHmac) {
        String s = Integer.toHexString(0xff & b);
        if (s.length() == 1) hex.append('0');
        hex.append(s);
    }

    return hex.toString(); 
}

    
    
    
    public String handlePayOSWebhook(Map<String, Object> body) {

        try {
            Map<String, Object> data = (Map<String, Object>) body.get("data");

            Long orderCode = Long.valueOf(data.get("orderCode").toString());
            String code = data.get("code").toString();

            
            Long orderId = orderCode;

            Payment payment = paymentRepo.findByOrder_Id(orderId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            Order order = payment.getOrder();

            if ("00".equals(code)) {
    payment.setStatus(StatusPayment.SUCCESS);
    order.setStatus(backend.enums.StatusOrder.PAID);
} else {
    payment.setStatus(StatusPayment.FAILED);
}

            paymentRepo.save(payment);
            orderRepo.save(order);

            System.out.println("WEBHOOK SUCCESS");

            return "OK";

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR";
        }
    }

    
    
    
    public Map<String, Object> getPaymentStatus(Long orderId) {

        Payment payment = paymentRepo.findByOrder_Id(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return Map.of(
                "orderId", orderId,
                "paymentStatus", payment.getStatus().name(),
                "orderStatus", payment.getOrder().getStatus().name()
        );
    }
}
