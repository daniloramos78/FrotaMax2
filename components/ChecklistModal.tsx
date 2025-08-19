import React from 'react';
import Modal from './Modal';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Este modal foi simplificado e não é mais usado para o checklist de retirada/entrega.
// Pode ser reutilizado para outras finalidades simples no futuro.
const SimpleCheckModal: React.FC<SimpleModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div>{children}</div>
      <div className="flex justify-end mt-4">
        <button 
          onClick={onClose} 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
};

export default SimpleCheckModal;