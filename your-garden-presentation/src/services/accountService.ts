import { CreateAccountDto } from "@/models/createAccount";
import { User } from "@/models/user";
import { apiFetch } from "@/services/fetchClient";

// Si votre API renvoie l'utilisateur créé, tippez le retour: Promise<User>
export const accountService = {
  async createAccount(dto: CreateAccountDto): Promise<User> {
    return await apiFetch<User>("/accounts", {
      method: "POST",
      json: dto,
      auth: false,
      retryOnUnauthorized: false,
    });
  },
} as const;
