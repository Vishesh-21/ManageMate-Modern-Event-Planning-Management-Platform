import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery } from "convex/react";

export const useConvexQuery = (query, ...args) => {
  const result = useQuery(query, ...args);

  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (result === undefined) {
      setLoading(true);
    } else {
      try {
        setData(result);
        setError(null);
      } catch (e) {
        setError(e);
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    }
  }, [result]);

  return { data, loading, error };
};
