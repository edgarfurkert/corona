import {EmailValidatorDirective} from './app-validators';


describe('EMail-Validator', () => {
  let validator = null;
  beforeEach(() => {
    validator = new EmailValidatorDirective();
  });

  it('should accept valid email addresses', () => {
    const control = <any> {value: 'foo@bar.com'};
    const result = validator.validate(control);
    expect(result).toBe(null);
  });
  it('should not accept invalid email addresses', () => {
    const control = <any> {value: 'foobar.com'};
    const result = validator.validate(control);
    expect(result['invalidEMail']).toBeTruthy();
  });
  it('should accept empty email addresses', () => {
    const control = <any> {value: ''};
    const result = validator.validate(control);
    expect(result).toBeNull();
  });
});
