import ListColumn from "../components/columns/ListColumn";
import AddList from "../components/AddList";
import { useParams } from "react-router-dom";
import {
  useGetListsQuery,
  useUpdateListOrderMutation,
} from "../features/lists/listApi";
import RoundedLoader from "../components/RoundedLoader";
import { useEffect, useState, useCallback } from "react";

const Home = () => {
  const { boardId } = useParams();
  const { data: lists, isLoading, isError, error } = useGetListsQuery(boardId);
  const [updateListOrder] = useUpdateListOrderMutation();
  const [localLists, setLocalLists] = useState([]);

  useEffect(() => {
    if (lists) {
      setLocalLists(lists);
    }
  }, [lists]);

  const moveList = useCallback(
    (fromIndex, toIndex) => {
      if (fromIndex === toIndex) return;

      setLocalLists((prevLists) => {
        const updated = [...prevLists];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        updateListOrder(updated.map((l, i) => ({ id: l._id, position: i })));
        return updated;
      });
    },
    [updateListOrder],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <RoundedLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <p className="text-red-500 text-lg">
          Error: {error?.data?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-6 p-4 h-[calc(100vh-100px)] overflow-x-auto overflow-y-hidden scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {localLists.length === 0 ? (
        <div className="text-gray-500 text-lg">
          No lists yet. Create your first list!
        </div>
      ) : (
        localLists.map((list, i) => (
          <ListColumn
            key={list._id}
            list={list}
            index={i}
            moveList={moveList}
          />
        ))
      )}

      <AddList listCount={localLists.length} boardId={boardId} />
    </div>
  );
};

export default Home;
