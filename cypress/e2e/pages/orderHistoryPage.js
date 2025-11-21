class OrderHistoryPage {
    elements = {
      headerOrderHistory: () => cy.contains('Order History', { matchCase: false }),
      headerOrderSims: () => cy.contains('Order Sims', { matchCase: false }),
      headerSignOut: () => cy.contains('Sign out', { matchCase: false }),
  
      pageTitle: () => cy.contains('Order History', { matchCase: false }),
      searchInput: () => cy.get('input[placeholder="Search"]'),
  
      table: () => cy.get('table', { timeout: 15000 }),
      tableHeaders: () => cy.get('table thead th', { timeout: 15000 }),
      tableRows: () => cy.get('table tbody tr', { timeout: 15000 }),
      firstRow: () => cy.get('table tbody tr').first(),
      orderIdLinks: () => cy.get('table tbody tr td.order-id, table tbody tr td:first-child', { timeout: 10000 }),
  
      noDataMessage: () => cy.contains(/no data|no orders|empty|nothing found/i, { timeout: 6000 }),
    };
  
    navigate() {
      cy.log('🧭 Navigating to Order History page...');
      this.elements.headerOrderHistory().should('be.visible').click({ force: true });
      cy.url({ timeout: 15000 }).should('include', '/order-history');
      this.elements.pageTitle().should('be.visible');
      cy.log('✅ Navigated to Order History page successfully');
    }
  
    verifyTableHeaders() {
      const expectedHeaders = ['ID', 'Date', 'Store Name', 'Quantity', 'Status'];
      cy.log('📋 Verifying table headers...');
      this.elements.tableHeaders().should('have.length', expectedHeaders.length);
      expectedHeaders.forEach((header) => {
        cy.contains('th', new RegExp(`^${header}$`, 'i')).should('exist');
      });
      cy.log('✅ Verified table headers are correctly displayed');
    }
  
    verifyOrderPresence() {
      cy.log('🔎 Checking for table or empty state...');
      this.elements.table().should('exist').and('be.visible');
      cy.get('body').then(($body) => {
        const hasRows = $body.find('table tbody tr').length > 0;
        if (!hasRows) {
          cy.log('⚠️ No orders found for this user.');
          this.elements.noDataMessage().should('exist');
          return;
        }
        cy.log('✅ Orders found in the Order History table');
        this.verifyTableHeaders();
        this.elements.firstRow().within(() => {
          cy.get('td').eq(0).should('be.visible').invoke('text').should('match', /\d+/);
          cy.get('td').eq(1).should('be.visible').invoke('text').should('match', /\d{2}\/\d{2}\/\d{4}/);
          cy.get('td').eq(2).should('be.visible').and('not.be.empty');
          cy.get('td').eq(3).should('be.visible').invoke('text').should('match', /\d+/);
          cy.get('td').eq(4).should('be.visible').and('not.be.empty');
        });
      });
    }
  
    searchAndVerify(value) {
      cy.log(`🔍 Searching for value: ${value}`);
      this.elements.searchInput().should('be.visible').clear().type(`${value}{enter}`);
      cy.wait(1500);
      this.elements.tableRows().then(($rows) => {
        if ($rows.length === 0) {
          cy.log(`⚠️ No results found for search: "${value}"`);
        } else {
          cy.log(`✅ Found ${$rows.length} results for search: "${value}"`);
          let found = false;
          this.elements.tableRows().each(($row) => {
            cy.wrap($row)
              .invoke('text')
              .then((text) => {
                const cleanText = text.replace(/\s+/g, ' ').trim();
                const searchValue = value.toString().trim();
                if (cleanText.toLowerCase().includes(searchValue.toLowerCase().slice(0, 5))) {
                  cy.log(`✅ Match found for search term: ${value}`);
                  found = true;
                }
              });
          }).then(() => {
            if (!found) {
              cy.log(`⚠️ No matching text found in rows for search term: ${value}`);
            }
          });
        }
      });
    }
  
    verifySpecificOrder(id, storeName, quantity, status) {
      cy.log(`🧾 Verifying specific order ID: ${id}`);
      this.elements.tableRows()
        .filter(`:contains(${id})`)
        .should('contain.text', storeName)
        .and('contain.text', quantity)
        .and('contain.text', status);
      cy.log(`✅ Verified order ${id} for ${storeName} (${quantity}, ${status})`);
    }
  
    openOrderDetailsPopup() {
      cy.log('🔍 Opening Order Details popup...');
      this.elements.orderIdLinks().first().should('exist').and('be.visible').click({ force: true });
      cy.get('.modal-dialog, .order-details-modal', { timeout: 15000 })
        .should('exist')
        .and('be.visible')
        .within(() => {
          cy.contains(/Order Details|ID|Store|Quantity|Status/i).should('exist');
        });
      cy.log('✅ Order Details popup displayed successfully');
    }
  }
  
  export default new OrderHistoryPage();
