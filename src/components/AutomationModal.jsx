import React, { useState } from "react";
import { useCreateAutomationRuleMutation } from "../features/lists/automationApi";
import { toast } from "react-toastify";

function AutomationModal({ boardId, lists, onClose }) {
  const [trigger, setTrigger] = useState("tag-verified");
  const [action, setAction] = useState("move");
  const [tagName, setTagName] = useState("");
  const [destinationListTitle, setDestinationListTitle] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [createRule, { isLoading }] = useCreateAutomationRuleMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    if (action === "move" && !destinationListTitle.trim()) {
      toast.error("Please select a destination list");
      return;
    }

    try {
      const ruleData = {
        trigger,
        action,
        conditions: { tag: tagName },
      };
      if (action === "move") {
        ruleData.destination = destinationListTitle;
      } else if (action === "sortBy") {
        ruleData.by = sortBy;
      }

      await createRule(ruleData).unwrap();
      toast.success("Automation rule created!");
      onClose();
    } catch (error) {
      toast.error("Failed to create rule");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Create Automation Rule
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 rounded cursor-pointer hover:text-gray-700 text-3xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When (Trigger)
            </label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none appearance-none"
            >
              <option value="tag-verified">When tag is added/updated</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              If note has tag
            </label>
            <input
              type="text"
              placeholder="e.g., urgent, verified, done"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Then (Action)
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none appearance-none"
            >
              <option value="move">Move note to list</option>
              <option value="sortBy">Sort notes in list</option>
            </select>
          </div>

          {action === "move" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination List
              </label>
              <select
                value={destinationListTitle}
                onChange={(e) => setDestinationListTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select a list</option>
                {lists.map((l) => (
                  <option key={l._id} value={l.title}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          {action === "sortBy" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="createdAt">Creation Date (Oldest first)</option>
                <option value="name">Name (A → Z)</option>
              </select>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? "Creating..." : "Create Rule"}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
          <strong>Example:</strong>{" "}
          {action === "move" ? (
            <>
              When tag "{tagName || "verified"}" is added to any note, move it
              to list "{destinationListTitle || "Completed"}"
            </>
          ) : (
            <>
              When tag "{tagName || "sorted"}" is added to any note, sort all
              notes in the list by{" "}
              {sortBy === "createdAt"
                ? "creation date"
                : sortBy === "name"
                  ? "name"
                  : "position"}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AutomationModal;
