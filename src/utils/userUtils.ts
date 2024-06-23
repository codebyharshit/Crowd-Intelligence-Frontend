const checkUserRole = (session) => {
    if (
      !session ||
      !session.user ||
      !session.user.organizationMemberships ||
      session.user.organizationMemberships.length === 0
    ) {
      return null; // Return null if the user is not a basic member
    }
  
    const organizationMemberships = session.user.organizationMemberships;
  
    // Loop through all organization memberships
    for (const membership of organizationMemberships) {
      if (membership.role) {
        return membership.role.toLowerCase(); // Return the role in lowercase if it exists
      }
    }
  
    return null; // Return null if no role is found in the memberships
  }

  const getUserIdFromSession = (session) => {
    if (session && session.user && session.user.id) {
      return session.user.id;
    }
    return null; // Return null if user ID is not found in the session
  };

  export { checkUserRole, getUserIdFromSession };