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
      orderHistoryLink: () => cy.get('a[routerlink="/order-history"]'),
      orderHistoryTable: () => cy.get('.order-history-table')
    };
  
    // Visit Order Sims page directly
    visit() {
      cy.visit('/order-sims');
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
      
        // Wait for dropdown and select the matching option
        cy.get('.adress-lists-block', { timeout: 10000 })
          .should('be.visible')
          .within(() => {
            cy.contains('p', address, { timeout: 8000 })
              .should('be.visible')
              .scrollIntoView()
              .click({ force: true });
          });
      
        // Wait for input value to update
        cy.wait(1000);
      
        // ✅ Updated assertion: allow for async update
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
        .click({ force: true }); // ensure it actually triggers the click event
        // Give backend / modal animation a little buffer
         cy.wait(3000);

         cy.log('✅ Order Sims button clicked successfully');

    }
  
    verifyOrderPopupAndClose() {
        cy.log('🕒 Waiting for order confirmation popup...');
      
        // Wait for the modal container to exist in DOM
        cy.get('#orderModal', { timeout: 30000 }).should('exist');
      
        // Retry until modal becomes visible (Bootstrap transition)
        cy.get('#orderModal', { timeout: 30000 })
          .should(($modal) => {
            const isVisible = !$modal.is(':hidden');
            if (!isVisible) {
              throw new Error('Modal not visible yet');
            }
          });
      
        // Once modal is visible, verify message
        cy.get('.dialog-description.mx-auto.text-white', { timeout: 20000 })
          .should('be.visible')
          .and('contain.text', "We've got your order");
      
        cy.log('✅ Order confirmation popup visible');
      
        // Click the OK button
        cy.contains('button', /^ok$/i, { timeout: 10000 })
          .should('be.visible')
          .click({ force: true });
      
        cy.log('✅ Popup closed successfully');
      }      
      
    

      goToOrderHistory() {
        this.elements.orderHistoryLink().click();
        cy.url().should('include', '/order-history');
      }
  
    verifyOrderInHistory(storeName, sims, status) {
      this.elements.orderHistoryTable()
        .should('contain', storeName)
        .and('contain', sims)
        .and('contain', status);
    }
  }
  
  export default new OrderSimsPage();
  