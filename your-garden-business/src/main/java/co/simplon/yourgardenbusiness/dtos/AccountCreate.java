package co.simplon.yourgardenbusiness.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AccountCreate(@NotBlank @Size(max = 225) 
String email, 

String first_name, 

String last_name,

@NotBlank 
String password) {

	 @Override
	    public String toString() {
	        return "{email=" + email + 
	        		",last_name=" + last_name + 
	        		",first_name=" + first_name + 
	        		", password=[PROTECTED]}";
	    }

}