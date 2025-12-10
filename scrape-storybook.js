/**
 * Storybook Scraper for Impartner Design Components
 * Uses Puppeteer to extract component documentation from JS-rendered Storybook
 * 
 * Run: npm install puppeteer && node scrape-storybook.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const STORYBOOK_BASE = 'https://design.impartner.com/design-components/master';

// Pages to scrape - All components from Impartner Storybook
const PAGES_TO_SCRAPE = [
    // Getting Started & Design
    '?path=/docs/getting-started--docs',
    '?path=/docs/design-color-palette--color-palette',
    
    // Directives
    '?path=/docs/design-components-directives-impdcbranded--docs',
    '?path=/docs/design-components-directives-impdcsizedetector--docs',
    
    // Forms - Controls
    '?path=/docs/design-components-forms-demo--docs',
    '?path=/docs/design-components-forms-controls-checkbox--docs',
    '?path=/docs/design-components-forms-controls-checkbox-group--docs',
    '?path=/docs/design-components-forms-controls-input--docs',
    '?path=/docs/design-components-forms-controls-radio--docs',
    '?path=/docs/design-components-forms-controls-select--docs',
    '?path=/docs/design-components-forms-controls-select-native--docs',
    '?path=/docs/design-components-forms-controls-tag-select--docs',
    '?path=/docs/design-components-forms-controls-text-area--docs',
    '?path=/docs/design-components-forms-input-groups--docs',
    
    // Design Components
    '?path=/docs/design-components-alert--docs',
    '?path=/docs/design-components-avatar--docs',
    '?path=/docs/design-components-avatar-group--docs',
    '?path=/docs/design-components-badge--docs',
    '?path=/docs/design-components-breadcrumb--docs',
    '?path=/docs/design-components-button--docs',
    '?path=/docs/design-components-button-group--docs',
    '?path=/docs/design-components-card-heading--docs',
    '?path=/docs/design-components-data-card--docs',
    '?path=/docs/design-components-datetime-picker-form-input--docs',
    '?path=/docs/design-components-datetime-picker-standalone--docs',
    '?path=/docs/design-components-file-upload--docs',
    '?path=/docs/design-components-icon--docs',
    '?path=/docs/design-components-icon-select--docs',
    '?path=/docs/design-components-modal-layout--docs',
    '?path=/docs/design-components-pagination--docs',
    '?path=/docs/design-components-progress-bar--docs',
    '?path=/docs/design-components-scrollable--docs',
    '?path=/docs/design-components-spinner--docs',
    '?path=/docs/design-components-table--docs',
    '?path=/docs/design-components-tag--docs',
    '?path=/docs/design-components-text-highlight--docs',
    
    // Deprecated
    '?path=/docs/deprecated-dropdown--docs',
    '?path=/docs/deprecated-modal--docs',
    
    // NG Bootstrap
    '?path=/docs/ng-bootstrap-dropdown--docs',
    '?path=/docs/ng-bootstrap-modal--docs',
    '?path=/docs/ng-bootstrap-nav--docs',
    '?path=/docs/ng-bootstrap-tooltip--docs',
];

async function scrapeStorybook() {
    console.log('🚀 Launching browser...');
    
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const results = {};
    
    for (const pagePath of PAGES_TO_SCRAPE) {
        const url = `${STORYBOOK_BASE}/${pagePath}`;
        const pageName = pagePath.split('--')[0].split('path=/docs/')[1] || pagePath;
        
        console.log(`📄 Scraping: ${pageName}`);
        
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Wait for Storybook to render
            await page.waitForSelector('#storybook-preview-wrapper', { timeout: 10000 }).catch(() => {});
            
            // Wait a bit more for dynamic content
            await new Promise(r => setTimeout(r, 3000));
            
            // Extract content from the docs panel
            const content = await page.evaluate(() => {
                const data = {
                    title: '',
                    description: '',
                    codeExamples: [],
                    cssClasses: [],
                    htmlExamples: []
                };
                
                // Get title
                const titleEl = document.querySelector('.sbdocs-title, h1');
                if (titleEl) data.title = titleEl.textContent.trim();
                
                // Get description
                const descEl = document.querySelector('.sbdocs-description, .sbdocs-p');
                if (descEl) data.description = descEl.textContent.trim();
                
                // Get all code blocks
                const codeBlocks = document.querySelectorAll('pre code, .docblock-source code, .prismjs');
                codeBlocks.forEach(block => {
                    const code = block.textContent.trim();
                    if (code.length > 10) {
                        data.codeExamples.push(code);
                    }
                });
                
                // Look for HTML in preview iframe
                const previewFrame = document.querySelector('#storybook-preview-iframe');
                if (previewFrame && previewFrame.contentDocument) {
                    const previewBody = previewFrame.contentDocument.body;
                    if (previewBody) {
                        // Get all class names used
                        const allElements = previewBody.querySelectorAll('*');
                        const classes = new Set();
                        allElements.forEach(el => {
                            el.classList.forEach(cls => classes.add(cls));
                        });
                        data.cssClasses = Array.from(classes).filter(c => 
                            c.includes('impdc') || 
                            c.includes('btn') || 
                            c.includes('form') ||
                            c.includes('alert') ||
                            c.includes('badge') ||
                            c.includes('card')
                        );
                        
                        // Get sample HTML
                        const mainContent = previewBody.querySelector('.sb-main-padded, #storybook-root, .innerZoomElementWrapper');
                        if (mainContent) {
                            data.htmlExamples.push(mainContent.innerHTML.substring(0, 2000));
                        }
                    }
                }
                
                // Get all text content from the docs area
                const docsArea = document.querySelector('.sb-main-padded, #storybook-docs, .sbdocs');
                if (docsArea) {
                    data.docsText = docsArea.innerText.substring(0, 5000);
                }
                
                // Get the full page HTML for analysis
                data.pageHtml = document.body.innerHTML.substring(0, 10000);
                
                return data;
            });
            
            results[pageName] = content;
            
        } catch (err) {
            console.error(`  ❌ Error scraping ${pageName}: ${err.message}`);
            results[pageName] = { error: err.message };
        }
    }
    
    await browser.close();
    
    // Save results
    const outputPath = './impartner-components.json';
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n✅ Results saved to ${outputPath}`);
    
    // Also create a summary
    console.log('\n📋 SUMMARY:');
    console.log('============');
    for (const [page, data] of Object.entries(results)) {
        console.log(`\n${page}:`);
        console.log(`  Title: ${data.title || 'N/A'}`);
        console.log(`  CSS Classes: ${data.cssClasses?.join(', ') || 'None found'}`);
        console.log(`  Code Examples: ${data.codeExamples?.length || 0}`);
    }
    
    return results;
}

// Run the scraper
scrapeStorybook().catch(console.error);
