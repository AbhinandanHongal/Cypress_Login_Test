// cypress/support/smartLocators.js
Cypress.Commands.add('smartGet', (selectors, options = {}) => {
    if (typeof selectors === 'string') selectors = [selectors];
  
    let found = false;
    let lastError = null;
  
    for (const sel of selectors) {
      try {
        const el = cy.get(sel, options);
        el.then(($el) => {
          if ($el.length > 0) {
            found = true;
            cy.log(`✅ Found element using selector: ${sel}`);
            return el;
          }
        });
        if (found) break;
      } catch (err) {
        lastError = err;
      }
    }
  
    if (!found && lastError) throw lastError;
    if (!found) throw new Error(`❌ None of the selectors matched: ${selectors.join(', ')}`);
  });
  