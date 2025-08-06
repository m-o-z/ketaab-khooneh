import { FieldValues, DeepPartial } from "react-hook-form";

/**
 * Checks if a value is a plain object, and not an array or File.
 * This runtime check helps TypeScript understand the data shape.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof File)
  );
}

/**
 * Gets only the values from a data object that are marked as dirty.
 * This version avoids the complex generic error.
 */
export function getDirtyValues<T extends FieldValues>(
  data: T,
  dirtyFields: DeepPartial<Record<keyof T, boolean>>,
): Partial<T> {
  const dirtyValues: Partial<T> = {};

  for (const key in dirtyFields) {
    if (!(key in data)) continue;

    const dirtyFieldEntry = dirtyFields[key as keyof T];
    const dataField = data[key as keyof T];

    // This robust check prevents the error by ensuring we only recurse into plain objects.
    if (isPlainObject(dirtyFieldEntry) && isPlainObject(dataField)) {
      const nestedDirtyValues = getDirtyValues(
        dataField,
        // The cast here is now safe because of the isPlainObject check above.
        dirtyFieldEntry as DeepPartial<Record<string, boolean>>,
      );

      if (Object.keys(nestedDirtyValues).length > 0) {
        dirtyValues[key as keyof T] = nestedDirtyValues as any;
      }
    } else if (dirtyFieldEntry === true) {
      // Handles non-object fields (string, number, boolean, File, etc.)
      dirtyValues[key as keyof T] = dataField;
    }
  }

  return dirtyValues;
}
