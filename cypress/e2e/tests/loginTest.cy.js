import LoginPage from '../pages/loginPage';

describe('Login Tests - Retail', () => {

  beforeEach(() => {
    cy.fixture('testData').as('data');
  });

  it('Login with valid credentials', function() {
    LoginPage.visit();
    cy.wait(5000); // wait for 2 seconds
    LoginPage.enterEmail(this.data.validUser.email);
    LoginPage.enterPassword(this.data.validUser.password);
    LoginPage.showPassword();
    LoginPage.clickSignIn();
    cy.wait(10000);
    cy.contains('Order History').should('be.visible');
  });

  it('Login fails with invalid credentials', function() {
    LoginPage.visit();
    cy.wait(5000); // wait for 5 seconds
    LoginPage.enterEmail(this.data.invalidUser.email);
    LoginPage.enterPassword(this.data.invalidUser.password);
    LoginPage.showPassword();
    LoginPage.clickSignIn();
    cy.contains('Invalid credentials. Please try again.').should('be.visible');
  });

  it('Login fails with empty email', function() {
    LoginPage.visit();
    cy.wait(5000); // wait for 5 seconds
    LoginPage.enterEmail(this.data.emptyEmail.email);
    LoginPage.enterPassword(this.data.emptyEmail.password);
    LoginPage.clickSignIn();
    cy.contains('Email is required').should('be.visible');
  });

    it('Login fails with empty password', function() {
      LoginPage.visit();
      cy.wait(5000); // wait for 5 seconds
      LoginPage.enterEmail(this.data.emptyPassword.email);
      LoginPage.enterPassword(this.data.emptyPassword.password);
      LoginPage.clickSignIn();
      cy.contains('Password is required').should('be.visible');
    });

});
