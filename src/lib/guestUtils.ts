// Generate a unique guest ID that persists across browser sessions
export const getGuestUserId = (): string => {
  const GUEST_ID_KEY = 'dory_guest_id';
  
  // Check if we already have a guest ID stored
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  
  if (!guestId) {
    // Generate a new UUID for the guest user
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  
  return guestId;
};

// Clear guest session (useful for testing or if user wants to reset)
export const clearGuestSession = (): void => {
  localStorage.removeItem('dory_guest_id');
};