import { HttpException, HttpStatus } from '@nestjs/common';


export {};
declare global {
  interface Array<T> {
    reorder(from: number, to: number);
  }
}

/** Rearranges the items inside an array and returns that array */
Array.prototype.reorder = function (from: number, to: number) {
  if (from >= length || from < 0) {
    throw new HttpException('From value falls outside of the items list', HttpStatus.BAD_REQUEST);
  }
  if (to >= length || to < 0) {
    throw new HttpException('To value falls outside of the items list', HttpStatus.BAD_REQUEST);
  }
  const el = this[to];
  this[to] = this[from];
  this[from] = el;
  return this;
};