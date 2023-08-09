class ValidationService {
  static validatePhoneNumber(phoneNumber) {
    return (!isNaN(phoneNumber) && phoneNumber.length === 10);
  }

  static validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
}


export default ValidationService;
