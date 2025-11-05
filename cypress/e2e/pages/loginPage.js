class LoginPage {
    elements = {
      emailInput: () => cy.get('input[formcontrolname="email"]')      ,
      passwordInput: () => cy.get('input[formcontrolname="password"]')  ,
      showpasswordButton: () => cy.get('#showPassword'),
      signInButton: () => cy.get('button[type="submit"]'),
      dashboardTitle: () => cy.get('.sub-navbar-title')
    };
  
    visit() {
      cy.visit('/login'); // full or relative path
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
  