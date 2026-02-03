import ListColumn from "../components/columns/ListColumn";
import AddList from "../components/AddList";
import { useParams } from "react-router-dom";
import {
  useGetListsQuery,
  useUpdateListOrderMutation,
} from "../features/lists/listApi";
import RoundedLoader from "../components/RoundedLoader";
import { useEffect, useState, useCallback } from "react";
import { useRef } from "react";

const Home = () => {
  const { boardId } = useParams();
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const {
    data: lists,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetListsQuery(boardId);
  const [updateListOrder] = useUpdateListOrderMutation();
  const [localLists, setLocalLists] = useState([]);

  const handleMouseDown = (e) => {
    const container = containerRef.current;
    setIsDown(true);
    container.classList.add("cursor-grabbing");
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    containerRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    setIsDown(false);
    containerRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const container = containerRef.current;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };
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
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div
        className="flex items-start gap-6 p-4 flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-hidden  cursor-grab active:cursor-grabbing"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {localLists.length === 0 ? (
          <div className="text-gray-300 text-lg">
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
        <AddList
          listCount={localLists.length}
          boardId={boardId}
          refetchLists={refetch}
        />
      </div>
    </div>
  );
};

export default Home;
