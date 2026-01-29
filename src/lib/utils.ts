export function validateUser(user: number): boolean {
  return /^[0-9]+$/.test(user.toString());
}

export function validatePassword(password: string): boolean {
  return /^[a-zA-Z0-9!@#$%^&*()_\-+=\[\]{}|\\:;"'<>,.?/]+$/.test(password);
}

export function formatValue(value: any) {
  if (value === null) return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export const getLastDocument = (docs: any[]) => {
  if (!Array.isArray(docs) || docs.length === 0) return null;
  return docs.reduce((latest, doc) =>
    doc.version > latest.version ? doc : latest,
  );
};

export const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};