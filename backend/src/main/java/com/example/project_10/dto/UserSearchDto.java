package com.example.project_10.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchDto {
    private Long id;
    private String nickname;
    private String name;
    private String surname;
    // ZAMERNE bez emailu a hesla!
}
