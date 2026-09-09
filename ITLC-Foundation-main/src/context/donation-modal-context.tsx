'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DonationModalContextType {
  isOpen: boolean;
  initialAmount?: number;
  initialIsMonthly?: boolean;
  openDonationModal: (amount?: number, isMonthly?: boolean) => void;
  closeDonationModal: () => void;
}

const DonationModalContext = createContext<DonationModalContextType | undefined>(undefined);

export function DonationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialAmount, setInitialAmount] = useState<number | undefined>(undefined);
  const [initialIsMonthly, setInitialIsMonthly] = useState<boolean | undefined>(undefined);

  const openDonationModal = (amount?: number, isMonthly?: boolean) => {
    if (amount !== undefined) setInitialAmount(amount);
    if (isMonthly !== undefined) setInitialIsMonthly(isMonthly);
    setIsOpen(true);
  };

  const closeDonationModal = () => {
    setIsOpen(false);
  };

  return (
    <DonationModalContext.Provider
      value={{
        isOpen,
        initialAmount,
        initialIsMonthly,
        openDonationModal,
        closeDonationModal,
      }}
    >
      {children}
    </DonationModalContext.Provider>
  );
}

export function useDonationModal() {
  const context = useContext(DonationModalContext);
  if (!context) {
    throw new Error('useDonationModal must be used within a DonationModalProvider');
  }
  return context;
}
