import { useState } from 'react';

/**
 * Custom hook for handling common open/close/toggle scenarios
 */
const useDisclosure = (initialState = false) => {
  const [isOpen, setOpen] = useState(initialState);
  const show = () => {
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
  };
  const toggle = () => {
    setOpen(!isOpen);
  };

  return { isOpen, show, hide, toggle };
};

export default useDisclosure;
