import { useQuery } from "@tanstack/react-query";
import api from "./api";
const useFetch = ({ endpoint, key = [] }) => {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res?.data;
    },
    staleTime: 60 * 1000 * 1,
    enabled: !!endpoint,
  });
};

export { useFetch };
