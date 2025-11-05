console.log("🧩 orderSimsTest.cy.js version: 2025-10-20-2");
console.log('Loaded OrderSimsPage:', OrderSimsPage);

import LoginPage from '../pages/loginPage';
import OrderSimsPage from '../pages/orderSimsPage';

let testData;

describe('Order Sims - Bulk SIM Ordering', () => {

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
      cy.log('✅ Fixture loaded successfully');
      cy.log(JSON.stringify(testData, null, 2));
      expect(testData.orderSims, 'orderSims fixture should be defined').to.exist;
    });
  });

  it('should successfully place a bulk SIM order', () => {
    // Step 1: Login
    LoginPage.visit();
    LoginPage.enterEmail(testData.validUser.email);
    LoginPage.enterPassword(testData.validUser.password);
    LoginPage.showPassword();
    LoginPage.clickSignIn();

    // Wait until dashboard visible
    cy.contains('Order History', { timeout: 20000 }).should('be.visible');

    // Step 2: Go to Order Sims page
    OrderSimsPage.visit();
    cy.url().should('include', '/order-sims');

    // Step 3: Fill order details
    OrderSimsPage.enterRetailStoreName(testData.orderSims.storeName);
    OrderSimsPage.enterDeliveryAddress(testData.orderSims.deliveryAddress);
    OrderSimsPage.enterNumberOfSims(testData.orderSims.sims);
    OrderSimsPage.enterMessage(testData.orderSims.message);

    // Step 4: Submit order
    OrderSimsPage.clickOrderSims();

    cy.wait(5000); // wait for 5 seconds for popup to appear

    // Step 5: Handle popup
  OrderSimsPage.verifyOrderPopupAndClose();

     // Step 6: Navigate to order history
  OrderSimsPage.goToOrderHistory();

   // Step 7: Verify order appears
  OrderSimsPage.verifyOrderInHistory(
    testData.orderSims.storeName,
    testData.orderSims.sims,
    testData.orderSims.status
  );
  });
});
