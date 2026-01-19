import ListColumn from "../components/columns/ListColumn";
import AddList from "../components/AddList";
import { useGetListsQuery } from "../features/lists/listApi";
import RoundedLoader from "../components/RoundedLoader";

const Home = () => {
  const { data: lists, isLoading, isError, error } = useGetListsQuery();
  if (isLoading) return <RoundedLoader />;
  if (isError)
    return <p>Error: {error?.data?.message || "Something went wrong"}</p>;
  return (
    <div className="flex items-start gap-6 p-4 h-[calc(100vh-100px)] overflow-x-auto overflow-y-hidden scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {lists.map((list) => (
        <ListColumn key={list._id} list={list} />
      ))}
      <AddList />
    </div>
  );
};

export default Home;
