import React from 'react';

const DeleteModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-base-100 rounded-md shadow-lg p-6 w-96">
        <h2 className="text-xl font-medium mb-4">{title}</h2>
        <p className="mb-6 text-base-content/80 text-sm">{message}</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onCancel} className="btn btn-sm btn-default">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-sm btn-error">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ title, children, onConfirm, onCancel }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-base-100 rounded-md shadow-lg p-6 w-96">
          <h2 className="text-xl font-medium mb-4">{title}</h2>
          <div className="mb-6">{children}</div>
          <div className="flex justify-end space-x-3">
            <button onClick={onCancel} className="btn btn-sm btn-default">
              Cancel
            </button>
            <button onClick={onConfirm} className="btn btn-sm btn-secondary">
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };
  

  export { DeleteModal, EditModal };
