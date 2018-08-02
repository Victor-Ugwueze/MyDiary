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
}

export default Profile;
