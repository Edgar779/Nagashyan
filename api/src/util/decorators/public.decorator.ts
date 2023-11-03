import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata('isPublic', true);
export const VerifyCall = () => {
  console.log('Verified ');
  return (target, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    console.log('decoreatoandowd');
  };
};
