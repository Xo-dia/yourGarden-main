package co.simplon.yourgardenbusiness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//(exclude = SecurityAutoConfiguration.class)
@SpringBootApplication
public class yourGardenBusinessApplication {

    public static void main(String[] args) {
	SpringApplication.run(yourGardenBusinessApplication.class, args);
    }

}
