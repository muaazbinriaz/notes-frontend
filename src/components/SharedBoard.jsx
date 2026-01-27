import React from "react";
import { useState } from "react";
import { useInviteBoardMemberMutation } from "../features/lists/boardApi";
import { useGetBoardByIdQuery } from "../features/lists/boardApi";

const SharedBoard = ({ boardId }) => {
  const [email, setEmail] = useState("");
  const [message, setMessgae] = useState("");
  const [inviteBoardMember] = useInviteBoardMemberMutation();
  const { refetch } = useGetBoardByIdQuery(boardId);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await inviteBoardMember({ boardId, email }).unwrap();
      refetch();
      setMessgae("Invitation sent!");
      setEmail("");
    } catch (err) {
      setMessgae("Failed to send invite");
    }
  };
  return (
    <>
      <div>
        <form onSubmit={handleInvite}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter collaborator email"
            required
            className="p-2 border rounded-md outline-gray-500 border-gray-500 bg-gray-200 text-gray-800"
          />
          <button
            type="submit"
            className="bg-gray-300 duration-300 hover:bg-[#588ba3]  hover:text-white cursor-pointer px-4 py-2 ml-3 rounded-md"
          >
            Invite
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </>
  );
};

export default SharedBoard;
