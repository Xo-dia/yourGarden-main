package co.simplon.yourgardenbusiness.dtos;

public record AccountAuthenticate(String pseudo, String password) {
    @Override
    public String toString() {
	return "{pseudo=" + pseudo + ", password=[PROTECTED]}";
    }

	public String pseudo() {
		// TODO Auto-generated method stub
		return null;
	}
}
