import { useLists } from "../context/ListContext";
import ListColumn from "../components/columns/ListColumn";
import AddList from "../components/AddList";

const Home = () => {
  const { lists } = useLists();

  return (
    <div className="my-10 mx-3 flex gap-6">
      {lists.map((list) => (
        <ListColumn key={list._id} list={list} />
      ))}
      <AddList />
    </div>
  );
};

export default Home;
