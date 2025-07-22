export function objectToFormData(
  obj: { [key: string]: any },
  form?: FormData,
  namespace?: string,
): FormData {
  const fd = form || new FormData();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const formKey = namespace ? `${namespace}[${key}]` : key;

      if (value instanceof File || value instanceof Blob) {
        fd.append(formKey, value);
      } else if (Array.isArray(value)) {
        value.forEach((el, idx) => {
          if (typeof el === "object" && el !== null) {
            objectToFormData(el, fd, `${formKey}[${idx}]`);
          } else {
            fd.append(`${formKey}[${idx}]`, el);
          }
        });
      } else if (typeof value === "object" && value !== null) {
        objectToFormData(value, fd, formKey);
      } else if (value !== undefined && value !== null) {
        fd.append(formKey, value);
      }
      // Ignore undefined/null values (optional)
    }
  }
  return fd;
}
