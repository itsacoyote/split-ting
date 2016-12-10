function PhoneNumber(account) {
    this.number = account.number;
    this.nickname = account.nickname;

    this.minutes = 0;
    this.messages = 0;
    this.megabytes = 0;
    this.kilobytes = 0;
    this.international = 0;
}