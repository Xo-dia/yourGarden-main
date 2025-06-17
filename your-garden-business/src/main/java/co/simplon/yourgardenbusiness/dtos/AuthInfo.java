package co.simplon.yourgardenbusiness.dtos;

import java.util.List;

public record AuthInfo(String token, List<String> roles, UserDto userDto) {

    @Override
    public String toString() {
	/* return "{token=[PROTECTED]" + ", roles=" + roles + "}"; */
	return "{token=[PROTECTED]}";
    }

}
