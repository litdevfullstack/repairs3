import {User} from "../../data/postgres/models/user.models";
import {CustomError} from "../../domain";
import {JwtAdapter} from "../../config/jwt.adapter";
import { LoginUserDTO } from '../../domain/dtos/auth/login-user.dto';
import { bcryptAdapter } from "../../config/bcrypt.adapter";


enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED'
}

enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT'
}

export class AuthService {

  constructor(
      
  ){}


  public async login( loginUserDTO: LoginUserDTO ){
    const user = await User.findOne({
      where: {
        email: loginUserDTO.email,
        userStatus: UserStatus.ACTIVE
      }
    })
    if( !user ) throw CustomError.unAuthorized("Invalid credentials")
    const isMatching = bcryptAdapter.compare(loginUserDTO.password, user.password);
    if( !isMatching ) throw CustomError.unAuthorized("Invalid credentials")
    const token = await JwtAdapter.generateToken({ id: user.id })
    if( !token ) throw CustomError.internalServer('Error while creating JWT')
    return {
      token: token,
      user: {
        id: user.id,
        firstName: user.firstName,
        surname: user.sureName,
        email: user.email,
        role: user.rol
      }
    }
  }

  public async getProfile(id: number){
    const user = await User.findOne({
      select: {
        repairs: {
          id: true,
          repairStatus: true,
          motorsNumber: true,
          description: true,
        }
      },
      where: {
        id: id,
      },
      relations: ['repairs'],
    })

    if(!user) throw CustomError.notFound('User not found')

    return user;
  }

  public async getProfileForRoutes(id: number){
    const user = await User.findOne({
      where: {
        id: id,
        userStatus: UserStatus.ACTIVE
      },
    })

    if(!user) throw CustomError.notFound('User not found')

    return {
      id: user.id,
      firstName: user.firstName,
      surename: user.sureName,
      email: user.email,
      rol: user.rol,
    }
  }
}