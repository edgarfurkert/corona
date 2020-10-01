import { EmailValidatorDirective } from './email-validator.directive';

// Jasmine-Test-Suite
describe('EmailValidatorDirective', () => {
  let validator = null;
  beforeEach(() => {
    validator = new EmailValidatorDirective();
  });

  // Test-Specification
  it('should create an instance', () => {
    expect(validator).toBeTruthy();
  });

  it('should accept a valid email address', () => {
    const control = <any>{value: 'foo@bar.com'}; // any-cast as AbstractControl
    const result = validator.validate(control);
    expect(result).toBe(null);
  });

  it('should not accept an invalid email address', () => {
    const control = <any>{value: 'foobar.com'}; // any-cast as AbstractControl
    const result = validator.validate(control);
    expect(result['invalidEMail']).toBeTruthy();
  });

  it('should accept empty email address', () => {
    const control = <any>{value: ''}; // any-cast as AbstractControl
    const result = validator.validate(control);
    expect(result).toBeNull();
  });
});
