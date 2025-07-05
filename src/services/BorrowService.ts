import { BorrowCoreSchema, BorrowDB } from "@/schema/borrows";
import { BaseService } from "./BaseService";
import { ListQueryPageOptions } from "@/@types/pocketbase";

class BorrowService extends BaseService {
  createStatusQuery(status: BorrowDB["status"] | BorrowDB["status"][]) {
    if (Array.isArray(status)) {
      return [
        "(",
        status.map((value) => `status = "${value}"`).join(" || "),
        ")",
      ].join(" ");
    }

    return `status = "${status}"`;
  }
  public async getBorrowsByStatus(
    userId: string,
    status: BorrowDB["status"] | BorrowDB["status"][],
    { page, perPage }: ListQueryPageOptions,
  ) {
    const client = await this._adminClient();
    const filter = `user = "${userId}" && ${this.createStatusQuery(status)}`;
    console.log({ filter });
    const result = await client
      .collection<BorrowDB>("borrows")
      .getList(page, perPage, {
        filter,
        sort: "-dueDate",
        expand: "user,book,book.bookWork",
      });

    const { items: _, ...meta } = result;

    const borrowsCore = BorrowCoreSchema.array().parse(result.items);
    return {
      borrowsCore,
      meta,
    };
  }
  public async getUserActiveBorrows(
    userId: string,
    options: ListQueryPageOptions,
  ) {
    return this.getBorrowsByStatus(userId, ["ACTIVE", "EXTENDED"], options);
  }

  public async getUserPreviousBorrows(
    userId: string,
    options: ListQueryPageOptions,
  ) {
    return this.getBorrowsByStatus(
      userId,
      ["RETURNED", "RETURNED_LATE"],
      options,
    );
  }
}

const instance = BorrowService.GetInstance() as BorrowService;

export default instance;
