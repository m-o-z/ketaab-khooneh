import Client from "pocketbase";

import { Rule, RuleEventType } from "@/types";
import { UserDB } from "@/schema/users";
import { BorrowDB } from "@/schema/borrows";
import { BookDB } from "@/schema/books";
import dayjs from "dayjs";

interface BorrowContext {
  user: UserDB; // PocketBase user model
  book: BookDB; // PocketBase book model
  borrow?: BorrowDB;
  borrows: {
    // The potential borrow record we are building
    dueDate?: Date;
    [key: string]: any;
  };
}

interface RuleEngineResult {
  allowed: boolean;
  message?: string;
  modifiedContext: BorrowContext;
}

export class RuleEngineService {
  private pb;

  constructor(pb: Client) {
    this.pb = pb;
  }

  private getValueFromContext(fact: string, context: any) {
    // Simple dot notation accessor, e.g., 'user.is_punished' -> context['user']['is_punished']
    return fact.split(".").reduce((o, i) => o?.[i], context);
  }

  private checkCondition(condition: any, context: any): boolean {
    const contextValue = this.getValueFromContext(condition.fact, context);
    const ruleValue = condition.value.value;

    switch (condition.operator) {
      case "EQUALS":
        return contextValue === ruleValue;
      case "NOT_EQUALS":
        return contextValue !== ruleValue;
      case "GREATER_THAN":
        return contextValue > ruleValue;
      case "LESS_THAN":
        return contextValue < ruleValue;
      case "IS_EMPTY":
        return contextValue == null || contextValue === "";
      // Add more operators as needed...
      default:
        return false;
    }
  }

  async execute(
    eventType: RuleEventType,
    context: BorrowContext,
  ): Promise<RuleEngineResult> {
    const rules = await this.pb.collection<Rule>("rules").getFullList({
      filter: `isEnabled = true && eventType = "${eventType}"`,
      sort: "-priority", // Highest priority first
      expand: "rule_conditions_via_rule", // Important: Fetch related conditions
    });

    const result: RuleEngineResult = {
      allowed: true,
      modifiedContext: context,
    };

    for (const rule of rules) {
      // Check if all conditions for this rule are met
      const conditions = rule.expand?.["rule_conditions_via_rule"] || [];
      const allConditionsMet = conditions.every((cond) =>
        this.checkCondition(cond, result.modifiedContext),
      );

      if (allConditionsMet) {
        console.log(`Executing action for rule: ${rule.name}`);
        switch (rule.actionType) {
          case "ALLOW":
            result.allowed = true;
            result.message = rule.actionParams.message;
            break;
          case "DENY":
            result.allowed = false;
            result.message = rule.actionParams.message;
            break;

          case "APPLY_PUNISHMENT":
            (() => {
              result.allowed = true;
              const { multiplier, reason, unit } = rule.actionParams;
              let punishmentEndAt = dayjs().toISOString();
              const dueDate =
                dayjs(result.modifiedContext.borrow?.dueDate) ?? dayjs();
              const now = dayjs();
              const nowDiffFromDueDate = now.diff(dueDate, "hours");

              if (nowDiffFromDueDate > 0) {
                const lateInDays = Math.floor(nowDiffFromDueDate / 24);
                const lateInDaysMultiplied = lateInDays * multiplier;
                punishmentEndAt = dayjs()
                  .add(lateInDaysMultiplied, "days")
                  .endOf("day")
                  .toISOString();
                result.modifiedContext.user.isPunished = true;
                result.modifiedContext.user.punishmentEndAt = punishmentEndAt;
                if (reason) {
                  result.message = reason;
                }
              }
            })();
            break;

          case "SET_VALUE":
            const { fact, value, unit } = rule.actionParams;

            if (fact === "borrows.dueDate" && unit === "days") {
              const newDueDate = new Date();
              newDueDate.setDate(newDueDate.getDate() + value);
              result.modifiedContext.borrows.dueDate = newDueDate;
            }
            // Add more SET_VALUE logic here for other facts
            break;

          // You would implement APPLY_PUNISHMENT similarly for the return logic
        }

        if (rule.stopOnMatch) {
          return result; // Stop processing further rules
        }
      }
    }
    return result;
  }
}
