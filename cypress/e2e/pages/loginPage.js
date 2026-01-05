class LoginPage {
    elements = {
      emailInput: () => cy.get('input[formcontrolname="email"]').should('be.visible'),
      passwordInput: () => cy.get('input[formcontrolname="password"]').should('be.visible'),
      showpasswordButton: () => cy.get('#showPassword', { timeout: 10000 }).should('be.visible'),
      signInButton: () => cy.contains('button', 'Sign In', { timeout: 10000 }),
      dashboardTitle: () => cy.get('.sub-navbar-title')
    };
  
    visit() {
      cy.visit('https://retail-staging.48.ie/login'); // full or relative path
      //cy.url().then(url => cy.log("URL after login = " + url));
    }
  
    enterEmail(email) {
      this.elements.emailInput().clear();
      if (email) {
        this.elements.emailInput().type(email);
      }
    }
  
    enterPassword(password) {
      this.elements.passwordInput().clear();
      if (password) {
        this.elements.passwordInput().type(password);
      }
    }
    
    showPassword() {
      this.elements.showpasswordButton().click();
    }
    clickSignIn() {
      this.elements.signInButton().click();
    }
  
    assertDashboardVisible() {
      this.elements.dashboardTitle().should('contain.text', 'Order History');
    }
  }
  
  export default new LoginPage();
  