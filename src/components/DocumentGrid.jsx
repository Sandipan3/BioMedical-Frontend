import React from "react";

const DocumentGrid = ({ docs, onDelete }) => {
  if (!docs.length) return null;

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Documents</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {docs.map((doc) => (
          <div
            key={doc._id}
            className="border rounded-lg shadow p-4 flex flex-col items-center bg-white"
          >
            {doc.mimetype.startsWith("image/") ? (
              <img
                src={`http://127.0.0.1:8080/ipfs/${doc.cid}`}
                alt={doc.filename}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="h-40 flex items-center justify-center w-full bg-gray-200 rounded">
                <p className="text-sm text-gray-600">PDF File</p>
              </div>
            )}

            <p className="mt-2 text-center text-sm text-gray-800 truncate w-full">
              {doc.filename}
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() =>
                  window.open(`http://127.0.0.1:8080/ipfs/${doc.cid}`, "_blank")
                }
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
              >
                View
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(doc._id)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentGrid;
