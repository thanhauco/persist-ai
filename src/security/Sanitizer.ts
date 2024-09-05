export class Sanitizer {
  static redactPII(text: string): string {
    // Basic regex for email and phone
    // In production, use Google DLP or AWS Macie
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    
    return text
      .replace(emailRegex, '[EMAIL_REDACTED]')
      .replace(phoneRegex, '[PHONE_REDACTED]');
  }
}
