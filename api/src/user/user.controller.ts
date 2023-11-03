import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { ACCESS_TOKEN } from "../util/constants";
import { ParseObjectIdPipe } from "../util";
import { CreateUserDTO, CreateWorkerDTO, EditUserDTO, UserDTO } from "./dto";
import { UserService } from "./user.service";
import { summaries } from "./user.constants";
import { Public } from "src/util/decorators/public.decorator";
import { SessionDTO, SignedInDTO } from "src/auth/dto";
import { AuthService } from "src/auth/auth.service";

@Controller("users")
@ApiTags("User")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /** Create a new user */
  // ONLY FOR DEVELOPMENT
  @Post('admin')
  @Public()
  @ApiBody({ type: CreateUserDTO })
  @ApiOkResponse({ type: SignedInDTO })
  @ApiOperation({ summary: summaries.CREATE_ORG })
  async register(@Body() dto: CreateUserDTO): Promise<SignedInDTO> {
    const auth = await this.userService.create(dto);
    return auth;
  }

  /** Get the user */
  @Get("profile")
  @ApiHeader({ name: ACCESS_TOKEN })
  @ApiOkResponse({ type: UserDTO })
  @ApiOperation({ summary: summaries.GET_PROFILE })
  async getUser(@Body("user") session: SessionDTO): Promise<UserDTO> {
    const user = await this.userService.get(session.id);
    return user;
  }

  /** Get all users */
  @Get()
  @ApiOkResponse({ type: [UserDTO] })
  @ApiOperation({ summary: summaries.GET_ALL })
  @Public()
  async getUsers(): Promise<UserDTO[]> {
    const users = await this.userService.getAll();
    return users;
  }

  @Patch()
  @ApiHeader({ name: ACCESS_TOKEN })
  @ApiBody({ type: EditUserDTO })
  @ApiOkResponse({ type: UserDTO })
  @ApiOperation({ summary: summaries.EDIT_INFO })
  async edit(@Body() editDTO: EditUserDTO): Promise<UserDTO> {
    const user = await this.userService.edit(editDTO);
    return user;
  }
}
