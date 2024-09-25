import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchImageTransactions } from '@/lib/queries';
import { TransactionsResponse } from '@/interfaces';

export const useImageTransactions = () => {
  return useInfiniteQuery<TransactionsResponse, Error>({
    queryKey: ['imageTransactions'],
    queryFn: ({ pageParam = null }) => fetchImageTransactions(pageParam as string | null),
    getNextPageParam: (lastPage) => {
      if (lastPage.pageInfo.hasNextPage) {
        return lastPage.edges[lastPage.edges.length - 1].cursor;
      }
      return undefined;
    },
    initialPageParam: null, // Add this line
  });
};
