package co.simplon.yourgardenbusiness.dtos;

import java.util.List;

public record AuthInfo(String token, List<String> roles) {

    @Override
    public String toString() {
	return "{token=[PROTECTED]" + ", roles=" + roles + "}";
    }

}
