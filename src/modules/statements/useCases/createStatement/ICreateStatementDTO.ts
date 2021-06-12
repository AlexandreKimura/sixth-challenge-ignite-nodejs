import { Statement } from "../../entities/Statement";

export type ICreateStatementDTO =
Pick<
  Statement,
  'received_id' |
  'user_id' |
  'description' |
  'amount' |
  'type'
>
