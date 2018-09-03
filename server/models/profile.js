import User from './user';

class Profile extends User {
  /**
 * This method updates user profile.
 * @method
 */
  updatUserProfile(req) {
    return this.updateUser(req);
  }

  /**
   * This method gets user profile details.
   * @method
   */
  getUserProfile() {
    return this.getUser();
  }

  /**
 * This method gets total number of entries created by user.
 * @method
 */
  getUserEntryCount() {
    return this.getEntryCount();
  }

  /**
   * This method updates user password.
   * @method
   * @param {object} - The request object.
   */
  changePassword(req) {
    return this.updatePassword(req);
  }

  /**
     * This method checks compares password from database and password from request.
     * @method
     * @param {object} - The request object.
     */
  passwordMatch(req) {
    return this.checkPassword(req);
  }
}

export default Profile;
