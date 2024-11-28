import { useEffect } from "react";

export function NotFound() {
  useEffect(() => {
    throw new Error("404 Not Found");
  }, []);

  return null;
}
