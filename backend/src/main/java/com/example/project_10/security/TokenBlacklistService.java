package com.example.project_10.security;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Map<String, Date> blacklist = new ConcurrentHashMap<>();

    public void blacklist(String token, Date expiration) {
        blacklist.put(token, expiration);
    }

    public boolean isBlacklisted(String token) {
        Date exp = blacklist.get(token);
        if (exp == null) {
            return false;
        }
        if (exp.before(new Date())) {
            blacklist.remove(token);
            return false;
        }
        return true;
    }
}
