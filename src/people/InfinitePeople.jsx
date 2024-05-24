import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";

import { useInfiniteQuery } from "@tanstack/react-query";

const baseUrl = "https://swapi-node.vercel.app";
const initialUrl = `${baseUrl}/api/people`;
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['sw-people'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next ? `${baseUrl}${lastPage.next}` : undefined;
    },
  });

  if (isLoading) return <h3 className="loading">Loading...</h3>;

  // console.log(data);
  return <>
    { isFetching && <div className='loading'>Loading...</div> }
    <InfiniteScroll
      loadMore={ () => {
        if (!isFetchingNextPage) {
          fetchNextPage();
        }
      } }
      hasMore={ hasNextPage }
    >
      { data.pages.map(page => page.results.map(({ fields }) => {
        return (
          <Person key={ fields.name }
            name={ fields.name }
            hairColor={ fields.hair_color }
            eyeColor={ fields.eye_color }
          />
        );
      })) }
    </InfiniteScroll>;
  </>;
}
