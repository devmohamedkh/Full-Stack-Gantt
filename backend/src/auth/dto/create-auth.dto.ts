import { User } from 'src/users/entities/user.entity';

export class CreateAuthDto {
  user: User;
  access_token: string;
  refresh_token: string;
}
