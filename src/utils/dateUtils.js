// /src/utils/dateUtils.js

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "—";
  
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  