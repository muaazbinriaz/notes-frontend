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
import socket from "../socket/socket";
import { useDispatch } from "react-redux";
import { noteApi } from "../features/lists/noteApi";
import AutomationModal from "../components/AutomationModal";

const Home = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showAutomation, setShowAutomation] = useState(false);

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

  useEffect(() => {
    if (!boardId) return;
    socket.emit("join-board", boardId.toString());

    const handleListCreated = (newList) => {
      setLocalLists((prevLists) => {
        const updated = [...prevLists, newList];
        return updated.sort((a, b) => a.position - b.position);
      });
    };

    const handleListDeleted = ({ id }) => {
      setLocalLists((prevLists) => prevLists.filter((list) => list._id !== id));
    };

    const handleReorderedList = (updatedLists) => {
      setLocalLists((prevLists) => {
        return prevLists
          .map((list) => {
            const update = updatedLists.find((u) => u.id === list._id);
            if (update) {
              return { ...list, position: update.position };
            }
            return list;
          })
          .sort((a, b) => a.position - b.position);
      });
    };

    const handleNoteCreated = (newNote) => {
      dispatch(
        noteApi.util.updateQueryData("getNotes", newNote.listId, (draft) => {
          const exists = draft.some((note) => note._id === newNote._id);
          if (!exists) {
            draft.push(newNote);
            draft.sort((a, b) => a.position - b.position);
          }
        }),
      );
    };

    const handleNoteDeleted = (deletedNote) => {
      dispatch(
        noteApi.util.updateQueryData(
          "getNotes",
          deletedNote.listId,
          (draft) => {
            return draft.filter((note) => note._id !== deletedNote._id);
          },
        ),
      );
    };

    const handleNoteUpdated = (updatedNote) => {
      dispatch(
        noteApi.util.updateQueryData(
          "getNotes",
          updatedNote.listId,
          (draft) => {
            const index = draft.findIndex(
              (note) => note._id === updatedNote._id,
            );
            if (index !== -1) {
              draft[index] = updatedNote;
            }
            draft.sort((a, b) => a.position - b.position);
          },
        ),
      );
    };

    const handleNoteMoved = (movedNote) => {
      dispatch(
        noteApi.util.updateQueryData(
          "getNotes",
          movedNote.oldListId,
          (draft) => {
            return draft.filter((note) => note._id !== movedNote._id);
          },
        ),
      );
      dispatch(
        noteApi.util.updateQueryData("getNotes", movedNote.listId, (draft) => {
          const index = draft.findIndex((note) => note._id === movedNote._id);
          if (index !== -1) {
            draft[index] = movedNote;
          } else {
            draft.push(movedNote);
          }
          draft.sort((a, b) => a.position - b.position);
        }),
      );
    };

    socket.on("list-created", handleListCreated);
    socket.on("list-deleted", handleListDeleted);
    socket.on("lists-reordered", handleReorderedList);
    socket.on("note-created", handleNoteCreated);
    socket.on("note-deleted", handleNoteDeleted);
    socket.on("note-updated", handleNoteUpdated);
    socket.on("note-moved", handleNoteMoved);

    return () => {
      socket.emit("leave-board", boardId);
      socket.off("list-created", handleListCreated);
      socket.off("list-deleted", handleListDeleted);
      socket.off("lists-reordered", handleReorderedList);
      socket.off("note-created", handleNoteCreated);
      socket.off("note-deleted", handleNoteDeleted);
      socket.off("note-updated", handleNoteUpdated);
      socket.off("note-moved", handleNoteMoved);
    };
  }, [boardId, dispatch]);

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
      <div className="flex justify-center items-center max-h-[calc(100vh-100px)]">
        <p className="text-red-500 text-lg">
          Error: {error?.data?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-14 flex flex-col">
      <div className="p-4 flex justify-end bg-[#624A95]/80 shadow-xl border-white/20 text-white items-center px-10 py-1.5 mb-2.5 shrink-0">
        <button
          onClick={() => setShowAutomation(true)}
          className="px-2 py-0 bg-purple-600 text-white cursor-pointer rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          <span>⚡</span>
          <span>Automation</span>
        </button>
      </div>

      <div
        className="flex items-start gap-6 px-4 pb-5 flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar"
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

      {showAutomation && (
        <AutomationModal
          boardId={boardId}
          lists={localLists}
          onClose={() => setShowAutomation(false)}
        />
      )}
    </div>
  );
};

export default Home;
