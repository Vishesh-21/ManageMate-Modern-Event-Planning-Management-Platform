import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";

export const useConvexMutation = (mutation) => {
  const mutationFunction = useMutation(mutation);

  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      setData(await mutationFunction(...args));
      setError(null);
    } catch (e) {
      setError(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
};
