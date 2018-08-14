import User from './user';

class Profile extends User {
  updatUserProfile(req) {
    return this.updateUser(req);
  }

  getUserProfile() {
    return this.getUser();
  }

  getUserEntryCount() {
    return this.getEntryCount();
  }

  changePassword(req) {
    return this.updatePassword(req);
  }

  passwordMatch(req) {
    return this.checkPassword(req);
  }
}

export default Profile;
