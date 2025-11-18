console.log("🧩 orderSimsTest.cy.js version: 2025-10-20-2");
console.log('Loaded OrderSimsPage:', OrderSimsPage);

import LoginPage from '../pages/loginPage';
import OrderSimsPage from '../pages/orderSimsPage';

let testData;

describe('Order Sims Module - Functional Test Suite', () => {

  // ----------------------------------------------------------------
  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
      cy.log('✅ Fixture loaded successfully');
      expect(testData.orderSims).to.exist;
    });
  });

  // ----------------------------------------------------------------
  beforeEach(() => {
    cy.session('loginSession', () => {
      LoginPage.visit();
      LoginPage.enterEmail(testData.validUser.email);
      LoginPage.enterPassword(testData.validUser.password);
      LoginPage.showPassword();
      LoginPage.clickSignIn();
      cy.contains('Order History', { timeout: 20000 }).should('be.visible');
    });
  });

  // ----------------------------------------------------------------
  it('RSO_FT_14 – Verify navigation to Order Sims page after sign in', () => {
    cy.log('🧭 Navigating to Order Sims page...');
    OrderSimsPage.visit();
    cy.url().should('include', '/order-sims');
    cy.contains('Order SIMs').should('be.visible');
    cy.log('✅ User successfully navigated to Order Sims page after login');
  });

  // ----------------------------------------------------------------
  it('RSO_FT_15 – Verify placing a valid bulk SIM order (<999)', () => {
    OrderSimsPage.visit();

    OrderSimsPage.enterRetailStoreName(testData.orderSims.storeName);
    OrderSimsPage.enterDeliveryAddress(testData.orderSims.deliveryAddress);
    OrderSimsPage.enterNumberOfSims(testData.orderSims.sims); // e.g. 100
    OrderSimsPage.enterMessage(testData.orderSims.message);
    OrderSimsPage.clickOrderSims();

    OrderSimsPage.verifyOrderPopupAndClose();
    cy.get('#orderModal', { timeout: 10000 }).should('not.exist');

    cy.log('✅ Bulk SIM order placed successfully');
  });

  // ----------------------------------------------------------------
  it('RSO_FT_16 – Verify placing bulk SIM order of 999', () => {
    OrderSimsPage.visit();

    OrderSimsPage.enterRetailStoreName(testData.orderSims.storeName);
    OrderSimsPage.enterDeliveryAddress(testData.orderSims.deliveryAddress);
    OrderSimsPage.enterNumberOfSims(500);
    OrderSimsPage.enterMessage('Placing max allowed 500 SIMs');
    OrderSimsPage.clickOrderSims();

    OrderSimsPage.verifyOrderPopupAndClose();
    cy.get('#orderModal', { timeout: 10000 }).should('not.exist');

    cy.log('✅ Order for 999 SIMs placed successfully');
  });

  // ----------------------------------------------------------------
  it('RSO_FT_17 – Verify error message for SIM order >999', () => {
    OrderSimsPage.visit();
  
    OrderSimsPage.enterRetailStoreName(testData.orderSims.storeName);
    OrderSimsPage.enterDeliveryAddress(testData.orderSims.deliveryAddress);
    OrderSimsPage.enterNumberOfSims(1000); // trigger max-limit validation
    OrderSimsPage.elements.numberOfSimsInput().blur(); // ✅ FIXED
  
    OrderSimsPage.verifySimValidationMessage('must be at most 999');
  });

  // ----------------------------------------------------------------
  it('RSO_FT_19 – Validation for invalid and blank values in Number of SIMs field', () => {
    const invalidValues = [
      { input: '', expected: 'is required' }, // use '' instead of null/space
      { input: ' ', expected: 'is required' },
      { input: '@@@', expected: 'must be a number' },
      { input: 'abc', expected: 'must be a number' },
      { input: '50xyz', expected: 'must be a number' }
    ];
  
    invalidValues.forEach(({ input, expected }) => {
      OrderSimsPage.visit();
      cy.log(`🧪 Testing invalid SIM count: "${input}" expecting: "${expected}"`);
  
      OrderSimsPage.enterRetailStoreName(testData.orderSims.storeName);
      OrderSimsPage.enterDeliveryAddress(testData.orderSims.deliveryAddress);
  
      // Clear field before typing
      OrderSimsPage.elements.numberOfSimsInput().clear();
  
      if (input) {
        OrderSimsPage.enterNumberOfSims(input);
      }
  
      // Explicitly trigger blur event
      OrderSimsPage.elements.numberOfSimsInput().blur();
  
      // Optionally, click somewhere else to confirm Angular validation renders
      OrderSimsPage.elements.messageInput().click({ force: true });
  
      // Now verify the validation message
      OrderSimsPage.verifySimValidationMessage(expected);
    });
  });  

  // ----------------------------------------------------------------
  it('RSO_FT_18 – Verify placed order appears in Order History (from latest valid order)', () => {
    OrderSimsPage.goToOrderHistory();
    cy.url().should('include', '/order-history');

    OrderSimsPage.verifyOrderInHistory(
      testData.orderSims.storeName,
      testData.orderSims.sims,
      testData.orderSims.status
    );

    cy.log('✅ Verified latest order present in Order History');
  });
});