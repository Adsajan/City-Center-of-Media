module.exports = {
  async send(to, subject, text) {
    // Placeholder: integrate any email provider here
    console.log(`Email to ${to}: ${subject} -> ${text}`);
    return true;
  },
};

