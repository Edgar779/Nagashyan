import { Body, Controller, Post, Get, Param, UseGuards, Patch } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDTO, ChangePassDTO, ResetPassDTO, SessionDTO, SignedInDTO, SigninDTO } from './dto';
import { ACCESS_TOKEN, RESET_TOKEN } from './constants';
import { ResetPassGuard } from './guards';
import { Public } from 'src/util';

@Controller('auth')
@ApiTags('Authentication Endpoints')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /** Sign in a user */
  @Post('signin')
  @Public()
  @ApiBody({ type: SigninDTO })
  @ApiOkResponse({ type: SignedInDTO })
  async login(@Body() signinDTO: SigninDTO): Promise<SignedInDTO> {
    const auth = await this.authService.signin(signinDTO);
    return auth;
  }

  /** Changing user password */
  @Patch(':id/changePassword')
  @ApiHeader({ name: ACCESS_TOKEN })
  @ApiBody({ type: ChangePassDTO })
  @ApiOkResponse({ type: SignedInDTO })
  async changePassword(@Body() changePassDTO: ChangePassDTO): Promise<SignedInDTO> {
    const auth = await this.authService.changePassword(changePassDTO);
    return auth;
  }

  /** Forgot Password */
  @Get('forgotPassword/:email')
  @Public()
  async forgotPassword(@Param('email') email: string) {
    const emailedResponse = await this.authService.forgotPassword(email);
    return emailedResponse;
  }

  /** Reseting the password */
  @Post('resetPassword')
  @Public()
  @UseGuards(new ResetPassGuard())
  @ApiBody({ type: ResetPassDTO })
  @ApiHeader({ name: RESET_TOKEN })
  @ApiOkResponse({ type: SignedInDTO })
  async resetPassword(@Body() resetPassDTO: ResetPassDTO): Promise<SignedInDTO> {
    console.log(resetPassDTO, 'resetPassDTOresetPassDTO');
    const auth = await this.authService.resetPassword(resetPassDTO);
    return auth;
  }

  /** logout the user */
  @Get('logout')
  @ApiHeader({ name: ACCESS_TOKEN })
  @ApiOkResponse({ type: String, description: 'token that was invalidated' })
  async logout(@Body('user') session: SessionDTO): Promise<string> {
    return await this.authService.logout(session.id, session.token);
  }
}
/** End of Controller */
