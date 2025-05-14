package co.simplon.yourgardenbusiness.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AccountCreate(@NotBlank @Size(max = 225) String email, String pseudo, @NotBlank String password) {

	 @Override
	    public String toString() {
	        return "{email=" + email + ", pseudo=" + pseudo + ", password=[PROTECTED]}";
	    }

}