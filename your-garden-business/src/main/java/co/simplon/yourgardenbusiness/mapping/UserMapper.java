package co.simplon.yourgardenbusiness.mapping;

import org.springframework.stereotype.Component;

import co.simplon.yourgardenbusiness.dtos.UserDto;
import co.simplon.yourgardenbusiness.entities.Users;

@Component
public class UserMapper {

	    public Users toEntity(UserDto dto) {
	        if (dto == null) return null;

	        Users user = new Users();
	        user.setName(dto.name());
	        user.setFirst_name(dto.first_name());

	        return user;
	    }

	    public UserDto toDto(Users user) {
	        if (user == null) return null;

	        UserDto dto = new UserDto(user.getId(),
	        		user.getName(),
	        		user.getFirst_name());

	        return dto;
	    }
	}
