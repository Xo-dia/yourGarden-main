package co.simplon.yourgardenbusiness.dtos;

public record AccountAuthenticate(String email, String password) {
    @Override
    public String toString() {
	return "{email=" + email + ", password=[PROTECTED]}";
    }

	public String email() {
		// TODO Auto-generated method stub
		return this.email;
	}
}
