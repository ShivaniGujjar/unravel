import React from 'react';

const ChatModals = ({ 
  editingChatId, 
  setEditingChatId, 
  newTitle, 
  setNewTitle, 
  handleRenameSubmit, 
  deletingChatId, 
  setDeletingChatId, 
  handleDeleteConfirm 
}) => {
  if (!editingChatId && !deletingChatId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1e293b] border border-white/10 rounded-3xl p-6 shadow-2xl">
        
        {/* --- RENAME MODAL --- */}
        {editingChatId && (
          <>
            <h3 className="text-lg font-bold mb-4 text-white">Rename Thread</h3>
            <input 
              autoFocus
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all mb-6"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditingChatId(null)} className="px-4 py-2 text-gray-400 hover:text-white font-bold transition text-sm">Cancel</button>
              <button onClick={handleRenameSubmit} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition text-sm shadow-lg shadow-blue-600/20">Save Change</button>
            </div>
          </>
        )}

        {/* --- DELETE MODAL --- */}
        {deletingChatId && (
          <>
            <h3 className="text-lg font-bold mb-2 text-white text-center">Delete Chat?</h3>
            <p className="text-gray-400 text-sm mb-6 text-center">This action cannot be undone. All messages in this thread will be lost.</p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleDeleteConfirm} 
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition text-sm shadow-lg shadow-red-500/20"
              >
                Delete Permanently
              </button>
              <button onClick={() => setDeletingChatId(null)} className="w-full py-3 text-gray-400 hover:text-white font-bold transition text-sm">
                Keep Chat
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatModals;