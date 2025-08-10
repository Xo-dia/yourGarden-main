package co.simplon.yourgardenbusiness.dtos;

import java.util.List;

public record AuthInfo(String accessToken, List<String> roles, UserDto user) {

    @Override
    public String toString() {
	/* return "{accessToken=[PROTECTED]" + ", roles=" + roles + "}"; */
	return "{accessToken=[PROTECTED]}";
    }

}
