enum PermissionLevel {
  USER = 0,
  ADMIN = 1
}

const getPermissionLevelName: (permissionLevel: PermissionLevel) => string = (permissionLevel) => {
  switch (permissionLevel) {
    case PermissionLevel.USER:
      return 'Nutzer';
    case PermissionLevel.ADMIN:
      return 'Admin';
    default:
      return 'Nutzer';
  }
};

export { PermissionLevel, getPermissionLevelName };
