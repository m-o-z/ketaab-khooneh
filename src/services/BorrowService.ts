import { ListQueryPageOptions } from "@/@types/pocketbase";
import { BorrowCoreSchema, BorrowDB } from "@/schema/borrows";

import { BaseService } from "./BaseService";

type GetBorrowsByStatusParams = {
  userId: string;
  status: BorrowDB["status"] | BorrowDB["status"][];
  extraFilter?: string;
  expand?: string;
  page: ListQueryPageOptions["page"];
  perPage: ListQueryPageOptions["perPage"];
};

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

  private async getBorrowsByStatus({
    userId,
    status,
    extraFilter,
    page,
    expand = "user,book,book.bookWork",
    perPage,
  }: GetBorrowsByStatusParams) {
    const client = await this._adminClient();
    let filter = `user = "${userId}" && ${this.createStatusQuery(status)}`;

    if (extraFilter) {
      filter += " && " + extraFilter;
    }

    const result = await client
      .collection<BorrowDB>("borrows")
      .getList(page, perPage, {
        filter,
        sort: "-dueDate",
        expand,
      });

    const { items, ...meta } = result;

    const borrowsCore = BorrowCoreSchema.array().parse(result.items);
    return {
      borrowsCore,
      items,
      meta,
    };
  }

  public async getUserActiveBorrows(
    userId: string,
    options: ListQueryPageOptions,
  ) {
    return this.getBorrowsByStatus({
      userId,
      status: ["ACTIVE", "EXTENDED"],
      ...options,
    });
  }

  public async getUserActiveBorrowsForBook(
    userId: string,
    bookId: string,
    options: ListQueryPageOptions,
  ) {
    return this.getBorrowsByStatus({
      userId,
      status: ["ACTIVE", "EXTENDED"],
      expand: "",
      extraFilter: `book = "${bookId}"`,
      ...options,
    });
  }

  public async getUserPreviousBorrows(
    userId: string,
    options: ListQueryPageOptions,
  ) {
    return this.getBorrowsByStatus({
      userId,
      status: ["RETURNED", "RETURNED_LATE"],
      ...options,
    });
  }
}

const instance = BorrowService.GetInstance() as BorrowService;

export default instance;
