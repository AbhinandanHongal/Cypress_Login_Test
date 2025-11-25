class OrderSimsPage {
  elements = {
    // Form fields
    retailStoreNameSelect: () => cy.get('select[formcontrolname="retailStoreName"]'),
    deliveryAddressInput: () => cy.get('input[formcontrolname="autoAdress"]'),
    numberOfSimsInput: () => cy.get('#simQuantity'),
    shippingTypeDropdown: () => cy.get('mat-select[formcontrolname="shippingType"]'),
    messageInput: () => cy.get('input[formcontrolname="message"]'),
    
    // Buttons / messages
    orderButton: () => cy.get('button[type="submit"]'),
    orderPopupMessage: () => cy.contains("We've got your order"),
    okButton: () => cy.contains('OK'),
    // Order history
    orderHistoryLink: () => cy.get('a[routerlink="/order-history"], a[href="/order-history"]'),
    orderHistoryTable: () => cy.get('.order-history-table')
  };

  visit() {
    // Wait for dashboard page to fully load
    cy.contains('Order History', { timeout: 20000 }).should('be.visible');
  
    // Handle collapsed navbar (mobile view)
    cy.get('button.navbar-toggler').then($btn => {
      if ($btn.is(':visible')) {
        cy.wrap($btn).click();
      }
    });
  
    // Click the Order Sims link (guaranteed to exist)
    cy.get('a[routerlink="/order-sims"]', { timeout: 20000 })
      .should('be.visible')
      .click();
  }
  

  // Select retail store name from dropdown
  enterRetailStoreName(storeName) {
    if (storeName) {
      this.elements.retailStoreNameSelect().select(storeName);
    } else {
      cy.log('⚠️ No store name provided in test data');
    }
  }

  /**
 * Handles typing address + selecting the matching dropdown option dynamically
 */
  enterDeliveryAddress(address) {
    const addressPrefix = address.split(',')[0].trim();
  
    this.elements.deliveryAddressInput()
      .clear()
      .type(addressPrefix, { delay: 100 });
  
    // Wait for dropdown to render properly and become visible
    cy.get('.adress-lists-block', { timeout: 15000 })
      .should('exist')
      .and(($el) => {
        const height = $el.height();
        expect(height).to.be.greaterThan(0);
      });
  
    cy.get('.adress-lists-block p', { timeout: 10000 })
      .should('be.visible')
      .first()
      .scrollIntoView()
      .click({ force: true });
  
    // Wait for input value to update
    cy.wait(1000);
  
    this.elements.deliveryAddressInput()
      .invoke('val')
      .should('contain', addressPrefix);
  }

  enterNumberOfSims(number) {
    this.elements.numberOfSimsInput().clear();
    if (number) {
      this.elements.numberOfSimsInput().type(number);
    } else {
      cy.log('⚠️ No SIM count provided');
    }
  }

  selectShippingType(type) {
    if (type) {
      this.elements.shippingTypeDropdown().click();
      cy.get('mat-option').contains(type).click();
    } else {
      cy.log('⚠️ No shipping type provided');
    }
  }

  enterMessage(message) {
    this.elements.messageInput().clear();
    if (message) {
      this.elements.messageInput().type(message);
    } else {
      cy.log('⚠️ No message provided');
    }
  }

  clickOrderSims() {
    this.elements.orderButton()
      .should('exist')
      .should('be.enabled')
      .click({ force: true });
    cy.wait(3000);
    cy.log('✅ Order Sims button clicked successfully');
  }

  verifyOrderPopupAndClose() {
    cy.log('🕒 Waiting for order confirmation popup...');
  
    cy.get('#orderModal', { timeout: 30000 })
      .should('exist')
      .and('be.visible');
  
    cy.get('#orderModal .dialog-description.mx-auto.text-white', { timeout: 20000 })
      .should('be.visible')
      .and('contain.text', "We've got your order");
  
    cy.log('✅ Order confirmation popup visible');
  
    cy.get('#orderModal')
      .find('button')
      .contains(/^ok$/i)
      .should('be.visible')
      .first()
      .click({ force: true });
  
    cy.log('✅ OK button clicked, waiting for modal to close...');
    cy.get('#orderModal', { timeout: 10000 }).should('not.exist');
  
    cy.log('✅ Popup closed successfully and removed from DOM');
  }
  
  goToOrderHistory() {
    cy.get('#orderModal', { timeout: 10000 }).should('not.exist');
    cy.get('a[routerlink="/order-history"], a[href="/order-history"]', { timeout: 10000 })
      .should('exist')
      .and('be.visible')
      .click({ force: true });
    cy.url({ timeout: 15000 }).should('include', '/order-history');
    cy.log('✅ Navigated to Order History');
  }

  verifyOrderInHistory(storeName, sims, status) {
    this.elements.orderHistoryTable()
      .should('contain', storeName)
      .and('contain', sims)
      .and('contain', status);
  }

  verifySimValidationMessage(expectedText) {
    cy.contains('div', new RegExp(expectedText, 'i'), { timeout: 8000 })
      .should('be.visible')
      .then(() => {
        cy.log(`✅ Validation message displayed: "${expectedText}"`);
      });
  }
}

export default new OrderSimsPage();
