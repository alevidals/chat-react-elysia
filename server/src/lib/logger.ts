import Elysia from "elysia";
import { logger as logysia } from "@grotto/logysia";

export const logger = new Elysia().use(
  logysia({
    logIP: false,
    writer: {
      write(msg: string) {
        console.log(msg);
      },
    },
  })
);
