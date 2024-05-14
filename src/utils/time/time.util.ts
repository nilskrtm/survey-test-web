const getUserTimezone: () => string = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export { getUserTimezone };
