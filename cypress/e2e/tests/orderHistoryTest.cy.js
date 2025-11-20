// ==============================================
// 📄 Order History Test Suite
// Covers RSO_FT_22 → RSO_FT_29
// ==============================================
console.log('Loaded OrderHistoryPage object:', OrderHistoryPage);

import LoginPage from '../pages/loginPage';
import OrderHistoryPage from '../pages/orderHistoryPage';

let testData;

describe('🧩 Order History Module - Functional Test Suite', () => {

  // -------------------------------------------------------
  // Load test data before suite execution
  // -------------------------------------------------------
  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
      cy.log('✅ Loaded test data successfully');
    });
  });

  // -------------------------------------------------------
  // Precondition: Login before each test
  // -------------------------------------------------------
  beforeEach(() => {
    LoginPage.visit();
    LoginPage.enterEmail(testData.validUser.email);
    LoginPage.enterPassword(testData.validUser.password);
    LoginPage.clickSignIn();
    cy.contains('Order History', { timeout: 20000 }).should('be.visible');
  });

  // -------------------------------------------------------
  // RSO_FT_22 – Verify navigation to Order History page
  // -------------------------------------------------------
  it('RSO_FT_22 – Verify navigation to Order History page', () => {
    OrderHistoryPage.navigate();
    cy.url().should('include', '/order-history');
    OrderHistoryPage.elements.pageTitle().should('contain.text', 'Order History');
    cy.log('✅ User successfully navigated to the Order History page');
  });

  // -------------------------------------------------------
  // RSO_FT_23 – Verify behavior when user has no order history
  // -------------------------------------------------------
  it('RSO_FT_23 – Verify page shows no order history when no data available', () => {
    OrderHistoryPage.navigate();

    cy.wait(1000);
    OrderHistoryPage.elements.tableRows().then(($rows) => {
      if ($rows.length === 0) {
        cy.log('⚠️ No orders present for this user.');
        OrderHistoryPage.elements.noDataMessage().should('exist');
      } else {
        cy.log('✅ User has existing order history; skipping empty state validation.');
      }
    });
  });

  // -------------------------------------------------------
  // RSO_FT_24 – Verify order history table headers and data
  // -------------------------------------------------------
  it('RSO_FT_24 – Verify Order History table structure and contents', () => {
    OrderHistoryPage.navigate();
    OrderHistoryPage.verifyTableHeaders();

    cy.wait(1000);
    OrderHistoryPage.elements.tableRows().then(($rows) => {
      if ($rows.length > 0) {
        OrderHistoryPage.verifyOrderPresence();
      } else {
        cy.log('⚠️ No order data to validate.');
      }
    });
  });

  // -------------------------------------------------------
  // RSO_FT_25 – Verify Order Details popup opens when clicking ID
  // -------------------------------------------------------
  it('RSO_FT_25 – Verify Order Details popup when clicking ID', () => {
    OrderHistoryPage.navigate();

    cy.wait(1000);
    OrderHistoryPage.elements.tableRows().then(($rows) => {
      if ($rows.length > 0) {
        OrderHistoryPage.openOrderDetailsPopup();
      } else {
        cy.log('⚠️ No order data to open popup.');
      }
    });
  });

  // -------------------------------------------------------
  // RSO_FT_26 – Search by Order ID
  // -------------------------------------------------------
  it('RSO_FT_26 – Verify search by Order ID', () => {
    OrderHistoryPage.navigate();

    const orderId = testData.orderHistory.validOrder.id;
    cy.log(`🔍 Searching for Order ID: ${orderId}`);

    OrderHistoryPage.searchAndVerify(orderId);
  });

  // -------------------------------------------------------
  // RSO_FT_27 – Search by Address
  // -------------------------------------------------------
  it('RSO_FT_27 – Verify search by Address', () => {
    OrderHistoryPage.navigate();

    const address = testData.orderHistory.validOrder.address;
    cy.log(`🔍 Searching for Address: ${address}`);

    OrderHistoryPage.searchAndVerify(address);
  });

  // -------------------------------------------------------
  // RSO_FT_28 – Search by Store Name
  // -------------------------------------------------------
  it('RSO_FT_28 – Verify search by Store Name', () => {
    OrderHistoryPage.navigate();

    const storeName = testData.orderHistory.validOrder.storeName;
    cy.log(`🔍 Searching for Store Name: ${storeName}`);

    OrderHistoryPage.searchAndVerify(storeName);
  });

  // -------------------------------------------------------
  // RSO_FT_29 – Search by Date
  // -------------------------------------------------------
  it('RSO_FT_29 – Verify search by Date', () => {
    OrderHistoryPage.navigate();

    const date = testData.orderHistory.validOrder.date;
    cy.log(`🔍 Searching for Date: ${date}`);

    OrderHistoryPage.searchAndVerify(date);
  });
});
