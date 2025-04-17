import api from "./api";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const usePost = ({ endpoint, key, action = {} }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post(endpoint, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(key);
      if (action?.onSuccess) {
        action.onSuccess();
      }
    },
    onError: (error) => {
      if (action?.onError) {
        action.onError(error);
      }
    },
  });
};

export { usePost };
