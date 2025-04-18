const triggerHapticFeedback = () => {
  if (navigator.vibrate) {
    navigator.vibrate(50); // Vibrates for 50ms
  }
};

export { triggerHapticFeedback };
